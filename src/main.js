import { icons } from './icons.mjs';

// Video players controller
const players = [...document.querySelectorAll('[data-player]')];
const clock = seconds => Number.isFinite(seconds) ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}` : '0:00';

for (const player of players) {
  const video = player.querySelector('video');
  const controls = player.querySelector('.v2-player-controls');
  const toggles = [...player.querySelectorAll('[data-toggle]')];
  const mute = player.querySelector('[data-mute]');
  const seek = player.querySelector('.control-seek');
  const time = player.querySelector('.control-time');
  const fullscreen = player.querySelector('[data-fullscreen]');
  let seeking = false;

  if (video) {
    const update = () => {
      player.classList.toggle('is-playing', !video.paused);
      toggles.forEach(button => {
        button.innerHTML = video.paused ? icons.play : icons.pause;
        button.setAttribute('aria-label', `${video.paused ? 'Reproducir' : 'Pausar'} video`);
      });
      if (time) time.textContent = `${clock(video.currentTime)} / ${clock(video.duration)}`;
      if (seek && !seeking) seek.value = Number.isFinite(video.duration) && video.duration > 0 ? video.currentTime / video.duration * 100 : 0;
      if (mute) {
        mute.innerHTML = video.muted ? icons.muted : icons.sound;
        mute.setAttribute('aria-label', video.muted ? 'Activar sonido' : 'Silenciar');
      }
    };

    const play = async () => {
      players.forEach(other => { if (other !== player) other.querySelector('video')?.pause(); });
      try {
        await video.play();
      } catch (err) {
        if (err.name !== 'AbortError') console.warn(err);
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
    }

    if (fullscreen) {
      fullscreen.addEventListener('click', async () => {
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
    // Cuando el video es una muestra con poster
    toggles.forEach(button => {
      button.addEventListener('click', () => {
        const title = player.querySelector('.video-card-title')?.textContent || 'este formato';
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
