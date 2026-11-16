# EV HEXA (Next.js + optional MongoDB + optional Cloudinary)

## Run locally (2 commands)
Requires Node.js 18.17+ (Node 20 LTS recommended).

```bash
npm install
npm run dev        # -> http://localhost:3000
```
No database or keys are needed. With no `.env.local`, the site uses a local file store
(`data/db.json`, seeded with demo content on first run) and keeps uploads in `data/uploads/`.
To reset the demo content, stop the server and delete the `data/` folder.

## Production build
```bash
npm run build
npm start          # -> http://localhost:3000
```

## Admin
Footer -> **Admin Login**. Default password `12345` (set `ADMIN_PASSWORD` to change it; it is checked on the server for every admin write).
Admin can add / edit / delete features and articles, upload images or videos, and set an SEO meta description per article.
Feature media accepts an image URL, an mp4/webm URL, or a YouTube link.

## Using MongoDB and Cloudinary (real deployment)
Copy `.env.example` to `.env.local` and fill in `MONGODB_URI` and the `CLOUDINARY_*` values.
When `MONGODB_URI` is set the site uses MongoDB; when the Cloudinary keys are set uploads go to Cloudinary.

## Structure
- `app/page.js` – the whole UI (hero, theme menu, features, articles, reviews, admin)
- `app/globals.css` – theme (night/day), car + road animation, intro
- `app/api/*` – REST routes (features, articles, reviews, upload, uploads, admin)
- `lib/store.js` – data layer (MongoDB or local JSON); `lib/db.js`, `models/index.js`
- `public/` – logo, hero photos (`hero/`), car and day-scene art (`art/`)

## Before going live
Replace the placeholder phone, e-mail, address and social links in the footer (`app/page.js`) and change `ADMIN_PASSWORD`.
