(function () {
  'use strict';

  const STORAGE_KEY = 'dl-theme';

  const container = document.getElementById('playlists-container');
  const themeToggle = document.getElementById('theme-toggle');
  const iconMoon = document.getElementById('icon-moon');
  const iconSun = document.getElementById('icon-sun');

  let openPanelId = null;
  let allPlaylists = [];

  window.__PLAYLISTS__ = null;

  // ── Theme ──────────────────────────────────────────

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'night' || stored === 'day') return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'day' : 'night';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    if (theme === 'night') {
      iconMoon.classList.remove('hidden');
      iconSun.classList.add('hidden');
    } else {
      iconMoon.classList.add('hidden');
      iconSun.classList.remove('hidden');
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'night' ? 'day' : 'night');
  }

  applyTheme(getPreferredTheme());

  themeToggle.addEventListener('click', toggleTheme);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'night' : 'day');
    }
  });

  // ── Title Cleaning ─────────────────────────────────

  function cleanTitle(raw) {
    return raw
      .replace(/\s+\d{8}\s+\d{6}\s*$/, '')
      .replace(/^\d+\s+/, '')
      .trim();
  }

  // ── Data Loading ───────────────────────────────────

  async function loadManifest() {
    const res = await fetch('data/playlists.json');
    if (!res.ok) throw new Error('Failed to load playlist manifest');
    return res.json();
  }

  async function loadPlaylist(filename) {
    const res = await fetch(`data/${filename}`);
    if (!res.ok) throw new Error(`Failed to load ${filename}`);
    return res.json();
  }

  // ── Routing ────────────────────────────────────────

  function handleRoute() {
    const hash = window.location.hash;
    const match = hash.match(/^#video=(.+)$/);
    if (match) {
      renderVideoPage(match[1]);
    } else {
      renderLandingPage();
    }
  }

  window.addEventListener('hashchange', handleRoute);

  // ── Video Page ─────────────────────────────────────

  function renderVideoPage(videoId) {
    const videoPage = document.getElementById('video-page');
    const mainContent = document.getElementById('main-content');
    const videoIframe = document.getElementById('video-iframe');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const backLink = document.getElementById('back-link');
    const videoTitleEl = document.getElementById('video-page-title');

    let foundVideo = null;
    let foundPlaylist = null;

    for (const playlist of allPlaylists) {
      const video = playlist.videos.find(v => v.video_id === videoId);
      if (video) {
        foundVideo = video;
        foundPlaylist = playlist;
        break;
      }
    }

    if (!foundVideo) {
      window.location.hash = '';
      return;
    }

    const sortedVideos = [...foundPlaylist.videos].sort((a, b) => a.index - b.index);
    const currentIndex = sortedVideos.findIndex(v => v.video_id === videoId);
    const prevVideo = currentIndex > 0 ? sortedVideos[currentIndex - 1] : null;
    const nextVideo = currentIndex < sortedVideos.length - 1 ? sortedVideos[currentIndex + 1] : null;

    videoIframe.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
    videoTitleEl.textContent = `Lektion ${foundVideo.index}: ${cleanTitle(foundVideo.title)}`;

    prevBtn.disabled = !prevVideo;
    nextBtn.disabled = !nextVideo;

    prevBtn.onclick = prevVideo ? () => { window.location.hash = `video=${prevVideo.video_id}`; } : null;
    nextBtn.onclick = nextVideo ? () => { window.location.hash = `video=${nextVideo.video_id}`; } : null;

    backLink.onclick = (e) => {
      e.preventDefault();
      window.location.hash = '';
    };

    mainContent.classList.add('hidden');
    videoPage.classList.remove('hidden');
    window.scrollTo(0, 0);
  }

  function renderLandingPage() {
    const videoPage = document.getElementById('video-page');
    const mainContent = document.getElementById('main-content');
    const videoIframe = document.getElementById('video-iframe');

    videoIframe.src = '';
    videoPage.classList.add('hidden');
    mainContent.classList.remove('hidden');
  }

  // ── Rendering ──────────────────────────────────────

  function createVideoCard(video, playlistIndex) {
    const card = document.createElement('a');
    card.className = 'video-card';
    card.href = `#video=${video.video_id}`;

    const cleaned = cleanTitle(video.title);

    card.innerHTML = `
      <div class="video-card-inner">
        <div class="video-play-icon" aria-hidden="true"></div>
        <div class="video-content">
          <span class="video-number">Lektion ${video.index}</span>
          <h3 class="video-title">${cleaned}</h3>
        </div>
      </div>
    `;
    return card;
  }

  function createVideoGrid(videos, playlistId) {
    const wrapper = document.createElement('div');
    wrapper.className = 'video-grid';

    videos.forEach((v) => {
      wrapper.appendChild(createVideoCard(v, playlistId));
    });

    return wrapper;
  }



  function createPlaylistSection(playlist) {
    const section = document.createElement('section');
    section.className = 'playlist-section';

    const id = `playlist-${playlist.playlist_title.replace(/\s+/g, '-').toLowerCase()}`;
    const totalVideos = playlist.total_videos || playlist.videos.length;
    const sortedVideos = [...playlist.videos].sort((a, b) => a.index - b.index);

    section.innerHTML = `
      <button
        class="playlist-header my-5"
        id="${id}-header"
        aria-expanded="false"
        aria-controls="${id}-panel"
      >
        <span class="playlist-badge" aria-hidden="true">${playlist.playlist_title.split(' - ')[0]}</span>
        <div class="playlist-info">
          <div class="font-display font-bold text-lg">${playlist.playlist_title}</div>
          <div class="playlist-count">${totalVideos} Lektionen</div>
        </div>
        <svg class="playlist-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div
        class="playlist-panel"
        id="${id}-panel"
        role="region"
        aria-labelledby="${id}-header"
      >
        <div class="playlist-panel-inner"></div>
      </div>
    `;

    const header = section.querySelector('.playlist-header');
    const panel = section.querySelector('.playlist-panel');
    const panelInner = section.querySelector('.playlist-panel-inner');
    const grid = createVideoGrid(sortedVideos, id);

    panelInner.appendChild(grid);

    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      if (openPanelId && openPanelId !== id) {
        const prevHeader = document.getElementById(`${openPanelId}-header`);
        const prevPanel = document.getElementById(`${openPanelId}-panel`);
        if (prevHeader && prevPanel) {
          prevHeader.setAttribute('aria-expanded', 'false');
          prevPanel.classList.remove('is-open');
        }
      }

      header.setAttribute('aria-expanded', String(!isExpanded));
      panel.classList.toggle('is-open', !isExpanded);
      openPanelId = !isExpanded ? id : null;

      if (!isExpanded) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 450);
      }
    });

    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });

    return section;
  }

  function renderError(message) {
    container.innerHTML = `
      <div class="text-center py-12">
        <p class="text-accent font-mono text-sm mb-2">Fehler beim Laden</p>
        <p class="text-sm opacity-60">${message}</p>
      </div>
    `;
  }

  function renderEmpty() {
    container.innerHTML = `
      <div class="text-center py-12 opacity-50">
        <p class="font-mono text-sm">Keine Playlists gefunden.</p>
      </div>
    `;
  }

  // ── Init ───────────────────────────────────────────

  async function init() {
    try {
      const files = await loadManifest();
      if (!files || files.length === 0) {
        renderEmpty();
        return;
      }

      container.innerHTML = '';

      const playlists = await Promise.all(files.map(loadPlaylist));

      allPlaylists = playlists;
      window.__PLAYLISTS__ = playlists;

      playlists
        .sort((a, b) => a.playlist_title.localeCompare(b.playlist_title))
        .forEach((playlist) => {
          container.appendChild(createPlaylistSection(playlist));
        });

      handleRoute();

    } catch (err) {
      console.error(err);
      renderError(err.message);
    }
  }

  init();
})();
