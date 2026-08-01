import type { VercelRequest, VercelResponse } from "@vercel/node";
import { appendInvitation } from "./_sheets.js";

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

    return res
      .status(200)
      .json({ success: true, updatedCells: result.updatedCells });
  } catch (error: any) {
    console.error("Google Sheets API Error:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to append data",
    });
  }
}
