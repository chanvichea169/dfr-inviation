# Invitation App

React/Vite invitation form with a Vercel serverless API that appends submissions to Google Sheets.

## Environment Variables

Set these locally in `.env` and in Vercel under Project Settings -> Environment Variables:

Recommended Vercel setup:

```env
GOOGLE_SERVICE_ACCOUNT_JSON_BASE64=base64_encoded_service_account_json
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id
```

Create `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64` from the downloaded Google service account JSON file with PowerShell:

```powershell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes((Get-Content .\service-account.json -Raw)))
```

Alternative separate-value setup:

```env
GOOGLE_CLIENT_EMAIL=my-service-account@my-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id
```

If you only want to encode the private key, base64 encode the full `private_key` value from the Google service account JSON, including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines, then set:

```env
GOOGLE_PRIVATE_KEY_BASE64=base64_encoded_private_key
```

Use `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64`, or the separate `GOOGLE_CLIENT_EMAIL` plus private key variables.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```
