# Panini Sticker Pack Tracker

Web app for tracking sticker pack purchases.

## Features
- Record number of packs purchased
- Each pack contains 7 stickers at €1.50 each
- Tracks total stickers accumulated and total spent
- Data persisted in `data.json` file

## Setup

```bash
npm install
npm start
```

Open http://localhost:3000 in your browser.

## API Endpoints
- `GET /api/purchases` - Get all purchases
- `POST /api/purchases` - Add new purchase (body: `{packs: number}`)
- `DELETE /api/purchases/:id` - Delete purchase