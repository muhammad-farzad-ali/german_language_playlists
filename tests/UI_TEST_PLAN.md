# UI Test Plan: German Language Playlists

**Version:** 1.0  
**Date:** 2026-07-06  
**Application:** Deutsch Lernen — Goethe A1 & A2  
**Test Type:** Manual UI Testing  
**Total Test Cases:** 44

---

## Test Environment Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Device or browser dev tools for responsive testing
- Local server running (e.g., `npx serve .` or `python -m http.server`)
- Network access to YouTube (for iframe loading)

### Test Data
- `data/playlists.json` — manifest file
- `data/A1 - German.json` — 59 videos
- `data/A2 - German.json` — 45 videos

---

## 1.0 Page Load & Data Loading

### 1.1 Page loads with correct title and meta
**Priority:** P0  
**Preconditions:** Server is running  
**Steps:**
1. Navigate to `http://localhost:port/`
2. Check browser tab title
3. Inspect page source for meta description

**Expected Result:**
- Tab title: "Deutsch Lernen — Goethe A1 & A2"
- Meta description: "German language learning videos for Goethe A1 and A2 exam preparation."

---

### 1.2 Manifest fetches successfully
**Priority:** P0  
**Preconditions:** `data/playlists.json` exists and is valid JSON  
**Steps:**
1. Open browser DevTools → Network tab
2. Navigate to `http://localhost:port/`
3. Filter network requests by "playlists.json"
4. Check request status

**Expected Result:**
- Request status: 200 OK
- Response contains array of playlist filenames

---

### 1.3 Both playlists render (A1 and A2)
**Priority:** P0  
**Preconditions:** Both playlist JSON files exist  
**Steps:**
1. Navigate to `http://localhost:port/`
2. Wait for page to load completely
3. Count visible playlist headers

**Expected Result:**
- Exactly 2 playlist headers visible
- Headers display "A1 - German" and "A2 - German"
- Each header shows correct video count (59 and 45)

---

### 1.4 Playlists sorted alphabetically by title
**Priority:** P1  
**Preconditions:** Multiple playlists exist  
**Steps:**
1. Navigate to `http://localhost:port/`
2. Observe order of playlist headers

**Expected Result:**
- "A1 - German" appears before "A2 - German"
- Order is alphabetical by `playlist_title` field

---

### 1.5 Videos sorted by index within each playlist
**Priority:** P1  
**Preconditions:** A playlist is expanded  
**Steps:**
1. Click on "A1 - German" header to expand
2. Observe video card order
3. Check lesson numbers on first 3 cards

**Expected Result:**
- Videos appear in ascending order by `index` field
- First card shows "Lektion 1"
- Second card shows "Lektion 2"
- Third card shows "Lektion 3"

---

### 1.6 Loading indicator shown during fetch
**Priority:** P2  
**Preconditions:** Network throttling enabled (Slow 3G)  
**Steps:**
1. Enable network throttling in DevTools
2. Navigate to `http://localhost:port/`
3. Observe loading state

**Expected Result:**
- Text "Lade Playlists..." visible during loading
- Loading indicator disappears after playlists render

---

## 2.0 Title Cleaning

### 2.1 Timestamps stripped from video titles
**Priority:** P0  
**Preconditions:** Playlist is expanded  
**Steps:**
1. Expand any playlist
2. Examine video titles on cards
3. Check for date patterns like "20260612 143656"

**Expected Result:**
- No timestamps visible in titles
- Titles end with topic text, not numbers

---

### 2.2 Leading lesson numbers stripped
**Priority:** P0  
**Preconditions:** Playlist is expanded  
**Steps:**
1. Expand any playlist
2. Examine video titles on cards
3. Check for leading numbers like "1  Vowels, informal greetings"

**Expected Result:**
- No leading lesson numbers in titles
- Titles start with topic text (e.g., "Vowels, informal greetings")

---

### 2.3 Umlauts and special characters preserved
**Priority:** P1  
**Preconditions:** Playlist contains German characters  
**Steps:**
1. Expand A1 playlist
2. Find video with umlauts (e.g., "ueber Hobbys sprechen")
3. Check character rendering

**Expected Result:**
- Umlauts display correctly (ü, ö, ä, ß)
- Special characters (ß, é) render properly
- No encoding issues

---

## 3.0 Accordion Behavior

### 3.1 Both panels collapsed on initial load
**Priority:** P0  
**Preconditions:** Page has loaded  
**Steps:**
1. Navigate to `http://localhost:port/`
2. Observe playlist headers
3. Check for visible video grids

