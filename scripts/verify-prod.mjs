import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'https://adri-ugc-v2.vercel.app/';
const PORT = 9333;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.msgId = 0;
    this.callbacks = new Map();
    this.events = [];
    this.consoleMessages = [];
    this.pageErrors = [];

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
      } else if (msg.method) {
        if (msg.method === 'Runtime.consoleAPICalled') {
          const text = msg.params.args.map(a => a.value ?? a.description ?? '').join(' ');
          this.consoleMessages.push({ type: msg.params.type, text });
          if (msg.params.type === 'error') {
            console.error(`  [Browser Console Error]`, text);
          }
        } else if (msg.method === 'Runtime.exceptionThrown') {
          const desc = msg.params.exceptionDetails?.exception?.description || msg.params.exceptionDetails?.text;
          this.pageErrors.push(desc);
          console.error(`  [Browser Uncaught Exception]`, desc);
        }
      }
    };
  }

  ready() {
    return new Promise((resolve, reject) => {
      if (this.ws.readyState === WebSocket.OPEN) return resolve();
      this.ws.onopen = () => resolve();
      this.ws.onerror = reject;
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.msgId;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
      userGesture: true
    });
    if (res.exceptionDetails) {
      throw new Error(`Eval error: ${JSON.stringify(res.exceptionDetails)}`);
    }
    return res.result?.value;
  }

  close() {
    this.ws.close();
  }
}

