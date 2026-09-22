// Underscore-prefixed files in /api are NOT deployed as serverless routes by
// Vercel. This is a shared helper used by api/invitation.ts.

declare const process: {
  env: Record<string, string | undefined>;
};

const DEFAULT_SHEETY_API_URL =
  "https://api.sheety.co/e47dcae5ed33aa21c3b1cad5e3644552/invitation/sheet1";

export interface InvitationPayload {
  name?: string;
  role?: string;
  office?: string;
  leaveDuration?: string;
  startDate?: string;
  endDate?: string;
  reason?: string;
  madeAt?: string;
  requestText?: string;
}

export interface InvitationAppendResult {
  id?: number | string;
}

const expectedColumns = [
  "timestamp",
  "name",
  "role",
  "office",
  "leaveDuration",
  "startDate",
  "endDate",
  "reason",
  "madeAt",
  "requestText",
];

export async function appendInvitation(
  body: InvitationPayload,
): Promise<InvitationAppendResult> {
  const sheetyBearerToken = process.env.SHEETY_BEARER_TOKEN;

  const {
    name,
    role,
    office,
    leaveDuration,
    startDate,
    endDate,
    reason,
    madeAt,
    requestText,
  } = body;

  const sheet1 = {
    timestamp: new Date().toISOString(),
    name: name ?? "",
    role: role ?? "",
    office: office ?? "",
    leaveDuration: leaveDuration ?? "",
    startDate: startDate ?? "",
    endDate: endDate ?? "",
    reason: reason ?? "",
    madeAt: madeAt ?? "",
    requestText: requestText ?? "",
  };

  const response = await fetch(DEFAULT_SHEETY_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(sheetyBearerToken
        ? { Authorization: `Bearer ${sheetyBearerToken}` }
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
    console.warn(
      `Sheety created a row, but these columns were not returned: ${missingColumns.join(", ")}. Check the Google Sheets headers if any values are missing.`,
    );
  }

  return {
    id: data?.sheet1?.id,
  };
}