**Expected Result:**
- Both playlist headers visible
- No video grids visible
- Both headers have `aria-expanded="false"`

---

### 3.2 Clicking a header opens its panel
**Priority:** P0  
**Preconditions:** Panel is collapsed  
**Steps:**
1. Click on "A1 - German" header
2. Observe panel animation
3. Check for video grid

**Expected Result:**
- Panel expands with smooth animation
- Video grid becomes visible
- Header `aria-expanded` changes to "true"
- Chevron rotates 180 degrees

---

### 3.3 Clicking an open header closes it
**Priority:** P0  
**Preconditions:** Panel is expanded  
**Steps:**
1. Click on already-expanded header
2. Observe panel animation
3. Check for video grid

**Expected Result:**
- Panel collapses with smooth animation
- Video grid becomes hidden
- Header `aria-expanded` changes to "false"
- Chevron rotates back to original position

---

### 3.4 Opening one panel closes the other
**Priority:** P0  
**Preconditions:** One panel is open  
**Steps:**
1. Expand "A1 - German" panel
2. Click on "A2 - German" header
3. Observe both panels

**Expected Result:**
- A1 panel closes automatically
- A2 panel opens
- Only one panel open at a time

---

### 3.5 Chevron rotates when panel opens
**Priority:** P1  
**Preconditions:** Panel is collapsed  
**Steps:**
1. Click on a playlist header
2. Observe chevron icon animation

**Expected Result:**
- Chevron rotates 180 degrees clockwise
- Rotation completes smoothly (300ms)

---

### 3.6 Page scrolls to opened panel
**Priority:** P1  
**Preconditions:** Panel is collapsed, not in viewport  
**Steps:**
1. Scroll down so playlist headers are not visible
2. Click on a playlist header
3. Observe page scroll behavior

**Expected Result:**
- Page scrolls smoothly to show the opened panel
- Scroll completes after animation (450ms delay)
- Panel header visible at top of viewport

---

### 3.7 Panel animation completes smoothly
**Priority:** P2  
**Preconditions:** Panel is collapsed or expanded  
**Steps:**
1. Click on a playlist header
2. Observe entire animation sequence
3. Check for visual glitches

**Expected Result:**
- No jank or stuttering during animation
- Border radius transitions smoothly
- No layout shifts

---

## 4.0 Video Grid

### 4.1 Only first 6 videos shown initially
**Priority:** P0  
**Preconditions:** Playlist is expanded, has >6 videos  
**Steps:**
1. Expand A1 playlist (59 videos)
2. Count visible video cards
3. Check for "Show all" button

**Expected Result:**
- Exactly 6 video cards visible
- "Alle 59 Videos anzeigen" button visible
- Remaining 53 cards hidden

---

### 4.2 "Show all" button reveals remaining videos
**Priority:** P0  
**Preconditions:** "Show all" button is visible  
**Steps:**
1. Click "Alle 59 Videos anzeigen" button
2. Observe video grid
3. Count total visible cards

**Expected Result:**
- All 59 video cards become visible
- Button disappears
- Grid layout adjusts to show all cards

---

### 4.3 "Show all" button hides after click
**Priority:** P1  
**Preconditions:** "Show all" button was clicked  
**Steps:**
1. Click "Show all" button
2. Check button visibility

**Expected Result:**
- Button has `display: none`
- Button is not in DOM flow

---

### 4.4 Video cards display iframe with correct src
**Priority:** P0  
**Preconditions:** Video card is visible  
**Steps:**
1. Inspect a video card element
2. Check iframe src attribute
3. Verify video ID in URL

**Expected Result:**
- iframe src: `https://www.youtube-nocookie.com/embed/{video_id}`
- iframe has `loading="lazy"` attribute
- iframe has `allowfullscreen` attribute

---

### 4.5 Lesson number label shows on each card
**Priority:** P1  
**Preconditions:** Video card is visible  
**Steps:**
1. Examine video card structure
2. Check for lesson number label
3. Verify label text

