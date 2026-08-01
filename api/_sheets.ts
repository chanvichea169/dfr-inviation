import { google } from "googleapis";

// Underscore-prefixed files in /api are NOT deployed as serverless routes by
// Vercel — this is a shared helper used by both api/invitation.ts (production)
// and the Vite dev middleware (local `npm run dev`).

export interface InvitationPayload {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  province?: string;
  district?: string;
  commune?: string;
  village?: string;
}

export async function appendInvitation(
  body: InvitationPayload
): Promise<{ updatedCells?: number | null }> {
  const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY || "";
  const privateKey = rawPrivateKey.replace(/\\n/g, "\n");
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

  if (!clientEmail || !privateKey || !spreadsheetId) {
    throw new Error(
      "Missing Google credentials. Set GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY and GOOGLE_SPREADSHEET_ID."
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: clientEmail, private_key: privateKey },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const { title, description, date, time, province, district, commune, village } = body;
  const newRow = [
    new Date().toISOString(),
    title || "",
    description || "",
    date || "",
    time || "",
    province || "",
    district || "",
    commune || "",
    village || "",
  ];

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A1",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [newRow] },
  });

  return { updatedCells: response.data.updates?.updatedCells };
}
