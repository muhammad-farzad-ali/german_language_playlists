# Deutsch Lernen — German Language Video Library

Goethe A1 & A2 exam preparation videos organized by proficiency level.

## Quick Start

```bash
# Serve locally
npx serve

# Open in browser
open http://localhost:3000
```

## Project Structure

```
german_language_playlists/
├── data/
│   ├── playlists.json          # Playlist manifest
│   ├── A1 - German.json       # A1 level videos
│   └── A2 - German.json       # A2 level videos
├── index.html
├── style.css
├── app.js
└── PLAN.md                    # Design & implementation plan
```

## Adding a New Playlist

1. Create a new JSON file in `data/` (see existing files for format)
2. Add the filename to `data/playlists.json`

```json
["A1 - German.json", "A2 - German.json", "NEW - Playlist.json"]
```

### Playlist JSON Format

```json
{
  "playlist_title": "A1 - German",
  "playlist_url": "https://youtube.com/playlist?list=...",
  "total_videos": 59,
  "videos": [
    {
      "index": 1,
      "title": "1  Vowels, informal greetings 20260612 143656",
      "video_id": "Iyxc05UQHKU",
      "url": "https://youtube.com/watch?v=Iyxc05UQHKU",
      "short_url": "https://youtu.be/Iyxc05UQHKU"
    }
  ]
}
```

## Features

- **Night/Day mode** — toggle in header, persists to localStorage
- **Accordion navigation** — click level header to expand/collapse
- **Video pages** — click any video title to open the player
- **Prev/Next navigation** — cycle through videos within the same playlist
- **Responsive grid** — 1/2/3 columns on mobile/tablet/desktop

## Tech Stack

- Vanilla JavaScript (no framework)
- Tailwind CSS (CDN)
- Google Fonts (IBM Plex Mono, Karla, Libre Baskerville)
- YouTube nocookie embeds

## Version History

- **v2.0.0** — Client-side video page navigation with hash-based routing
- **v1.0.0** — Initial release with accordion-based video display
