# EV HEXA – changes guide (kahan kya change karna hai)

## 1. Header +25% (app/page.js, <header>)
- `py-3` -> `py-[15px]`  (header height)
- logo `h-12 w-12` -> `h-[60px] w-[60px]`  (48px x 1.25)
- nav links `text-sm` -> `text-[17.5px] font-semibold`  (14px x 1.25)
- ThemeMenu.js: button `p-2` -> `p-2.5`, icon `18` -> `22`

## 2. Hero 50% chhota + EV News callout (app/page.js, globals.css, EvSections.js)
- Hero content: `pb-56 pt-20 md:pb-60 md:pt-28` -> `pb-24 pt-8`; h1 `text-5xl md:text-7xl` -> `text-4xl md:text-5xl`
- Road/car wrapper `h-60` -> `h-40`; car `bottom-[48px]` -> `bottom-[33px]`
- globals.css end: "compact hero" block (.hero-rig, .hero-road 64px, day-far/near/trees)
- Hero ke neeche `<NewsBanner news={news} admin={!!pw} onManage={goAdmin} />` (components/EvSections.js)
- Admin: AdminPanel me "Add EV news" form (headline, summary, link, photo upload) + "Manage EV news" list (Edit / Delete)
- Backend: models/index.js `News`, app/api/news/route.js (GET/POST), app/api/news/[id]/route.js (PUT/DELETE)

## 3. EV Finder bar (EvShowcase -> #finder)
- `max-w-6xl` section, card `min-h-[190px] md:h-[200px]` (180-220px range)
- Theme styling: `.finder` class in globals.css (purple/orange gradient, #120f2a panel, day-theme variant included)
- Dropdowns use `.inp`, button uses `.btn` -> same as rest of site

## 4. Popular Electric Vehicles carousel (EvShowcase -> #popular)
- Card `w-[222px] h-[390px]`, arch image box 150px, brand+model, "Starting Rs X Lakh*", 2-col Top Speed/Range with icons, full-width `btn` CTA
- `Scroller` + `.bleed` (globals.css) => 5 cards visible, 6th right edge par half-cut
- "View All ->" toggles full grid; data in lib/vehicles.js (VEHICLES), images public/vehicles/ev-N.png

## 5. Compare Electric Vehicles (CompareEvs -> #compare)
- Card `w-[400px] h-[360px]`, 2 Side columns, vertical divider + `.vs-badge` (VS) in middle
- Better value (lower price / higher range / higher speed) orange highlight
- Pairs: lib/vehicles.js `PAIRS`

## Run
npm install -> .env.local (.env.example se) -> npm run dev
