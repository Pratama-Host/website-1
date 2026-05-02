# ALFREDO Website - AI Agent Guide

## Project Overview

**TKJ XI-9 Class Portal** — A dark-themed PWA website for a vocational school class (SMK Muhammadiyah Belitang). Pure HTML/CSS/JavaScript with no build tools or external frameworks. Offline-capable with Service Worker.

## Technology Stack

- **HTML/CSS/JavaScript** — vanilla, no frameworks or bundlers
- **PWA/Service Worker** — offline support, cached assets, stale-while-revalidate strategy
- **External CDN**: Font Awesome icons, Google Fonts, ui-avatars API
- **Static hosting** — no backend server required (deploy to GitHub Pages, Netlify, etc.)

## Key Project Conventions

### Settings & Configuration

- **`settings.js`** is the single source of truth for all editable content
  - Class info, member data, achievements, stats, social links
  - Configuration: `const G = {...}` object
  - Changes here automatically propagate throughout the site

### Code Style

- **CSS**: kebab-case for classes/IDs, CSS custom properties for design tokens
- **JavaScript**: camelCase for variables/functions, IIFE modules for encapsulation
- **8px spacing rhythm** — all spacing uses multiples of 8px
- **Accessibility-first** — semantic HTML, ARIA labels, role attributes
- **Language**: Indonesian throughout

### File Organization

| File             | Purpose                                                            |
| ---------------- | ------------------------------------------------------------------ |
| `settings.js`    | ALL editable data (members, achievements, links)                   |
| `index.js`       | Shared logic: typing animation, theme toggle, toast notifications  |
| `style.css`      | Main styles, CSS variables (dark/light theme tokens)               |
| `animations.css` | Keyframe animations, transitions                                   |
| `sw.js`          | Service Worker — caching strategy, offline support                 |
| `*.html`         | Pages: index, about, members, gallery, skills, admin, 404, offline |
| `manifest.json`  | PWA metadata                                                       |

## Essential Development Tasks

### Editing Content

1. All content edits go in [`settings.js`](settings.js) — no manual HTML changes needed
2. Update member profiles, achievements, class info in the `G` object
3. Changes auto-sync to all pages that reference `G`

### Styling Changes

- Use [`style.css`](style.css) for global styles
- Theme tokens: `--color-primary`, `--bg-*, --text-*` variables
- Mobile-first approach — base styles for mobile, media queries for desktop

### Adding Features

- Follow existing IIFE module pattern in [`index.js`](index.js)
- Maintain section comments with separator lines
- Test offline behavior using Service Worker

### Pre-Deployment Checklist

- [ ] Replace `[YOUR-REAL-DOMAIN]` in [`robots.txt`](robots.txt) and [`sitemap.xml`](sitemap.xml)
- [ ] Verify Service Worker caching in production
- [ ] Test PWA installation on mobile
- [ ] Ensure HTTPS enabled (required for Service Worker on production)

## Important Notes

- **No build step** — edit source files directly, they're served as-is
- **Service Worker requires HTTPS or localhost** for production
- **Version tracking**: Files have version headers (e.g., "Versi 2.1 · Patch 2026")
- **Offline page**: [`offline.html`](offline.html) shown when network unavailable

## Common Agent Tasks

When you need to:

- **Change any content** → Edit [`settings.js`](settings.js)
- **Fix styling issues** → Update [`style.css`](style.css) or [`animations.css`](animations.css)
- **Add interactivity** → Extend [`index.js`](index.js) following module pattern
- **Modify a specific page** → Edit the corresponding `.html` file, but prefer data-driven changes via `settings.js`
- **Debug offline behavior** → Check [`sw.js`](sw.js) caching logic and browser DevTools Application tab