async function runSession(mode, options = {}) {
  console.log(`\n======================================================`);
  console.log(` Iniciando verificación: ${mode.toUpperCase()}`);
  console.log(`======================================================`);

  // Create new page/tab via HTTP endpoint
  const newTabRes = await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(TARGET_URL)}`, { method: 'PUT' });
  const tabData = await newTabRes.json();
  const cdp = new CDPClient(tabData.webSocketDebuggerUrl);
  await cdp.ready();

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  if (options.mobile) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true,
      hasTouch: true
    });
    await cdp.send('Emulation.setUserAgentOverride', {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1'
    });
  } else {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false
    });
  }

  console.log(`Navegando a ${TARGET_URL}...`);
  await cdp.send('Page.navigate', { url: TARGET_URL });
  await sleep(2500);

  // Check page title and structure
  const pageTitle = await cdp.eval('document.title');
  console.log(`Título de la página: "${pageTitle}"`);

  const playersCount = await cdp.eval(`document.querySelectorAll('[data-player]').length`);
  console.log(`Total de reproductores encontrados: ${playersCount}`);

  if (playersCount !== 3) {
    throw new Error(`Se esperaban 3 reproductores pero se encontraron ${playersCount}`);
  }

  // Iterate over each spotlight video
  for (let i = 0; i < 3; i++) {
    console.log(`\n--- Probando Spotlight Video #${i + 1} ---`);

    // Get metadata before clicking
    const preInfo = await cdp.eval(`(() => {
      const p = document.querySelectorAll('[data-player]')[${i}];
      const v = p.querySelector('video');
      return {
        id: p.id,
        src: v ? v.src : null,
        currentSrc: v ? v.currentSrc : null,
        paused: v ? v.paused : null,
        networkState: v ? v.networkState : null,
        readyState: v ? v.readyState : null,
        muted: v ? v.muted : null,
        currentTime: v ? v.currentTime : null,
        duration: v ? v.duration : null
      };
    })()`);

    console.log(`  Estado PRE-Play:`, JSON.stringify(preInfo, null, 2));

    // Simulate click on play button with user gesture
    console.log(`  Haciendo click en botón de Play...`);
    await cdp.eval(`(() => {
      const p = document.querySelectorAll('[data-player]')[${i}];
      const btn = p.querySelector('.spotlight-play-btn, [data-toggle]');
      btn.click();
    })()`);

    // Wait 2.5 seconds for media to advance
    await sleep(2500);

    const postInfo = await cdp.eval(`(() => {
      const players = document.querySelectorAll('[data-player]');
      const p = players[${i}];
      const v = p.querySelector('video');
      
      const otherStates = [];
      players.forEach((other, idx) => {
        if (idx !== ${i}) {
          const ov = other.querySelector('video');
          otherStates.push({ index: idx + 1, paused: ov ? ov.paused : null, currentTime: ov ? ov.currentTime : null });
        }
      });

      return {
        id: p.id,
        paused: v ? v.paused : null,
        currentTime: v ? v.currentTime : null,
        duration: v ? v.duration : null,
        networkState: v ? v.networkState : null,
        readyState: v ? v.readyState : null,
        muted: v ? v.muted : null,
        volume: v ? v.volume : null,
        isPlayingClass: p.classList.contains('is-playing'),
        others: otherStates
      };
    })()`);

    console.log(`  Estado POST-Play:`, JSON.stringify(postInfo, null, 2));

    // Assertions
    if (postInfo.paused !== false) {
      throw new Error(`FALLO: Video #${i + 1} (${preInfo.id}) sigue pausado (paused === ${postInfo.paused})`);
    }
    if (!(postInfo.currentTime > 0)) {
      throw new Error(`FALLO: Video #${i + 1} no avanzó tiempo (currentTime === ${postInfo.currentTime})`);
    }
    if (!postInfo.isPlayingClass) {
      throw new Error(`FALLO: Contenedor no tiene clase is-playing`);
    }
    for (const other of postInfo.others) {
      if (other.paused !== true) {
        throw new Error(`FALLO: El video #${other.index} no se pausó al reproducir el #${i + 1}`);
      }
    }

    console.log(`  [OK] Video #${i + 1} reproduciendo correctamente (currentTime: ${postInfo.currentTime.toFixed(2)}s / ${postInfo.duration.toFixed(2)}s).`);
    console.log(`  [OK] Los demás videos permanecen pausados.`);

    // Test mute toggle button
    console.log(`  Probando botón de Mute/Unmute...`);
    const mutePre = postInfo.muted;
    await cdp.eval(`(() => {
      const p = document.querySelectorAll('[data-player]')[${i}];
      const muteBtn = p.querySelector('[data-mute]');
      if (muteBtn) muteBtn.click();
    })()`);
    await sleep(400);

    const mutePost = await cdp.eval(`(() => {
      const p = document.querySelectorAll('[data-player]')[${i}];
      const v = p.querySelector('video');
      const muteBtn = p.querySelector('[data-mute]');
      return {
        muted: v.muted,
        ariaLabel: muteBtn ? muteBtn.getAttribute('aria-label') : null
      };
    })()`);

    console.log(`  Estado MUTE: antes=${mutePre}, después=${mutePost.muted} (label="${mutePost.ariaLabel}")`);
    if (mutePost.muted === mutePre) {
      throw new Error(`FALLO: El botón de mute no alternó el estado de silencio`);
    }
    console.log(`  [OK] Botón de Mute funciona y alternó correctamente.`);
  }

  // Check console errors
  console.log(`\nRevisión de errores en consola para ${mode}:`);
  if (cdp.pageErrors.length > 0) {
    throw new Error(`Se detectaron excepciones de JavaScript en página: ${JSON.stringify(cdp.pageErrors)}`);
  }
  const realErrors = cdp.consoleMessages.filter(m => m.type === 'error');
  if (realErrors.length > 0) {
    throw new Error(`Se detectaron errores en consola: ${JSON.stringify(realErrors)}`);
  }
  console.log(`[OK] Cero errores en consola.`);

  // Close tab
  await cdp.send('Target.closeTarget', { targetId: tabData.id }).catch(() => {});
  cdp.close();
}

async function main() {
  const tmpDir = await mkdtemp(path.join(tmpdir(), 'chrome-verify-'));
  console.log(`Iniciando Chrome Headless (puerto ${PORT})...`);

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${tmpDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--autoplay-policy=no-user-gesture-required',
    'about:blank'
  ], { stdio: 'ignore' });

  // Wait for Chrome remote debugging to respond
  let connected = false;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) {
        connected = true;
        break;
      }
    } catch {}
    await sleep(200);
  }

  if (!connected) {
    chromeProc.kill();
    await rm(tmpDir, { recursive: true, force: true });
    throw new Error('No se pudo conectar con Chrome Headless');
  }

  try {
    // 1. Test Desktop
    await runSession('desktop', { mobile: false });

    // 2. Test Mobile (iPhone)
    await runSession('mobile (iPhone)', { mobile: true });

    console.log(`\n======================================================`);
    console.log(` ¡TODAS LAS VERIFICACIONES PASARON AL 100%!`);
    console.log(`======================================================\n`);
  } finally {
    chromeProc.kill('SIGKILL');
    await sleep(500);
    await rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}

main().catch(err => {
  console.error('\nERROR FATAL EN VERIFICACIÓN:', err);
  process.exit(1);
});
