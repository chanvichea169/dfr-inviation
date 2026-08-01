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

interface GoogleCredentials {
  clientEmail: string;
  privateKey: string;
}

function decodeBase64(value: string): string {
  return Buffer.from(value, "base64").toString("utf8");
}

function parseServiceAccountJson(rawValue: string): GoogleCredentials {
  try {
    const parsed = JSON.parse(rawValue);
    if (
      typeof parsed.client_email === "string" &&
      typeof parsed.private_key === "string"
    ) {
      return {
        clientEmail: parsed.client_email,
        privateKey: normalizePrivateKey(parsed.private_key, "service account JSON"),
      };
    }
  } catch {
    throw new Error(
      "Google service account JSON could not be parsed. Re-copy the full JSON file content, or use GOOGLE_SERVICE_ACCOUNT_JSON_BASE64.",
    );
  }

  throw new Error(
    "Google service account JSON must include client_email and private_key.",
  );
}

function getKeyShape(value: string): Record<string, boolean | number> {
  return {
    length: value.length,
    hasBegin: value.includes("-----BEGIN PRIVATE KEY-----"),
    hasEnd: value.includes("-----END PRIVATE KEY-----"),
    hasEscapedNewlines: value.includes("\\n"),
    lineCount: value.split("\n").length,
  };
}

function normalizePrivateKey(rawValue: string, source = "GOOGLE_PRIVATE_KEY"): string {
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
  } catch (error: any) {
    throw new Error(
      `${source} could not be decoded by OpenSSL. Re-copy the private_key from the Google service account JSON, keeping the BEGIN/END lines and newline escapes. Key shape: ${JSON.stringify(getKeyShape(value))}. OpenSSL message: ${error?.message || "unknown"}`,
    );
  }

  return value;
}

function loadGoogleCredentials(): GoogleCredentials {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64) {
    return parseServiceAccountJson(
      decodeBase64(process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64),
    );
  }

  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    return parseServiceAccountJson(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  }

  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const rawPrivateKey =
    process.env.GOOGLE_PRIVATE_KEY_BASE64 ?
      decodeBase64(process.env.GOOGLE_PRIVATE_KEY_BASE64)
    : process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail || !rawPrivateKey) {
    throw new Error(
      "Missing Google credentials. Set GOOGLE_SERVICE_ACCOUNT_JSON_BASE64, or set GOOGLE_CLIENT_EMAIL with GOOGLE_PRIVATE_KEY or GOOGLE_PRIVATE_KEY_BASE64.",
    );
  }

  return {
    clientEmail,
    privateKey: normalizePrivateKey(
      rawPrivateKey,
      process.env.GOOGLE_PRIVATE_KEY_BASE64 ?
        "GOOGLE_PRIVATE_KEY_BASE64"
      : "GOOGLE_PRIVATE_KEY",
    ),
  };
}

export async function appendInvitation(
  body: InvitationPayload,
): Promise<{ updatedCells?: number | null }> {
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const credentials = loadGoogleCredentials();

  console.log("Google ENV check:", {
    clientEmail: !!credentials.clientEmail,
    privateKey: !!credentials.privateKey,
    spreadsheetId: !!spreadsheetId,
  });

  if (!spreadsheetId) {
    throw new Error(
      "Missing Google spreadsheet id. Set GOOGLE_SPREADSHEET_ID.",
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: credentials.clientEmail,
      private_key: credentials.privateKey,
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
