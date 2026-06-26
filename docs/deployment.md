# Deployment

Version: 1.0
Owner: Kevin Sauvageau
Product: Project Phoenix OS
Status: Living Document

## Recommended Free Host

Use Cloudflare Workers for the current app.

Why:

- The app already builds to Cloudflare/Nitro output.
- Cloudflare provides a free `workers.dev` URL.
- The free tier is enough for personal daily use.
- No Lovable credits are required.

## Current Persistence Model

Phoenix OS is currently local-first.

Daily check-ins are stored in browser `localStorage`.

This means:

- Data persists on the same browser and device.
- Phone data and Mac data are separate.
- Clearing browser data can delete entries.
- A deployed URL makes phone usage easy, but it does not create cloud sync by itself.

Before long-term daily use, add:

- Export all data as JSON
- Import data from JSON

After the daily workflow stabilizes, add Supabase for cross-device sync and durable storage.

## One-Time Setup

Install dependencies:

```bash
npm install --package-lock=false
```

Log in to Cloudflare:

```bash
npx wrangler login
```

## Deploy

```bash
npm run deploy:cloudflare
```

The first deployment should create a `workers.dev` URL.

Open that URL from the phone browser and add it to the home screen.

## Local Preview

```bash
npm run dev -- --host 127.0.0.1 --port 8080
```

Open:

```text
http://127.0.0.1:8080/
```
