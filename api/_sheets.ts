// Underscore-prefixed files in /api are NOT deployed as serverless routes by
// Vercel. This is a shared helper used by api/invitation.ts.

const DEFAULT_SHEETY_API_URL =
  "https://api.sheety.co/e47dcae5ed33aa21c3b1cad5e3644552/invitation/sheet1";

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

export interface InvitationAppendResult {
  id?: number | string;
}

const expectedColumns = [
  "timestamp",
  "title",
  "description",
  "date",
  "time",
  "province",
  "district",
  "commune",
  "village",
];

export async function appendInvitation(
  body: InvitationPayload,
): Promise<InvitationAppendResult> {
  const sheetyBearerToken = process.env.SHEETY_BEARER_TOKEN;

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

  const sheet1 = {
    timestamp: new Date().toISOString(),
    title: title ?? "",
    description: description ?? "",
    date: date ?? "",
    time: time ?? "",
    province: province ?? "",
    district: district ?? "",
    commune: commune ?? "",
    village: village ?? "",
  };

  const response = await fetch(DEFAULT_SHEETY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(sheetyBearerToken ?
        { Authorization: `Bearer ${sheetyBearerToken}` }
      : {}),
    },
    body: JSON.stringify({
      sheet1,
    }),
  });

  const responseBody = await response.text();
  const data = responseBody ? JSON.parse(responseBody) : {};
  const sheetyError =
    data?.errors?.[0]?.detail || data?.error || data?.message || "";

  if (!response.ok) {
    console.error("Sheety API Error:", {
      status: response.status,
      data,
    });

    if (sheetyError.includes("POST has been disabled")) {
      throw new Error(
        "Sheety POST is disabled for sheet1. Open your Sheety project, select the sheet1 endpoint, and enable POST/Add row for this sheet.",
      );
    }

    throw new Error(
      sheetyError || `Sheety request failed with status ${response.status}`,
    );
  }

  console.log("Sheety row created:", {
    id: data?.sheet1?.id,
    keys: Object.keys(data?.sheet1 || {}),
  });

  const createdRow = data?.sheet1 || {};
  const missingColumns = expectedColumns.filter(
    (column) => !(column in createdRow),
  );

  if (missingColumns.length > 0) {
    throw new Error(
      `Sheety created a row, but these columns were not returned: ${missingColumns.join(", ")}. Make sure the first row in Google Sheets contains these exact headers: ${expectedColumns.join(", ")}.`,
    );
  }

  return {
    id: data?.sheet1?.id,
  };
}
