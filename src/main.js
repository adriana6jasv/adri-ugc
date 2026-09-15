import { icons } from './icons.mjs';

// Spotlight video players controller
const players = [...document.querySelectorAll('[data-player]')];
const clock = seconds => Number.isFinite(seconds) ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}` : '0:00';

for (const player of players) {
  const video = player.querySelector('video');
  const controls = player.querySelector('.spotlight-player-controls, .v2-player-controls');
  const toggles = [...player.querySelectorAll('[data-toggle]')];
  const mute = player.querySelector('[data-mute]');
  const seek = player.querySelector('.ctrl-seek, .control-seek');
  const time = player.querySelector('.ctrl-time, .control-time');
  const fullscreen = player.querySelector('[data-fullscreen]');
  let seeking = false;

  if (video) {
    let userPrefersMuted = false;

    const update = () => {
      player.classList.toggle('is-playing', !video.paused);
      toggles.forEach(button => {
        const isCenterBtn = button.classList.contains('spotlight-play-btn');
        if (isCenterBtn) {
          button.innerHTML = video.paused 
            ? `<span class="play-icon-inner" aria-hidden="true">${icons.play}</span>` 
            : `<span class="play-icon-inner" aria-hidden="true">${icons.pause}</span>`;
        } else {
          button.innerHTML = video.paused ? icons.play : icons.pause;
        }
        button.setAttribute('aria-label', `${video.paused ? 'Reproducir' : 'Pausar'} video`);
      });
      if (time) time.textContent = `${clock(video.currentTime)} / ${clock(video.duration)}`;
      if (seek && !seeking) seek.value = Number.isFinite(video.duration) && video.duration > 0 ? (video.currentTime / video.duration * 100) : 0;
      if (mute) {
        mute.innerHTML = video.muted ? icons.muted : icons.sound;
        mute.setAttribute('aria-label', video.muted ? 'Activar sonido' : 'Silenciar');
      }
    };

    const pauseOthers = () => {
      players.forEach(other => {
        if (other !== player) {
          const otherVid = other.querySelector('video');
          if (otherVid && !otherVid.paused) {
            otherVid.pause();
          }
        }
      });
    };

    const play = async () => {
      pauseOthers();

      if (!video.currentSrc && !video.src) {
        const source = video.querySelector('source');
        if (source && source.src) video.src = source.src;
      }

      if (!userPrefersMuted) {
        video.muted = false;
      }

      try {
        await video.play();
      } catch (err) {
        // Fallback no bloqueante a reproducción silenciada si la política de autoplay restringe audio
        video.muted = true;
        try {
          await video.play();
        } catch (e2) {
          if (e2.name !== 'AbortError') {
            console.warn('Playback error:', e2);
          }
        }
      }
      update();
    };

    const toggle = () => video.paused ? play() : video.pause();

    toggles.forEach(button => button.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle();
    }));
    video.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle();
    });
    video.addEventListener('play', () => {
      pauseOthers();
      update();
    });
    video.addEventListener('ended', () => {
      video.currentTime = 0;
      update();
    });
    ['pause', 'timeupdate', 'loadedmetadata', 'volumechange'].forEach(event => video.addEventListener(event, update));
    if (mute) {
      mute.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        userPrefersMuted = video.muted;
        update();
      });
    }
    if (seek) {
      seek.addEventListener('click', (e) => e.stopPropagation());
      seek.addEventListener('input', () => {
        if (Number.isFinite(video.duration)) {
          seeking = true;
          video.currentTime = Number(seek.value) * video.duration / 100;
          update();
        }
      });
      seek.addEventListener('change', () => { seeking = false; update(); });
    }

    if (fullscreen) {
      fullscreen.addEventListener('click', async (e) => {
        e.stopPropagation();
        try {
          if (document.fullscreenElement) await document.exitFullscreen();
          else if (player.requestFullscreen) await player.requestFullscreen();
          else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
        } catch { /* inline fallback */ }
      });
    }

    if (controls) controls.hidden = false;
    update();
  } else {
    // When video is poster-only, clicking the toggle scrolls down to contact
    toggles.forEach(button => {
      button.addEventListener('click', (ev) => {
        ev.preventDefault();
        const contactSection = document.getElementById('contacto');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
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
