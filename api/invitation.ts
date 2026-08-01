import type { VercelRequest, VercelResponse } from "@vercel/node";
import { appendInvitation } from "./_sheets.js";
import { notifyTelegram } from "./_telegram.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res
      .status(405)
      .json({ success: false, error: "Method Not Allowed" });
  }

  try {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : req.body || {};

    const result = await appendInvitation(body);

    let telegramSent = false;
    let telegramError: string | undefined;

    try {
      telegramSent = await notifyTelegram({ invitation: body, rowId: result.id });
    } catch (notificationError) {
      telegramError = notificationError instanceof Error ? notificationError.message : String(notificationError);
      console.error("Telegram notification error:", notificationError);
    }

    return res.status(200).json({
      success: true,
      id: result.id,
      telegramSent,
      ...(telegramError ? { telegramError } : {}),
    });
  } catch (error: any) {
    console.error("Invitation API Error:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to append data",
    });
  }
}
