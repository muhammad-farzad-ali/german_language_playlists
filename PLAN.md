# Plan: Client-Side Video Page Navigation

**Date:** 2026-07-07
**Status:** In Progress

---

## Problem

YouTube iframes cause CLS (Cumulative Layout Shift) and block page rendering. The current accordion-based UI loads iframes even when panels are collapsed, wasting bandwidth and slowing page load.

---

## Solution

Replace accordion-based video display with **hash-based client-side routing**:
- Landing page shows playlist titles only (no iframes)
- Clicking a title navigates to a dedicated video page (`#video=VIDEO_ID`)
- Video page contains: back link, iframe player, prev/next navigation within the same playlist

---

## Design Decisions

1. **No thumbnails** — User preference, not needed for this project
2. **No autoplay** — User presses play when ready
3. **Prev/Next scoped to playlist** — Only cycles through videos in the same playlist (A1 or A2), not across all playlists
4. **Client-side routing only** — No server-side changes, pure hash-based navigation

---

## Changes

### 1. `app.js` — Core Logic

**Add hash router:**
- `handleRoute()` — checks `window.location.hash`, routes to either `renderLandingPage()` or `renderVideoPage(videoId)`
- `window.addEventListener('hashchange', handleRoute)` — handles back/forward navigation

**Store playlist data globally:**
- After loading all playlists, build `window.__PLAYLISTS__` array for lookup during routing

**New `renderVideoPage(videoId)`:**
- Finds video by ID across all playlists
- Builds prev/next links within the same playlist
- Renders: back link, iframe, prev/next buttons
- Sets `iframe.src` only when page renders (lazy load)

**New `renderLandingPage()`:**
- Shows landing page, hides video page container

**Modify `createVideoCard(video, playlistIndex)`:**
- Remove iframe entirely
- Replace with clickable link: `<a href="#video=${video.video_id}">`
- Display: lesson number + title only

**Modify `createPlaylistSection(playlist)`:**
- Call `createVideoCard` without iframe (already handled above)

### 2. `index.html` — Video Page Container

Add hidden video page container:
```html
<div id="video-page" class="hidden">
  <a href="#" class="back-link">← Zurück zur Playlist</a>
  <div class="video-player-wrapper">
    <iframe id="video-iframe" ...></iframe>
  </div>
  <div class="video-nav">
    <button id="prev-btn">← Vorheriges</button>
    <button id="next-btn">Nächstes →</button>
  </div>
</div>
```

### 3. `style.css` — Video Page Styles

- `#video-page` container with `hidden` class toggle
- `.back-link` styling
- `.video-player-wrapper` (16:9 aspect ratio, iframe positioning)
- `.video-nav` with flexbox prev/next buttons

---

## Navigation Flow

```
Landing Page (index.html)
  └── Click "Lektion 1" in A1 playlist → #video=Iyxc05UQHKU
       └── Video Page
            ├── ← Zurück zur Playlist (clears hash, shows landing)
            ├── [iframe player]
            └── ← Vorheriges | Nächstes →
                 (cycles within same playlist only)
```

---

## Tickets

- [ ] **feat: implement hash-based routing**
  - Add `handleRoute()`, `renderVideoPage()`, `renderLandingPage()`
  - Store playlists globally after load

- [ ] **feat: remove iframes from video cards**
  - Replace iframe with `<a href="#video=ID">` link
  - Keep lesson number and title display

- [ ] **feat: add video page UI**
  - Add video page container to index.html
  - Add back link, iframe, prev/next buttons

- [ ] **feat: add video page styles**
  - Container layout, back link, player wrapper, nav buttons

- [ ] **feat: implement prev/next navigation**
  - Prev/next within same playlist only
  - Update hash on navigation

- [ ] **test: verify routing and navigation**
  - Hash changes work with back/forward button
  - Prev/next correctly cycles within playlist
  - Back link returns to landing page

---

## Performance Impact

| Before | After |
|--------|-------|
| All iframes load on page init | Zero iframes on landing page |
| CLS ~0.01 from iframe loading | CLS 0 on landing page |
| ~500KB-1MB iframe data per video | No iframe data until click |

---

## Git Tag

`v2.0.0` — Client-side video page navigation
