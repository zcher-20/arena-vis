
<img width="710" height="400" alt="Screenshot 2026-06-17 at 9 23 13 PM" src="https://github.com/user-attachments/assets/a7374275-5823-4b9d-b90f-8e3e33a8bcb8" />
<img width="711" height="401" alt="Screenshot 2026-06-17 at 9 23 25 PM" src="https://github.com/user-attachments/assets/7a92bb95-9e1e-4e50-9bec-6c431a22a726" />

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
Are.na Vis
  
  A visual explorer for Are.na (https://www.are.na) channels, built as a
  portfolio-style website that pulls content from public Are.na channels and
  displays it through custom interactive views.
  
  Live: Deployable to Vercel
  Stack: Next.js 16 (App Router) · TypeScript · Tailwind CSS v4

  ---
  Views
  
  Canvas — An infinite, seamless masonry grid. Two-finger scroll to pan in any
  direction. The layout wraps infinitely so you never hit an edge. Images
  display in full color; hovering one turns everything else grayscale. Click any
  image to open the lightbox.
  
  Grid — A categorized gallery. The default page shows 8 category cards (All
  Images, Space, Data & Networks, Art Direction, Photography, Diagrams,
  Typography, Cosmology, Abstract) with numbered covers. Hovering a card reveals
  a second image expanding on top. Clicking opens the category's image grid.
  Categories are auto-derived from image titles and sources across all channels.

  Disks — Spinning vinyl-style covers for each Are.na channel. Images cycle with
  a slow crossfade. Disk edges have a vignette glow and CD-like ring lines.
  Hovering pauses the spin. Clicking a disk switches to the Canvas view.
  
  Features

  - Pulls from 3 public Are.na channels (cosmology, data visualization, art
  direction) via the v3 API
  - No auth required — uses public endpoints with 5-minute revalidation
  - Navbar with channel selector dropdown that opens a disk selector overlay
  - Lightbox for enlarged image viewing (click any image, Escape to close)
  - Smooth fade-in transitions between all views
  - Grayscale hover effect on canvas (hovered image stays color, rest go
  grayscale)
  - "Curated channels by Zayneb" button links to personal website

  Setup

  npm install
  npm run dev

  Open http://localhost:3000. The app redirects to the first channel's canvas
  view.

  Configuration
         
  Channels are defined in src/lib/config.ts:

  export const CHANNELS = [
    { slug: "cosmology-2sqh70bmv0g", name: "cosmology" },
    { slug: "data-visualization-4dtkzmzbrsy", name: "data visualization" },
    { slug: "art-direction-wjdprzd7lsa", name: "art direction" },
  ];

  To add or swap channels, update this array with any public Are.na channel
  slug.

  Project Structure
         
  src/
  ├── app/
  │   ├── channel/[slug]/page.tsx   # Dynamic channel page (server component)
  │   ├── globals.css               # Inter font, Tailwind, spin animation
  │   ├── layout.tsx                # Root layout
  │   └── page.tsx                  # Redirects to first channel
  ├── components/
  │   ├── Canvas.tsx                # Infinite masonry with ref-based scrolling
  │   ├── ChannelView.tsx           # View switcher (Disks/Canvas/Grid)
  │   ├── DiskPage.tsx              # Full-page disk selector
  │   ├── DiskSelector.tsx          # Modal disk selector (from navbar)
  │   ├── GridView.tsx              # Categorized gallery with hover effects
  │   ├── Lightbox.tsx              # Image lightbox overlay
  │   ├── Navbar.tsx                # Top navigation bar
  │   └── ViewToggle.tsx            # Bottom Disks/Canvas/Grid toggle
  └── lib/
      ├── arena.ts                  # Are.na API types and fetch functions
      └── config.ts                 # Channel config, hidden block IDs
