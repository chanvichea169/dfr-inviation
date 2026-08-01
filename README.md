# Invitation App

React/Vite invitation form with a Vercel serverless API that appends submissions through Sheety.

## Sheety API

The serverless function posts to:

```text
https://api.sheety.co/e47dcae5ed33aa21c3b1cad5e3644552/invitation/sheet1
```

No Google service-account environment variables are required.

Your Google Sheet first row must contain these exact headers:

```text
timestamp | title | description | date | time | province | district | commune | village
```

Sheety only writes values for columns that already exist in the header row. If a header is missing or spelled differently, that cell will stay blank.

Optional Vercel environment variable:

```env
SHEETY_BEARER_TOKEN=
```

Only set `SHEETY_BEARER_TOKEN` if your Sheety project requires bearer-token auth.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```
