import { google } from "googleapis";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, date, time, province, district, commune, village } = body;

    const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY || "";
    const privateKey = rawPrivateKey.replace(/\\n/g, "\n");

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

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
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [newRow],
      },
    });

    return Response.json({ success: true, updatedCells: response.data.updates?.updatedCells });
  } catch (error: any) {
    console.error("Google Sheets API Error:", error);
    return Response.json(
      { success: false, error: error.message || "Failed to append data" },
      { status: 500 }
    );
  }
}