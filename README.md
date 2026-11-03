# StudioSpace

**Live site:** https://your-studiospace.vercel.app  <!-- replace after deploying -->
**Server repo:** https://github.com/your-username/studiospace-server  <!-- replace -->

StudioSpace is a peer-to-peer marketplace where creators book photo studios, film stages, podcast lounges, music suites and art workshops by the hour, and hosts list and manage their spaces.

## Features

- **Studio marketplace:** browse, search, filter by category and price, sort, and paginate studios with a branded skeleton loader and friendly empty states.
- **Booking with double-booking protection:** requests start as Pending; the API rejects any slot that overlaps a Confirmed booking, and hosts confirm, decline or complete requests from My Bookings.
- **Secure auth:** BetterAuth (email/password and Google) with the MongoDB adapter, plus a JWT in an HTTPOnly cookie that guards every server mutation (401 when missing or invalid).
- **Full host CRUD:** add, edit and delete studios with an image-upload option (imgbb), amenity tags, and a confirmation modal before deleting.
- **Light and dark theme:** one toggle switches the whole app and remembers your choice.
- **Extras:** PDF booking invoices, a saved-studios wishlist (heart icon), studio reviews with live average rating, and a host/creator dashboard.
- **Polished UX:** Swiper hero and gallery sliders, react-hot-toast notifications, custom modals (no `alert()`), custom 404 page, and a responsive layout for mobile, tablet and desktop.

## Tech stack

Next.js 14 (App Router), Tailwind CSS + daisyUI, BetterAuth, MongoDB, jose (JWT), Swiper, react-hot-toast, jsPDF, react-icons. Backend: Express.js + MongoDB (separate repo).

## Local setup

1. Clone both repos and run `npm install` in each.
2. **Server:** copy `.env.example` to `.env`, fill `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL=http://localhost:3000`, then `npm run seed` and `npm run dev` (runs on port 5000).
3. **Client:** copy `.env.example` to `.env.local`. Use the **same** `JWT_SECRET` as the server, set `API_URL=http://localhost:5000`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL=http://localhost:3000`, and optionally Google OAuth keys and `NEXT_PUBLIC_IMGBB_KEY`.
4. Run `npm run dev` and open http://localhost:3000.
5. Create the examiner account: `node scripts/create-demo-user.mjs http://localhost:3000`.

Google OAuth redirect URI: `{BETTER_AUTH_URL}/api/auth/callback/google`.

## Examiner test credentials

| Role | Email | Password |
|---|---|---|
| Examiner (hosts 4 seeded studios) | examiner@studiospace.dev | Studio123 |

To test the booking flow end to end, register a second account, book one of the examiner's studios, then log in as the examiner and confirm the request under **My Bookings > Requests for my studios**. Try a second overlapping booking to see the double-booking rejection.

## Deployment notes

- Deploy the client on Vercel with all `.env.example` variables, setting `API_URL` to the deployed server URL and `BETTER_AUTH_URL` to the live client URL.
- Deploy the server on Vercel/Render with `MONGODB_URI`, `JWT_SECRET` and `CLIENT_URL`.
- API calls go through a `/server/*` rewrite so the HTTPOnly cookie stays same-origin.
