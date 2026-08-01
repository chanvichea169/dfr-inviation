import { google } from "googleapis";
import { createPrivateKey } from "node:crypto";

// Underscore-prefixed files in /api are NOT deployed as serverless routes by
// Vercel — this is a shared helper used by api/invitation.ts.

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

function decodeBase64(value: string): string {
  return Buffer.from(value, "base64").toString("utf8");
}

function normalizePrivateKey(rawValue: string): string {
  let value = rawValue.trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  if (value.startsWith("{")) {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed.private_key === "string") {
        value = parsed.private_key;
      }
    } catch {
      throw new Error(
        "GOOGLE_PRIVATE_KEY looks like JSON but could not be parsed. Use only the private_key value, or set GOOGLE_PRIVATE_KEY_BASE64.",
      );
    }
  }

  value = value
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .trim();

  if (!value.includes("-----BEGIN PRIVATE KEY-----")) {
    throw new Error(
      "GOOGLE_PRIVATE_KEY is not a valid PEM private key. In Vercel, paste the private_key value with \\n escapes, or use GOOGLE_PRIVATE_KEY_BASE64.",
    );
  }

  try {
    createPrivateKey(value);
  } catch {
    throw new Error(
      "GOOGLE_PRIVATE_KEY could not be decoded by OpenSSL. Re-copy the private_key from the Google service account JSON, keeping the BEGIN/END lines and newline escapes.",
    );
  }

  return value;
}

export async function appendInvitation(
  body: InvitationPayload,
): Promise<{ updatedCells?: number | null }> {
  const rawPrivateKey =
    process.env.GOOGLE_PRIVATE_KEY_BASE64 ?
      decodeBase64(process.env.GOOGLE_PRIVATE_KEY_BASE64)
    : process.env.GOOGLE_PRIVATE_KEY;
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

  console.log("Google ENV check:", {
    clientEmail: !!clientEmail,
    privateKey: !!rawPrivateKey,
    spreadsheetId: !!spreadsheetId,
  });

  if (!clientEmail || !rawPrivateKey || !spreadsheetId) {
    throw new Error(
      "Missing Google credentials. Set GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY or GOOGLE_PRIVATE_KEY_BASE64, and GOOGLE_SPREADSHEET_ID.",
    );
  }

  const privateKey = normalizePrivateKey(rawPrivateKey);

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({
    version: "v4",
    auth,
  });

  const {
    title,
    description,
    date,
    time,
    province,
    district,
    commune,
    village,
  } = body;

  const newRow = [
    new Date().toISOString(),
    title ?? "",
    description ?? "",
    date ?? "",
    time ?? "",
    province ?? "",
    district ?? "",
    commune ?? "",
    village ?? "",
  ];

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [newRow],
      },
    });

    console.log("Google Sheet updated:", {
      updatedCells: response.data.updates?.updatedCells,
    });

    return {
      updatedCells: response.data.updates?.updatedCells,
    };
  } catch (error: any) {
    console.error("Google Sheets API Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    throw new Error(
      error.response?.data?.error?.message ||
        error.message ||
        "Failed to update Google Sheet",
    );
  }
}
