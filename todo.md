# TODO — Real Estate Property Management App (Next.js 14 + Prisma + SQLite + Tailwind)

## Step 1 — Styling baseline (DONE)

- [x] Updated `app/globals.css` to strict black/white/grey.
- [x] Updated `app/layout.tsx` to remove Geist fonts.

## Step 2 — Prisma setup

- [ ] Add `prisma/schema.prisma` (exact schema from prompt).
- [ ] Add `prisma/seed.ts` (Runwal Raaya sample data).
- [ ] Update `package.json` with Prisma + scripts.
- [ ] Add `lib/prisma.ts` singleton.

## Step 3 — API routes

- [ ] Implement `GET/POST/DELETE /api/developers`.
- [ ] Implement `GET /api/projects` (client listing + computed priceRange).
- [ ] Implement `GET /api/projects/[slug]` (full detail).
- [ ] Implement `POST /api/projects` (transactional create: developer/project/configs/floorplans/inventory).
- [ ] Implement `DELETE /api/projects/[id]`.

## Step 4 — Admin pages

- [ ] `/admin` dashboard.
- [ ] `/admin/developers` table + inline add + delete.
- [ ] `/admin/projects` table + actions.
- [ ] `/admin/projects/new` multi-section stacked form.

## Step 5 — Client pages

- [ ] `/` home with filter bar + project cards grid.
- [ ] `/projects/[slug]` detail page (configs, floor plans, inventory).

## Step 6 — Run & verify

- [ ] `npm install`
- [ ] `npx prisma generate`
- [ ] `npx prisma db push`
- [ ] `npx prisma db seed`
- [ ] `npm run dev` and manual checks
