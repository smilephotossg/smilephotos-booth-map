# Smile Photos — Booth Availability Map

An interactive, brand-styled map showing where Smile Photos photobooths are
currently available across Singapore. Click a pin to see how many booths are free
at that venue and book straight away over WhatsApp.

Built as a standalone single-page app (React + Vite + TypeScript) so it can be
deployed on its own or **embedded into the Squarespace site via an iframe**.

---

## Runs free, no API key needed

The map works out of the box using **open OpenStreetMap data** (CARTO's clean
light basemap) — **no Google account, no API key, no billing, no credit card.**

```bash
npm install
npm run dev        # http://localhost:5180
```

That's it — pins, the booking panel and the WhatsApp links all work immediately.

### Two map modes

| Mode | When | Needs a key? | Cost |
| --- | --- | --- | --- |
| **OpenStreetMap** (default) | No key present | No | Free |
| **Google Maps** | A key is set in `.env` | Yes | Free up to 10k loads/mo, then paid |

The app checks for `VITE_GOOGLE_MAPS_API_KEY` at startup. If it's empty (the
default), it uses the free OpenStreetMap map. If you add a key, it automatically
switches to Google Maps — no code changes. See "Switching to Google Maps" below.

> **Tiles at scale:** the free CARTO/OpenStreetMap tiles are perfect for normal
> business traffic. If the site ever gets very heavy traffic, switch to a
> dedicated tile host (e.g. MapTiler or Stadia Maps free tier) by changing the
> one tile URL in [`src/components/LeafletMap.tsx`](src/components/LeafletMap.tsx),
> or move to Google Maps.

## Updating the venues

All booth data lives in one file: [`src/data/venues.ts`](src/data/venues.ts).
Each venue looks like this:

```ts
{
  id: 'mbs',
  name: 'Marina Bay Sands',
  area: 'Marina Bay',
  lat: 1.2834,
  lng: 103.8607,
  available: true,
  boothCount: 3,
  note: 'Ballroom weddings & corporate galas',
}
```

- `available: false` renders a muted grey pin and a "Fully booked" panel.
- The **Book on WhatsApp** button auto-generates a `wa.me` link to
  **+65 8335 1636** with a message naming the venue. Override per venue with an
  optional `bookingUrl`.

### Going live with a real backend

The data is currently a hard-coded array (mock data). To connect a real source
(a database, CMS, or even a Google Sheet), replace the `venues` array with a
`fetch`. As long as each record keeps the `Venue` shape, the map and panel keep
working unchanged.

## Tweaking the brand

| What | Where |
| --- | --- |
| **Blue / colours** | `--brand` and friends at the top of [`src/index.css`](src/index.css) |
| **Fonts** | the `<link>` in [`index.html`](index.html) + `--font-display` / `--font-mono` in `src/index.css` |
| **Map tiles** (free mode) | the tile `url` in [`src/components/LeafletMap.tsx`](src/components/LeafletMap.tsx) |
| **Map colours** (Google mode) | [`src/mapStyle.ts`](src/mapStyle.ts) |
| **Pin shape** | [`src/components/markerIcon.ts`](src/components/markerIcon.ts) (SVG, shared by both maps) |

The blue is set to `#1b4de4` as a faithful match for the screenshot — swap it for
the exact brand hex in one place (`--brand`) and everything updates. Fonts use
**Space Grotesk** (display) + **Space Mono** (body), a free stand-in for the
site's heading/monospace pairing.

## Switching to Google Maps (optional)

Prefer Google's map data/styling? It's free up to 10,000 map loads per month, but
Google requires a billing account (credit card) even within the free tier.

1. In the [Google Maps Platform console](https://console.cloud.google.com/google/maps-apis),
   create a project and **enable billing**.
2. Enable the **Maps JavaScript API**.
3. Create an **API key** and **restrict** it (HTTP referrers → your domains,
   e.g. `https://smilephotos.sg/*` and `http://localhost:5180/*` for local dev).
4. **Set a quota cap / budget alert** so you can never exceed the free tier by
   accident.
5. `cp .env.example .env`, paste the key, and restart `npm run dev`:

   ```
   VITE_GOOGLE_MAPS_API_KEY=AIza...your_key
   ```

The app switches to Google Maps automatically — same pins, same panel.

## Build & deploy

```bash
npm run build     # type-checks, then outputs static files to /dist
npm run preview   # preview the production build locally
```

`/dist` is plain static files — host it on Vercel, Netlify, Cloudflare Pages,
GitHub Pages, or any static host.

### Embedding into Squarespace

The smilephotos.sg site runs on Squarespace, which doesn't run a React build
directly. The simplest path is to deploy this app (e.g. to Vercel) and embed it
on a page with a **Code Block / Embed Block**:

```html
<iframe
  src="https://your-deployed-map.vercel.app"
  style="width:100%; height:80vh; border:0;"
  title="Smile Photos booth availability"
  loading="lazy"
></iframe>
```

## Tech notes

- **React 18 + Vite + TypeScript**.
- **Default map:** [Leaflet](https://leafletjs.com/) + open OpenStreetMap/CARTO
  tiles — no key, fully free.
- **Optional map:** [`@react-google-maps/api`](https://react-google-maps-api-docs.netlify.app/)
  with a JSON-styled classic map, used only when a key is present.
- Both maps share the same venue data, the same brand SVG pins, and the same
  responsive detail panel (floating card on desktop, bottom sheet on mobile,
  with safe-area insets and 44px touch targets).
- Respects `prefers-reduced-motion` (pauses the marquee and pin pulse).