**Expected Result:**
- Label shows "Lektion {index}"
- Label uses accent color (#D4534A)
- Label uses monospace font (IBM Plex Mono)

---

### 4.6 Video count matches playlist total
**Priority:** P1  
**Preconditions:** Playlist header is visible  
**Steps:**
1. Check A1 header video count
2. Check A2 header video count
3. Compare with JSON data

**Expected Result:**
- A1 shows "59 Lektionen"
- A2 shows "45 Lektionen"
- Counts match `total_videos` field in JSON

---

## 5.0 Theme Toggle (Night/Day)

### 5.1 Night mode applied by default
**Priority:** P0  
**Preconditions:** First visit, no localStorage  
**Steps:**
1. Clear browser localStorage
2. Navigate to `http://localhost:port/`
3. Check background color

**Expected Result:**
- Background color: #0F1923 (dark blue)
- Text color: #E8E2DA (warm off-white)
- `data-theme="night"` on `<html>` element

---

### 5.2 Toggle switches to day mode
**Priority:** P0  
**Preconditions:** Night mode is active  
**Steps:**
1. Click theme toggle button
2. Observe color transition
3. Check background color

**Expected Result:**
- Background transitions to #F5F0EB (warm cream)
- Text transitions to #1A1A1A (dark)
- `data-theme="day"` on `<html>` element
- Transition completes in 300ms

---

### 5.3 Toggle switches back to night mode
**Priority:** P0  
**Preconditions:** Day mode is active  
**Steps:**
1. Click theme toggle button again
2. Observe color transition
3. Check background color

**Expected Result:**
- Background transitions back to #0F1923
- Text transitions back to #E8E2DA
- `data-theme="night"` on `<html>` element

---

### 5.4 Theme persists after page reload
**Priority:** P0  
**Preconditions:** Theme has been toggled  
**Steps:**
1. Toggle to day mode
2. Reload page (F5)
3. Check theme state

**Expected Result:**
- Day mode persists after reload
- `localStorage.getItem('dl-theme')` returns "day"
- No flash of wrong theme on load

---

### 5.5 Moon icon visible in night mode
**Priority:** P1  
**Preconditions:** Night mode is active  
**Steps:**
1. Check theme toggle button
2. Inspect SVG icons

**Expected Result:**
- Moon icon visible (not hidden)
- Sun icon has `display: none`
- Icon uses current text color

---

### 5.6 Sun icon visible in day mode
**Priority:** P1  
**Preconditions:** Day mode is active  
**Steps:**
1. Check theme toggle button
2. Inspect SVG icons

**Expected Result:**
- Sun icon visible (not hidden)
- Moon icon has `display: none`
- Icon uses current text color

---

### 5.7 System preference respected on first visit
**Priority:** P2  
**Preconditions:** No localStorage, system preference set  
**Steps:**
1. Clear localStorage
2. Set OS to dark mode (or light mode)
3. Navigate to page
4. Check initial theme

**Expected Result:**
- Theme matches system preference
- Dark mode → night theme
- Light mode → day theme

---

### 5.8 All color transitions smooth (300ms)
**Priority:** P2  
**Preconditions:** Theme toggle button accessible  
**Steps:**
1. Toggle theme
2. Observe all color changes
3. Check for jank

**Expected Result:**
- Background, text, borders transition smoothly
- No abrupt color changes
- Duration is exactly 300ms

---

## 6.0 Responsive Layout

### 6.1 Single column on mobile (<640px)
**Priority:** P0  
**Preconditions:** Viewport width < 640px  
**Steps:**
1. Set viewport to 375px width (iPhone)
2. Expand a playlist
3. Check video grid columns

**Expected Result:**
- Video grid shows 1 column
- Cards stack vertically
- No horizontal scroll

---

### 6.2 Two columns on tablet (640px–1024px)
**Priority:** P0  
**Preconditions:** Viewport width 640px–1024px  
**Steps:**
1. Set viewport to 768px width (iPad)
2. Expand a playlist
3. Check video grid columns

**Expected Result:**
- Video grid shows 2 columns
- Cards fill available width evenly
- Gap between cards: 1.25rem

---

### 6.3 Three columns on desktop (>1024px)
**Priority:** P0  
**Preconditions:** Viewport width > 1024px  
**Steps:**
1. Set viewport to 1440px width
2. Expand a playlist
3. Check video grid columns

**Expected Result:**
- Video grid shows 3 columns
- Cards fill available width evenly
- Gap between cards: 1.25rem

---

### 6.4 Hero text scales with viewport
**Priority:** P1  
**Preconditions:** Different viewports  
**Steps:**
1. Check hero heading on mobile (375px)
2. Check hero heading on tablet (768px)
3. Check hero heading on desktop (1440px)

**Expected Result:**
- Mobile: 2rem (32px)
- Tablet: 3rem (48px)
- Desktop: 3.75rem (60px)

---

### 6.5 Playlist badges scale on mobile
**Priority:** P1  
**Preconditions:** Mobile viewport  
**Steps:**
1. Set viewport to 375px width
2. Check playlist badge size

**Expected Result:**
- Badge font-size: ~4rem (64px)
- Badge remains readable
- Does not overflow header

---

### 6.6 Video cards do not overflow viewport
**Priority:** P0  
**Preconditions:** Any viewport width  
**Steps:**
1. Test at various widths (320px, 768px, 1440px)
2. Check for horizontal overflow
3. Check for content cutoff

**Expected Result:**
- No horizontal scroll at any width
- Cards fit within viewport
- No content cutoff

---

### 6.7 No horizontal scroll at any breakpoint
**Priority:** P0  
**Preconditions:** Any viewport width  
**Steps:**
1. Test at 320px, 375px, 768px, 1024px, 1440px
2. Check for horizontal scrollbar

**Expected Result:**
- No horizontal scrollbar at any width
- All content fits within viewport

---

### 6.8 Touch targets ≥44px on mobile
**Priority:** P1  
**Preconditions:** Mobile viewport  
**Steps:**
1. Set viewport to 375px width
2. Measure playlist header height
3. Measure theme toggle button size
4. Measure "Show all" button height

**Expected Result:**
- Playlist header: ≥44px height
- Theme toggle: 40px (2.5rem)
- "Show all" button: ≥44px height

---

## 7.0 Accessibility

### 7.1 Tab key navigates all interactive elements
**Priority:** P0  
**Preconditions:** Page has loaded  
**Steps:**
1. Press Tab key repeatedly
2. Observe focus movement

**Expected Result:**
- Focus moves to: skip link → theme toggle → playlist headers → video cards → "Show all" button → footer
- Focus order is logical
- No focus traps

---

### 7.2 Focus ring visible on all focusable elements
**Priority:** P0  
**Preconditions:** Element is focused  
**Steps:**
1. Tab to theme toggle
2. Tab to playlist header
3. Tab to "Show all" button

**Expected Result:**
- Focus ring visible on all elements
- Ring color: #D4534A (accent)
- Ring offset: 2px
- Ring clearly visible in both themes

---

### 7.3 Skip-to-content link works
**Priority:** P1  
**Preconditions:** Page has loaded  
**Steps:**
1. Press Tab once
2. Check if skip link appears
3. Press Enter

**Expected Result:**
- Skip link visible at top of page
- Link text: "Skip to content"
- Pressing Enter moves focus to `#main-content`

---

### 7.4 Accordion has correct ARIA attributes
**Priority:** P0  
**Preconditions:** Playlist header is focused  
**Steps:**
1. Inspect playlist header element
2. Check ARIA attributes
3. Toggle panel and check changes

**Expected Result:**
- Header has `aria-expanded="false"` when collapsed
- Header has `aria-expanded="true"` when expanded
- Header has `aria-controls="{panel-id}"`
- Panel has `role="region"`
- Panel has `aria-labelledby="{header-id}"`

---

### 7.5 Theme toggle has aria-label
**Priority:** P1  
**Preconditions:** Theme toggle button exists  
**Steps:**
1. Inspect theme toggle button
2. Check aria-label attribute

**Expected Result:**
- Button has `aria-label="Toggle day/night mode"`
- Label is descriptive and clear

---

### 7.6 iframes have title attributes
**Priority:** P1  
**Preconditions:** Video card is visible  
**Steps:**
1. Inspect iframe element
2. Check title attribute

**Expected Result:**
- iframe has `title` attribute
- Title matches cleaned video title
- Title is descriptive

---

### 7.7 prefers-reduced-motion disables transitions
**Priority:** P2  
**Preconditions:** OS reduced motion enabled  
**Steps:**
1. Enable "Reduce motion" in OS settings
2. Toggle theme
3. Open/close accordion

**Expected Result:**
- No color transitions
- No accordion animation
- No scroll animation
- All transitions: 0.01ms

---

### 7.8 All text meets WCAG AA contrast ratio
**Priority:** P0  
**Preconditions:** Both themes  
**Steps:**
1. Use contrast checker tool
2. Check night mode text/background
3. Check day mode text/background
4. Check muted text in both modes

**Expected Result:**
- Night mode: #E8E2DA on #0F1923 → ratio ≥4.5:1
- Day mode: #1A1A1A on #F5F0EB → ratio ≥4.5:1
- Muted text meets AA for large text (≥3:1)

---

## 8.0 Error Handling

### 8.1 Missing manifest shows error message
**Priority:** P0  
**Preconditions:** `data/playlists.json` does not exist  
**Steps:**
1. Delete or rename `data/playlists.json`
2. Navigate to `http://localhost:port/`
3. Check for error message

**Expected Result:**
- Error message: "Fehler beim Laden"
- Error details: "Failed to load playlist manifest"
- No playlists rendered

---

### 8.2 Broken JSON shows error message
**Priority:** P1  
**Preconditions:** `data/playlists.json` contains invalid JSON  
**Steps:**
1. Corrupt `data/playlists.json` (e.g., remove closing bracket)
2. Navigate to `http://localhost:port/`
3. Check for error message

**Expected Result:**
- Error message visible
- Console shows JSON parse error
- No playlists rendered

---

### 8.3 Network failure shows error message
**Priority:** P1  
**Preconditions:** Network offline  
**Steps:**
1. Enable offline mode in DevTools
2. Navigate to `http://localhost:port/`
3. Check for error message

**Expected Result:**
- Error message visible
- Error details mention network failure
- No playlists rendered

---

### 8.4 Empty manifest shows "no playlists" message
**Priority:** P2  
**Preconditions:** `data/playlists.json` contains `[]`  
**Steps:**
1. Set `data/playlists.json` to `[]`
2. Navigate to `http://localhost:port/`
3. Check for empty state message

**Expected Result:**
- Message: "Keine Playlists gefunden."
- No error state
- Page loads normally

---

### 8.5 Missing individual playlist file shows error
**Priority:** P1  
**Preconditions:** Manifest references non-existent file  
**Steps:**
1. Add "B1 - German.json" to manifest
2. Do not create the file
3. Navigate to `http://localhost:port/`
4. Check for error message

**Expected Result:**
- Error message visible
- Error details: "Failed to load B1 - German.json"
- No playlists rendered

---

## 9.0 Visual Polish

### 9.1 Custom fonts load (Libre Baskerville, Karla, IBM Plex Mono)
**Priority:** P1  
**Preconditions:** Page has loaded  
**Steps:**
1. Open DevTools → Network tab
2. Filter by "font"
3. Check font files loaded

**Expected Result:**
- Libre Baskerville (400, 700) loaded
- Karla (400, 500, 600, 700) loaded
- IBM Plex Mono (400, 500) loaded
- All fonts from Google Fonts CDN

---

### 9.2 Accent color (#D4534A) used consistently
**Priority:** P2  
**Preconditions:** Page has loaded  
**Steps:**
1. Check playlist badge color
2. Check lesson number label color
3. Check focus ring color
4. Check skip link background

**Expected Result:**
- All accent elements: #D4534A
- Color consistent across both themes
- No color variations

---

### 9.3 Footer visible at bottom of page
**Priority:** P2  
**Preconditions:** Page has loaded  
**Steps:**
1. Scroll to bottom of page
2. Check footer visibility
3. Check footer content

**Expected Result:**
- Footer visible
- Text: "Goethe-Institut Prüfungsvorbereitung · A1 & A2"
- Footer has top border
- Text is muted color

---

### 9.4 No console errors on clean load
**Priority:** P1  
**Preconditions:** Fresh page load  
**Steps:**
1. Open DevTools → Console tab
2. Navigate to `http://localhost:port/`
3. Check for errors

**Expected Result:**
- No JavaScript errors
- No 404 errors in network tab
- No warnings (except deprecation notices acceptable)

---

## Test Execution Summary

| Suite | Total | P0 | P1 | P2 |
|-------|-------|----|----|-----|
| 1.0 Page Load & Data | 6 | 3 | 2 | 1 |
| 2.0 Title Cleaning | 3 | 2 | 1 | 0 |
| 3.0 Accordion Behavior | 7 | 4 | 2 | 1 |
| 4.0 Video Grid | 6 | 3 | 3 | 0 |
| 5.0 Theme Toggle | 8 | 4 | 2 | 2 |
| 6.0 Responsive Layout | 8 | 4 | 3 | 1 |
| 7.0 Accessibility | 8 | 4 | 3 | 1 |
| 8.0 Error Handling | 5 | 1 | 3 | 1 |
| 9.0 Visual Polish | 4 | 0 | 2 | 2 |
| **TOTAL** | **55** | **25** | **21** | **9** |

---

## Sign-Off

**Tested By:** ___________________  
**Date:** ___________________  
**Browser/Device:** ___________________  
**Result:** ☐ PASS ☐ FAIL ☐ CONDITIONAL PASS  

**Notes:**  
_____________________________________________  
_____________________________________________  
_____________________________________________
