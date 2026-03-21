# PayNow Collect

A React web app for frontline delivery staff to collect payments via PayNow QR codes in Singapore.

## Features

- **PIN-based auth** — Staff PIN (`1234`) for payment flow; Admin PIN (`9999`) for payment + account management
- **Multi-account support** — Select the correct payee account per delivery
- **4-step payment flow** — Account select → Payment details → QR display → Confirmation
- **Dynamic QR generation** — EMVCo TLV format with CRC-16, works with all Singapore banking apps
- **Static QR support** — Upload an image file or paste a URL
- **Payment log** — Session history with Google Sheets sync via Apps Script
- **Account settings** (admin only) — Add, edit, delete payee accounts with emoji/image logos
- **Offline-first** — Accounts and log persisted in `localStorage`

## Tech

- React 19 + Vite
- `qrcode.react` for dynamic QR generation
- DM Sans font, mobile-first layout, no external UI library

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Configuration

Edit `src/constants/seeds.js` to configure:

| Constant | Default | Description |
|---|---|---|
| `STAFF_PIN` | `1234` | Staff login PIN |
| `ADMIN_PIN` | `9999` | Admin login PIN |
| `APPS_SCRIPT_URL` | `PLACEHOLDER_APPS_SCRIPT_URL` | Google Apps Script Web App URL for Sheets sync |

## Google Sheets Sync

Deploy a Google Apps Script Web App that accepts a POST request and appends a row. The payload sent is:

```json
{
  "accountName": "Rolo Central Kitchen",
  "orderId": "ORD-001",
  "customerName": "Jane Doe",
  "amount": "12.50",
  "timestamp": "2026-03-21T10:00:00.000Z"
}
```

Replace `PLACEHOLDER_APPS_SCRIPT_URL` in `src/constants/seeds.js` with your deployed script URL.
