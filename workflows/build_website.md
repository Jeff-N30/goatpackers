# Workflow: Build Goat Packers Website

## Objective
Build and maintain the Next.js 14 website at `site/`. Deploy to Vercel.

## Status
Initial build: complete. See `site/` directory.

## Required Inputs
- Supabase project URL + anon key (add to `site/.env.local`)
- Supabase service role key (for admin write operations)
- Domain: goatpackers.com

## Stack
- Framework: Next.js 14 (App Router, TypeScript)
- Styling: Tailwind CSS with Claude design system tokens
- Animations: Framer Motion (page/list entries) + CSS transitions (hover/press)
- Database: Supabase (Postgres + Storage)
- Auth: Supabase Auth

## Setup Steps

### 1. Supabase Setup
1. Create project at supabase.com
2. Run `site/supabase/schema.sql` in the SQL editor
3. Go to Storage → New bucket `photos` → set Public = true
4. Enable RLS + uncomment the policies in schema.sql
5. Copy URL + anon key → paste into `site/.env.local`

### 2. Local Dev
```bash
cd site
npm install
npm run dev    # http://localhost:3000
```

### 3. Deploy to Vercel
```bash
npx vercel --prod
```
Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## File Structure
```
site/
  app/
    page.tsx                  Homepage (SSR, force-dynamic)
    hikes/page.tsx            Hike listing
    gallery/page.tsx          Photo gallery
    about/page.tsx            About page (static)
    contact/page.tsx          Contact page (static)
    admin/
      login/page.tsx          Auth — no middleware protection
      dashboard/page.tsx      Overview stats
      gallery/page.tsx        Upload + reorder photos
      hikes/page.tsx          CRUD hikes
      messages/page.tsx       Read contact form messages
      layout-settings/page.tsx  Gallery layout switcher
  components/
    ui/                       Button, Badge, Input, Textarea
    public/                   Navbar, Footer, HeroSection, HikeCard, GalleryGrid, ContactForm
    admin/                    AdminSidebar, LayoutPicker, UploadZone
  lib/
    supabase.ts               Lazy Supabase client + types
    supabase-server.ts        SSR Supabase client (uses cookies)
    seo.ts                    Metadata helpers + JSON-LD
    utils.ts                  cn(), formatDate()
  supabase/
    schema.sql                Full DB schema + seed
```

## Admin Access
1. Create user: Supabase dashboard → Auth → Users → Invite user
2. Visit `/admin/login` → sign in with that email/password
3. Middleware at `site/middleware.ts` protects all `/admin/*` routes

## Gallery Layouts
Admin can toggle at `/admin/layout-settings`. Stored in `settings` table (key=`gallery_layout`). Homepage reads live — no redeploy needed.

Layout options: `grid-uniform`, `grid-masonry`, `grid-featured`, `grid-panoramic`, `grid-mosaic`

## Design System
Follows Claude.ai design system (via `awesome-design-md/design-md/claude/DESIGN.md`):
- Canvas: `#faf9f5` (warm cream — never pure white)
- Primary CTA: `#cc785c` (coral)
- Dark surfaces: `#181715` (navy)
- Display fonts: EB Garamond (substitute for Tiempos Headline)
- Body: Inter

## Animation Rules (Emil skill)
- Entering elements: opacity 0→1 + translateY 8px→0
- Easing: `cubic-bezier(0.23, 1, 0.32, 1)` for all enters
- Duration: 150-250ms UI, max 300ms
- Stagger lists: 50ms delay per item
- No `transition: all` — always specific properties
- `@media (prefers-reduced-motion)` applied globally in globals.css

## Known Constraints
- `force-dynamic` is required on all pages that call Supabase (no static generation with live data)
- Supabase client uses lazy initialization — safe to import at module level
- Admin gallery upload sends directly to Supabase Storage bucket named `photos`
