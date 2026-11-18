# The Garden Edit — wedding invitation

React + Vite + Tailwind, with GSAP ScrollTrigger, Framer Motion and Lenis.

```bash
npm install
npm run dev        # local development
npm run build      # production build → dist/
npm run preview    # serve dist/ on :4173
npm test           # countdown + RSVP validation tests
npm run qa         # browser checks + screenshots (needs `npm run preview` running)
```

## Editing content

Everything (names, parents, dates, events, venue, story, gallery) lives in
`src/data/weddingData.js`. Content there is **sample placeholder text**.

## Photos

`scripts/images.json` lists every photo with its Unsplash source and author.
`npm run images` downloads any missing originals into `photos-src/`, applies
the shared warm grade and writes AVIF/WebP/JPG sizes to `public/images/wedding/`.

To use the client's own photo, save it as `photos-src/<name>.jpg` (same name as
the stock photo it replaces) and run `npm run images`.

Licensing and the photos that **must be replaced before launch** are listed in
[ATTRIBUTIONS.md](ATTRIBUTIONS.md).

## RSVP

`src/services/rsvpApi.js` POSTs JSON to `VITE_RSVP_ENDPOINT` (copy
`.env.example` to `.env`). Without it, the form validates normally but tells
guests online RSVP isn't open yet — nothing is faked.

Payload: `{ name, contact, attending, guests, message, submittedAt }`.
