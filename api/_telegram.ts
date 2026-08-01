import type { InvitationPayload } from "./_sheets.js";

declare const process: {
  env: Record<string, string | undefined>;
};

interface TelegramNotifyInput {
  invitation: InvitationPayload;
  rowId?: number | string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatValue(value: string | undefined): string {
  return escapeHtml(value?.trim() || "-");
}

function formatDate(value: string | undefined): string {
  if (!value) {
    return "-";
  }

  const parsedDate = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return formatValue(value);
  }

  return escapeHtml(
    new Intl.DateTimeFormat("en-GB", {
      dateStyle: "full",
      timeZone: "Asia/Phnom_Penh",
    }).format(parsedDate),
  );
}

function normalizeTelegramChatId(chatId: string): string {
  const trimmedChatId = chatId.trim();

  if (/^100\d+$/.test(trimmedChatId)) {
    return `-${trimmedChatId}`;
  }

  return trimmedChatId;
}

function buildTelegramMessage({
  invitation,
  rowId,
}: TelegramNotifyInput): string {
  const submittedAt = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Phnom_Penh",
  }).format(new Date());

  return [
    "\u2728 <b>New Invitation Created</b>",
    "--------------------",
    "",
    "\u{1F4CC} <b>Title</b>",
    formatValue(invitation.title),
    "",
    "\u{1F5D3} <b>Schedule</b>",
    `Date: ${formatDate(invitation.date)}`,
    `Time: ${formatValue(invitation.time)}`,
    "",
    "\u{1F4CD} <b>Location</b>",
    `Province: ${formatValue(invitation.province)}`,
    `District: ${formatValue(invitation.district)}`,
    `Commune: ${formatValue(invitation.commune)}`,
    `Village: ${formatValue(invitation.village)}`,
    "",
    "\u{1F4DD} <b>Description</b>",
    formatValue(invitation.description),
    "",
    "--------------------",
    `Sheet row: ${rowId ? escapeHtml(String(rowId)) : "-"}`,
    `Submitted: ${escapeHtml(submittedAt)}`,
  ].join("\n");
}

export async function notifyTelegram(
  input: TelegramNotifyInput,
): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    throw new Error("Telegram notification is not configured: set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.");
  }

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: normalizeTelegramChatId(chatId),
        text: buildTelegramMessage(input),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    },
  );

  if (!response.ok) {
    const responseBody = await response.text();
    throw new Error(
      `Telegram notification failed with status ${response.status}: ${responseBody}`,
    );
  }
  return true;
}
