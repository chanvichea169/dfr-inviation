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

function normalizeTelegramChatId(chatId: string): string {
  const trimmedChatId = chatId.trim();

  if (/^100\d+$/.test(trimmedChatId)) {
    return `-${trimmedChatId}`;
  }

  return trimmedChatId;
}

function buildPermissionText(invitation: InvitationPayload): string {
  if (invitation.requestText?.trim()) {
    return formatValue(invitation.requestText);
  }

  return [
    `ឈ្មោះ ៖ ${formatValue(invitation.name)}`,
    `តួនាទី ៖ ${formatValue(invitation.role)}`,
    `ការិយាល័យ ៖ ${formatValue(invitation.office)}`,
    `ស្នើសុំអនុញ្ញាតច្បាប់ ៖ ${formatValue(invitation.leaveDuration)}`,
    `ចាប់ពីថ្ងៃទី ៖ ${formatValue(invitation.startDate)}`,
    `ដល់ថ្ងៃទី ៖ ${formatValue(invitation.endDate)}`,
    `មូលហេតុ ៖ ${formatValue(invitation.reason)}`,
    "",
    "____________________________________",
    `ធ្វើនៅថ្ងៃទី ៖ ${formatValue(invitation.madeAt)}`,
  ].join("\n");
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
    "<b>សំណើសុំអនុញ្ញាតច្បាប់ថ្មី</b>",
    "--------------------",
    buildPermissionText(invitation),
  ]
    .filter(Boolean)
    .join("\n");
}

export async function notifyTelegram(
  input: TelegramNotifyInput,
): Promise<boolean> {
  const botToken =
    process.env.TELEGRAM_BOT_TOKEN ||
    "8595782308:AAFQW-v32c8NtPDJev3nj03eM_AYNfAlb50";

  const chatId = process.env.TELEGRAM_CHAT_ID || "-1004465489324";

  if (!botToken || !chatId) {
    throw new Error(
      "Telegram notification is not configured: set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.",
    );
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
