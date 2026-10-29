# Eventora implementation plan

## Product scope
Eventora is an event-discovery and registration website. Visitors can browse event categories, explore event cards, open event details, register for an event, and view/manage registration details. Registration records support create, update, and delete operations.

The app uses MongoDB Atlas through a server-side `MONGODB_URI` secret. The server exposes public tRPC procedures for events and registrations. On first connection, deterministic event seed records are inserted with `upsert` semantics; registration data is never overwritten by seeding. If Atlas is temporarily unavailable in Preview, the UI falls back to curated in-memory event data and keeps the registration desk usable for demonstration.

## Project structure
- `client/src/pages/Home.tsx`: discovery homepage with hero, category filters, featured and upcoming event cards, and registration modal.
- `client/src/pages/EventDetails.tsx`: event detail view and registration entry point.
- `client/src/pages/Registrations.tsx`: registration desk with summary metrics, registration detail cards, edit flow, and delete action.
- `client/src/components/RegistrationForm.tsx`: reusable create/update form with validation and tRPC mutations.
- `server/mongodb.ts`: MongoDB Atlas client, seed data, event queries, and registration CRUD helpers.
- `server/routers.ts`: tRPC API contract for events and registrations.
- `shared/types.ts`: shared event and registration types.
- `public/manus-routes.json`: route manifest for `/`, `/events/:id`, `/registrations`, and `/404`.

## Design direction
Three candidate styles:
- Editorial city guide — 0.06 probability: warm paper, bold poster typography, and curated event rails.
- Dark neon ticketing lounge — 0.07 probability: black canvas, saturated gradients, and high-contrast controls.
- Soft civic calendar — 0.05 probability: light blue utility surfaces, muted cards, and restrained spacing.

Chosen direction: **Editorial city guide with a dark neon ticketing lounge accent**.

### Design movement
A contemporary cultural-programming editorial system: part city guide, part backstage pass, with poster-like event cards and sharp editorial hierarchy.

### Core principles
1. Make the next good plan feel one click away.
2. Use a warm, human surface for browsing and a deep navy surface for moments of focus.
3. Treat each event card like a mini poster, with strong date, category, and venue signals.
4. Keep management controls calm and legible rather than looking like a generic admin grid.

### Color philosophy
Warm sand (#F4F0EA) makes the discovery experience feel tactile and human. Midnight navy (#16152A) provides a confident stage for the hero and detail page. Electric coral (#FF6B5B) owns the brand and marks action. Mint (#A5E8D7) is reserved for positive status and gentle contrast.

### Layout paradigm
Use asymmetrical editorial bands: an immersive dark hero, a horizontal category rail, a split featured-event block, and a list-like registration desk. Avoid a uniform dashboard grid by mixing wide feature cards, compact event tiles, and full-width detail rows.

### Signature elements
- A coral circular Eventora mark with a small offset “spark” dot.
- Poster-style event cards with oversized date numerals and gradient fields.
- Small uppercase “signal” labels that act like wayfinding in a printed city guide.

### Interaction philosophy
Every primary action should be plain-language and contextual: “Save my spot”, “Open event”, “Edit details”. Filters update the visible list immediately. Registration forms are short, forgiving, and confirm success without leaving the current context.

### Animation
Use subtle lift and 180–220ms ease-out transitions on cards and buttons. Let the hero’s background glow breathe slowly; do not animate the registration desk aggressively. Modal entry uses a soft scale/fade and the page should remain fully usable with reduced motion preferences.

### Typography system
Use `Space Grotesk`-style display typography for headlines and `DM Sans`-style text for UI copy, with system fallbacks. Headlines are tight and editorial; metadata is uppercase with tracking; body copy remains comfortable and readable.

### Brand essence
Eventora is the place to find the room where your people are. Personality: curious, inviting, considered.

### Brand voice
Headlines sound direct and lightly poetic; CTAs sound confident and useful.
- “Find the room where your people are.”
- “Save your spot before the room fills.”

### Wordmark & logo
The wordmark uses a custom coral circular “E” mark followed by a compact lowercase wordmark. The mark is rendered in UI rather than relying on a default image asset.

### Signature brand color
Electric coral (#FF6B5B), used for the Eventora mark, primary CTAs, registration focus states, and key poster accents.

## Backend and data behavior
- `events.list` returns seeded Atlas events sorted by featured state and date.
- `events.getById` returns one event by stable string id.
- `registrations.list` returns all registration details newest first.
- `registrations.create` writes a new registration and increments the event’s registered count.
- `registrations.update` updates name, email, phone, ticket count, notes, and status while keeping event identity stable.
- `registrations.delete` removes the record and decrements the event’s registered count.
- `MONGODB_URI` is read only by the server; no database credential is shipped to the browser.
