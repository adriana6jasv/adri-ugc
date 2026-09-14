import { icons } from './icons.mjs';

// Video players controller
const players = [...document.querySelectorAll('[data-player]')];
const clock = seconds => Number.isFinite(seconds) ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}` : '0:00';

for (const player of players) {
  const video = player.querySelector('video');
  const controls = player.querySelector('.player-controls');
  const toggles = [...player.querySelectorAll('[data-toggle]')];
  const mute = player.querySelector('[data-mute]');
  const seek = player.querySelector('.seek');
  const time = player.querySelector('.player-time');
  const error = player.querySelector('.player-error');
  const fullscreen = player.querySelector('[data-fullscreen]');
  let seeking = false;

  const update = () => {
    player.classList.toggle('is-playing', !video.paused);
    toggles.forEach(button => {
      button.innerHTML = video.paused ? icons.play : icons.pause;
      button.setAttribute('aria-label', `${video.paused ? 'Reproducir' : 'Pausar'} ${video.getAttribute('aria-label') || 'video'}`);
    });
    time.textContent = `${clock(video.currentTime)} / ${clock(video.duration)}`;
    if (!seeking) seek.value = Number.isFinite(video.duration) && video.duration > 0 ? video.currentTime / video.duration * 100 : 0;
    seek.setAttribute('aria-valuetext', `${clock(video.currentTime)} de ${clock(video.duration)}`);
    mute.innerHTML = video.muted ? icons.muted : icons.sound;
    mute.setAttribute('aria-label', video.muted ? 'Activar sonido' : 'Silenciar');
    mute.setAttribute('aria-pressed', String(video.muted));
  };

  const play = async () => {
    players.forEach(other => { if (other !== player) other.querySelector('video')?.pause(); });
    if (error) error.hidden = true;
    try {
      await video.play();
    } catch (err) {
      if (err.name !== 'AbortError' && error) error.hidden = false;
    }
    update();
  };

  const toggle = () => video.paused ? play() : video.pause();

  toggles.forEach(button => button.addEventListener('click', toggle));
  video.addEventListener('click', toggle);
  video.addEventListener('play', () => {
    players.forEach(other => { if (other !== player) other.querySelector('video')?.pause(); });
    update();
  });
  ['pause', 'ended', 'timeupdate', 'loadedmetadata', 'volumechange'].forEach(event => video.addEventListener(event, update));
  video.addEventListener('error', () => { if (error) error.hidden = false; });
  video.querySelector('source')?.addEventListener('error', () => { if (error) error.hidden = false; });
  if (mute) mute.addEventListener('click', () => { video.muted = !video.muted; });
  if (seek) {
    seek.addEventListener('input', () => {
      if (Number.isFinite(video.duration)) {
        seeking = true;
        video.currentTime = Number(seek.value) * video.duration / 100;
        update();
      }
    });
    seek.addEventListener('change', () => { seeking = false; update(); });
    seek.addEventListener('blur', () => { seeking = false; });
  }

  if (fullscreen) {
    fullscreen.addEventListener('click', async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else if (player.requestFullscreen) await player.requestFullscreen();
        else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
      } catch { /* inline fallback */ }
    });
    if (!player.requestFullscreen && !video.webkitEnterFullscreen) fullscreen.hidden = true;
  }

  const retryBtn = player.querySelector('[data-retry]');
  if (retryBtn) retryBtn.addEventListener('click', () => { video.load(); play(); });

  player.addEventListener('keydown', event => {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'BUTTON') return;
    if (event.code === 'Space') { event.preventDefault(); toggle(); }
  });

  video.controls = false;
  if (controls) controls.hidden = false;
  player.classList.add('enhanced');
  update();
}

// Pause video when scrolled out of view
if ('IntersectionObserver' in window) {
  const pauseObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting && !document.fullscreenElement) {
        entry.target.querySelector('video')?.pause();
      }
    }
  }, { threshold: 0.1 });
  players.forEach(player => pauseObserver.observe(player));
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) players.forEach(player => player.querySelector('video')?.pause());
});

// Hook A/B/C interactive tab switcher
document.querySelectorAll('[data-hook-switcher]').forEach(switcher => {
  const tabs = switcher.querySelectorAll('.hook-tab-btn');
  const panels = switcher.querySelectorAll('.hook-panel');

  switcher.addEventListener('click', event => {
    const btn = event.target.closest('.hook-tab-btn');
    if (!btn) return;
    const hookId = btn.dataset.hookTarget || btn.dataset.hookId;

    tabs.forEach(t => {
      const active = t === btn;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
    });

    panels.forEach(p => {
      const match = p.id === hookId;
      p.classList.toggle('is-active', match);
      p.hidden = !match;
    });
  });
});

// Category/Topic Filters
const filterBar = document.querySelector('.work-filters');
const pieces = [...document.querySelectorAll('.work-piece')];

if (filterBar) {
  const applyFilter = topic => {
    filterBar.querySelectorAll('.filter-btn').forEach(b => {
      const active = b.dataset.topicFilter === topic;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', String(active));
    });

    pieces.forEach(p => {
      const visible = topic === 'all' || p.dataset.topic === topic;
      p.hidden = !visible;
      if (!visible) p.querySelector('video')?.pause();
    });
  };

  filterBar.addEventListener('click', event => {
    const btn = event.target.closest('[data-topic-filter]');
    if (btn) applyFilter(btn.dataset.topicFilter);
  });

  const revealHash = () => {
    const p = pieces.find(p => '#' + p.id === location.hash);
    if (p && p.hidden) {
      applyFilter('all');
      p.scrollIntoView({ behavior: 'smooth' });
    }
  };
  window.addEventListener('hashchange', revealHash);
  revealHash();
}

// Copy to clipboard with toast notification
const toast = document.getElementById('toast');
let toastTimer = null;

const showToast = message => {
  if (!toast) return;
  if (message) {
    const textSpan = toast.querySelector('span');
    if (textSpan) textSpan.textContent = message;
  }
  toast.hidden = false;
  requestAnimationFrame(() => {
    toast.classList.add('is-visible');
  });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => { toast.hidden = true; }, 300);
  }, 2500);
};

document.addEventListener('click', async event => {
  const copyBtn = event.target.closest('[data-copy-email]');
  if (!copyBtn) return;
  const email = copyBtn.dataset.copyEmail || 'adriana6jasv@gmail.com';
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(email);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = email;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    showToast('¡Correo copiado al portapapeles!');
  } catch {
    showToast('Correo: ' + email);
  }
});

