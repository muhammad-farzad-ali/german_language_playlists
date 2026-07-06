# German Language Playlists — Design & Implementation Plan

## 1. Subject & Brief

**Subject:** Goethe A1/A2 exam prep video library — curated YouTube playlists for German language learners.

**Audience:** Self-directed German learners (beginners at A1 through intermediate A2), studying for Goethe-Zertifikat exams. They need clear organization by level, easy browsing, and quick access to lessons.

**Page's single job:** Let users discover and watch lesson videos organized by proficiency level, with a clear sense of progression from A1 → A2.

## 2. File Structure

```
german_language_playlists/
├── data/
│   ├── playlists.json        ← manifest (lists all playlist files)
│   ├── A1 - German.json
│   └── A2 - German.json
├── index.html
├── style.css
└── app.js
```

## 3. Design Tokens (Tailwind Config)

### Color Palette

| Token | Name | Hex | Role |
|---|---|---|---|
| `--bg` | Nachthimmel | `#0F1923` | Night mode background |
| `--bg-day` | Papier Hell | `#F5F0EB` | Day mode background |
| `--surface` | Papier | `#E8E2DA` | Cards on night mode |
| `--surface-day` | Weiß | `#FAFAF8` | Cards on day mode |
| `--text` | Elfenbein | `#E8E2DA` | Night mode text |
| `--text-day` | Tinte | `#1A1A1A` | Day mode text |
| `--accent` | Korrektur | `#D4534A` | Interactive/active, level badges |
| `--ink` | Kugelschreiber | `#2B5C8A` | Links, secondary interactive |
| `--muted` | Bleistift | `#8B8178` | Secondary text, timestamps |
| `--border` | Grau | `#2A3441` | Night mode borders |
| `--border-day` | Grau Hell | `#D1CCC4` | Day mode borders |

### Typography (Google Fonts)

- **Display:** `Libre Baskerville` — classic book serif, academic gravitas
- **Body:** `Karla` — friendly geometric sans, approachable
- **Utility:** `IBM Plex Mono` — structural labels, video counts

### Type Scale

| Role | Size (desktop) | Size (mobile) | Weight |
|---|---|---|---|
| Hero | 3.5rem | 2rem | 700 |
| Level Badge | 7rem | 4rem | 700 |
| Section Title | 1.5rem | 1.25rem | 600 |
| Body | 1rem | 1rem | 400 |
| Caption | 0.875rem | 0.875rem | 400 |
| Label | 0.75rem | 0.75rem | 500 |

## 4. Layout

### Page Structure

```
┌─────────────────────────────────────────────┐
│  Header: Logo/Title              [🌙 / ☀️]  │
├─────────────────────────────────────────────┤
│  Hero: Large headline + subtitle            │
│  "Deutsch lernen. Schritt für Schritt."     │
├─────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐    │
│  │ A1 Header  [badge] [count] [arrow]  │    │
│  ├─────────────────────────────────────┤    │
│  │ Video grid (when expanded)          │    │
│  │ ┌─────┐ ┌─────┐ ┌─────┐            │    │
│  │ │  1  │ │  2  │ │  3  │            │    │
│  │ └─────┘ └─────┘ └─────┘            │    │
│  │ ┌─────┐ ┌─────┐ ┌─────┐            │    │
│  │ │  4  │ │  5  │ │  6  │            │    │
│  │ └─────┘ └─────┘ └─────┘            │    │
│  │ [Show all 59 videos]               │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ A2 Header  [badge] [count] [arrow]  │    │
│  └─────────────────────────────────────┘    │
├─────────────────────────────────────────────┤
│  Footer: minimal, credits                   │
└─────────────────────────────────────────────┘
```

### Responsive Grid

| Breakpoint | Columns | Card Gap |
|---|---|---|
| `< 640px` | 1 | 1rem |
| `640px–1024px` | 2 | 1.25rem |
| `> 1024px` | 3 | 1.5rem |

## 5. Night/Day Mode

- **Night (default):** Dark background, warm off-white text
- **Day:** Warm paper background, dark text
- Toggle button in header (sun/moon icon)
- Prefers `prefers-color-scheme` on first load
- Smooth 300ms transition on all color properties
- `data-theme` attribute on `<html>` drives styling

## 6. Eye Comfort

- No pure `#000` or `#FFF` — use warm offsets
- Body text: 16px base, 1.6 line-height
- Cards: subtle `box-shadow` (not hard borders)
- Generous padding (min 1.5rem between sections)
- `loading="lazy"` on all YouTube iframes
- Show first 6 videos per level, "Show all" reveals rest

## 7. Accordion Behavior

- Two level headers (A1, A2) — click to toggle
- Only one level open at a time
- Smooth height animation via CSS transitions
- Chevron icon rotates on open/close
- Keyboard accessible (Enter/Space to toggle)

## 8. Video Card

Each card:
- Responsive YouTube iframe (16:9 aspect ratio via padding-bottom hack or aspect-ratio)
- Cleaned lesson title (strip trailing timestamps)
- Lesson number as small label
- Subtle hover effect (slight scale/shadow)

## 9. Title Cleaning

Strip trailing date/timestamp patterns:
- Input: `"1  Vowels, informal greetings 20260612 143656"`
- Output: `"Vowels, informal greetings"`
- Logic: remove leading number(s), remove trailing `\d{8}\s+\d{6}` pattern, trim

## 10. Dynamic Data

`data/playlists.json` manifest:
```json
["A1 - German.json", "A2 - German.json"]
```

`app.js` flow:
1. Fetch manifest
2. For each file, fetch playlist JSON
3. Sort videos by `index` field
4. Render levels and video grids
5. Setup accordion + theme toggle

## 11. Signature Element

Level badges ("A1", "A2") as oversized `Libre Baskerville` display type:
- Desktop: ~7rem, Mobile: ~4rem
- Accent color (`#D4534A`)
- Video count badge nested inside
- Evokes oversized wood type / academic certificate grades

## 12. Accessibility

- Semantic HTML (`<header>`, `<main>`, `<section>`, `<article>`)
- ARIA attributes on accordion triggers
- Visible focus rings on interactive elements
- `@media (prefers-reduced-motion: reduce)` disables transitions
- Skip-to-content link
- Alt text on theme toggle icon

## 13. Implementation Order

1. Write PLAN.md (this file)
2. Create `data/playlists.json` manifest
3. Create `index.html` — semantic structure, Tailwind CDN, Google Fonts
4. Create `style.css` — custom properties, theme transitions, utility overrides
5. Create `app.js` — data loading, rendering, accordion, theme toggle
6. Test responsive behavior
7. Git commits at each milestone
