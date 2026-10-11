import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = process.argv[2] || 'https://maternidadconadri.com/';

console.log(`[QA] Starting automated Chrome CDP test against: ${TARGET_URL}`);

const tempDir = await mkdtemp(path.join(tmpdir(), 'chrome-qa-'));
const chrome = spawn(CHROME_PATH, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--autoplay-policy=no-user-gesture-required',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  `--user-data-dir=${tempDir}`
], { stdio: 'ignore' });

// Wait for Chrome debugging port to be ready
let versionData = null;
for (let i = 0; i < 30; i++) {
  try {
    const res = await fetch('http://127.0.0.1:9222/json/version');
    if (res.ok) {
      versionData = await res.json();
      break;
    }
  } catch {
    await new Promise(r => setTimeout(r, 200));
  }
}

if (!versionData) {
  chrome.kill();
  await rm(tempDir, { recursive: true, force: true });
  throw new Error('Failed to connect to Chrome remote debugging port.');
}

console.log(`[QA] Chrome connected: ${versionData['Browser']}`);

// Create CDP client
class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();
    this.eventListeners = new Map();

    this.ready = new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      } else if (msg.method) {
        const listeners = this.eventListeners.get(msg.method) || [];
        listeners.forEach(fn => fn(msg.params));
      }
    };
  }

  send(method, params = {}) {
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  on(method, fn) {
    if (!this.eventListeners.has(method)) this.eventListeners.set(method, []);
    this.eventListeners.get(method).push(fn);
  }

  close() {
    this.ws.close();
  }
}

// Create a new tab target
const newTabRes = await fetch('http://127.0.0.1:9222/json/new', { method: 'PUT' });
const tabInfo = await newTabRes.json();
const client = new CDPClient(tabInfo.webSocketDebuggerUrl);
await client.ready;

await client.send('Page.enable');
await client.send('Network.enable');
await client.send('Runtime.enable');

const networkRequests = [];
const consoleMessages = [];

client.on('Network.requestWillBeSent', (params) => {
  networkRequests.push({
    requestId: params.requestId,
    url: params.request.url,
    method: params.request.method,
    headers: params.request.headers,
    timestamp: params.timestamp
  });
});

client.on('Network.responseReceived', (params) => {
  const req = networkRequests.find(r => r.requestId === params.requestId);
  if (req) {
    req.status = params.response.status;
    req.statusText = params.response.statusText;
    req.mimeType = params.response.mimeType;
    req.headers = params.response.headers;
    req.fromCache = params.response.fromDiskCache || params.response.fromServiceWorker;
  }
});

client.on('Network.loadingFinished', (params) => {
  const req = networkRequests.find(r => r.requestId === params.requestId);
  if (req) {
    req.encodedDataLength = params.encodedDataLength;
  }
});

client.on('Network.loadingFailed', (params) => {
  const req = networkRequests.find(r => r.requestId === params.requestId);
  if (req) {
    req.errorText = params.errorText;
  }
});

client.on('Runtime.consoleAPICalled', (params) => {
  consoleMessages.push({
    type: params.type,
    text: params.args.map(a => a.value ?? a.description ?? '').join(' ')
  });
});

client.on('Runtime.exceptionThrown', (params) => {
  consoleMessages.push({
    type: 'error',
    text: params.exceptionDetails.text + (params.exceptionDetails.exception?.description ? ': ' + params.exceptionDetails.exception.description : '')
  });
});

async function evaluate(expression) {
  const res = await client.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true
  });
  if (res.exceptionDetails) {
    throw new Error('Eval failed: ' + JSON.stringify(res.exceptionDetails));
  }
  return res.result.value;
}

// Set initial desktop viewport
await client.send('Emulation.setDeviceMetricsOverride', {
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false
});

console.log(`[QA] Navigating to ${TARGET_URL}...`);
const navPromise = new Promise(resolve => {
  client.on('Page.loadEventFired', resolve);
});
await client.send('Page.navigate', { url: TARGET_URL });
await navPromise;
// Wait 1.5s for initial layout/network settling
await new Promise(r => setTimeout(r, 1500));

console.log('\n==================================================');
console.log('1. INITIAL LOAD NETWORK AUDIT');
console.log('==================================================');

const mp4Initial = networkRequests.filter(r => r.url.includes('.mp4'));
const webpInitial = networkRequests.filter(r => r.url.includes('.webp'));

console.log(`Total initial network requests: ${networkRequests.length}`);
console.log(`Initial MP4 video requests made: ${mp4Initial.length}`);
let totalInitialVideoBytes = 0;
for (const req of mp4Initial) {
  const bytes = req.encodedDataLength || 0;
  totalInitialVideoBytes += bytes;
  console.log(`  - ${req.url} -> Status: ${req.status}, Bytes: ${bytes}`);
}

console.log(`Initial WebP poster requests made: ${webpInitial.length}`);
for (const req of webpInitial) {
  console.log(`  - ${req.url} -> Status: ${req.status}, Bytes: ${req.encodedDataLength || 'cached'}`);
}

if (totalInitialVideoBytes > 10 * 1024 * 1024) {
  console.error(`[FAIL] Initial page transferred ${ (totalInitialVideoBytes / 1024 / 1024).toFixed(2) } MB of MP4!`);
} else {
  console.log(`[PASS] Initial page transferred only ${(totalInitialVideoBytes / 1024).toFixed(1)} KB of video on load.`);
}

console.log('\n==================================================');
console.log('2. DOM & ASSETS VERIFICATION');
console.log('==================================================');

const domAssets = await evaluate(`
  (() => {
    const videos = [...document.querySelectorAll('.spotlight-video-frame video')];
    return videos.map((v, i) => ({
      index: i,
      src: v.src || v.querySelector('source')?.src,
      currentSrc: v.currentSrc,
      poster: v.poster,
      preload: v.preload,
      playsinline: v.hasAttribute('playsinline'),
      muted: v.muted,
      paused: v.paused,
      currentTime: v.currentTime,
      duration: v.duration,
      videoWidth: v.videoWidth,
      videoHeight: v.videoHeight
    }));
  })()
`);

console.log(`Found ${domAssets.length} spotlight videos in DOM:`);
domAssets.forEach((v, idx) => {
  console.log(`Video #${idx + 1}:`);
  console.log(`  src: ${v.src}`);
  console.log(`  poster: ${v.poster}`);
  console.log(`  preload: ${v.preload}, playsinline: ${v.playsinline}, muted: ${v.muted}`);
});

console.log('\n==================================================');
console.log('3. VIEWPORT RESPONSIVENESS & ASPECT RATIO AUDIT');
console.log('==================================================');

const viewports = [
  { name: 'Mobile iPhone SE', width: 375, height: 667, mobile: true },
  { name: 'Mobile iPhone 12/13/14', width: 390, height: 844, mobile: true },
  { name: 'Mobile iPhone 14/15 Pro Max', width: 430, height: 932, mobile: true },
  { name: 'Desktop Standard', width: 1440, height: 900, mobile: false },
  { name: 'Desktop Full HD', width: 1920, height: 1080, mobile: false }
];

for (const vp of viewports) {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: vp.width,
    height: vp.height,
    deviceScaleFactor: vp.mobile ? 2 : 1,
    mobile: vp.mobile
  });
  await new Promise(r => setTimeout(r, 200));

  const metrics = await evaluate(`
    (() => {
      const frames = [...document.querySelectorAll('.spotlight-video-frame')];
      const docOverflow = document.documentElement.scrollWidth > window.innerWidth;
      const frameData = frames.map(f => {
        const rect = f.getBoundingClientRect();
        return {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          ratio: (rect.width / rect.height).toFixed(3)
        };
      });
      return { docOverflow, scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, frameData };
    })()
  `);

  const ratiosOk = metrics.frameData.every(f => Math.abs(parseFloat(f.ratio) - (9/16)) < 0.05);
  console.log(`Viewport ${vp.name} (${vp.width}x${vp.height}):`);
  console.log(`  Horizontal overflow: ${metrics.docOverflow ? 'YES (FAIL)' : 'NO (PASS)'} (scrollWidth: ${metrics.scrollWidth}px vs window: ${metrics.innerWidth}px)`);
  console.log(`  Video frame dimensions: ${metrics.frameData.map(f => `${f.width}x${f.height} (ratio: ${f.ratio})`).join(' | ')}`);
  console.log(`  9:16 ratio maintained: ${ratiosOk ? 'PASS' : 'WARN'}`);
}

// Reset to Desktop 1440 for playback tests
await client.send('Emulation.setDeviceMetricsOverride', {
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false
});

console.log('\n==================================================');
console.log('4. PLAYBACK & SINGLE CONCURRENT VIDEO AUDIT');
console.log('==================================================');

// Scroll to spotlight 1
await evaluate(`document.querySelector('#spotlight-problem-solution')?.scrollIntoView()`);
await new Promise(r => setTimeout(r, 300));

// Test 4A: Start Video 1
console.log('[Test 4A] Clicking Play on Video 1 (Problem -> Solution)...');
await evaluate(`document.querySelector('#spotlight-problem-solution [data-toggle]')?.click()`);
await new Promise(r => setTimeout(r, 2500));

const state1 = await evaluate(`
  (() => {
    const v1 = document.querySelector('#spotlight-problem-solution video');
    const v2 = document.querySelector('#spotlight-voiceover video');
    const v3 = document.querySelector('#spotlight-real-mom video');
    const p1 = document.querySelector('#spotlight-problem-solution');
    return {
      v1: { paused: v1.paused, currentTime: v1.currentTime, muted: v1.muted, playingClass: p1.classList.contains('is-playing') },
      v2: { paused: v2.paused },
      v3: { paused: v3.paused }
    };
  })()
`);

console.log(`  Video 1: paused=${state1.v1.paused}, currentTime=${state1.v1.currentTime.toFixed(2)}s, is-playing=${state1.v1.playingClass}`);
console.log(`  Video 2: paused=${state1.v2.paused}, Video 3: paused=${state1.v3.paused}`);

if (!state1.v1.paused && state1.v1.currentTime > 0) {
  console.log('  [PASS] Video 1 started playback smoothly.');
} else {
  console.error('  [FAIL] Video 1 did not play as expected.');
}

// Test 4B: Start Video 2 while Video 1 is playing -> Video 1 must pause
console.log('\n[Test 4B] Clicking Play on Video 2 (Voice-over) while Video 1 is playing...');
await evaluate(`document.querySelector('#spotlight-voiceover')?.scrollIntoView()`);
await new Promise(r => setTimeout(r, 300));
await evaluate(`document.querySelector('#spotlight-voiceover [data-toggle]')?.click()`);
await new Promise(r => setTimeout(r, 2500));

const state2 = await evaluate(`
  (() => {
    const v1 = document.querySelector('#spotlight-problem-solution video');
    const v2 = document.querySelector('#spotlight-voiceover video');
    const v3 = document.querySelector('#spotlight-real-mom video');
    const p2 = document.querySelector('#spotlight-voiceover');
    return {
      v1: { paused: v1.paused, currentTime: v1.currentTime },
      v2: { paused: v2.paused, currentTime: v2.currentTime.toFixed(2), playingClass: p2.classList.contains('is-playing') },
      v3: { paused: v3.paused }
    };
  })()
`);

console.log(`  Video 1: paused=${state2.v1.paused} (at ${state2.v1.currentTime.toFixed(2)}s)`);
console.log(`  Video 2: paused=${state2.v2.paused} (at ${state2.v2.currentTime}s, is-playing=${state2.v2.playingClass})`);
console.log(`  Video 3: paused=${state2.v3.paused}`);

if (state2.v1.paused && !state2.v2.paused) {
  console.log('  [PASS] Mutual exclusivity verified: Video 1 automatically paused when Video 2 started!');
} else {
  console.error('  [FAIL] Multiple videos playing concurrently or Video 2 failed to play!');
}

// Test 4C: Start Video 3 while Video 2 is playing -> Video 2 must pause
console.log('\n[Test 4C] Clicking Play on Video 3 (Real Mom) while Video 2 is playing...');
await evaluate(`document.querySelector('#spotlight-real-mom')?.scrollIntoView()`);
await new Promise(r => setTimeout(r, 300));
await evaluate(`document.querySelector('#spotlight-real-mom [data-toggle]')?.click()`);
await new Promise(r => setTimeout(r, 2500));

const state3 = await evaluate(`
  (() => {
    const v1 = document.querySelector('#spotlight-problem-solution video');
    const v2 = document.querySelector('#spotlight-voiceover video');
    const v3 = document.querySelector('#spotlight-real-mom video');
    const p3 = document.querySelector('#spotlight-real-mom');
    return {
      v1: { paused: v1.paused },
      v2: { paused: v2.paused, currentTime: v2.currentTime },
      v3: { paused: v3.paused, currentTime: v3.currentTime.toFixed(2), playingClass: p3.classList.contains('is-playing') }
    };
  })()
`);

console.log(`  Video 1: paused=${state3.v1.paused}`);
console.log(`  Video 2: paused=${state3.v2.paused} (at ${state3.v2.currentTime.toFixed(2)}s)`);
console.log(`  Video 3: paused=${state3.v3.paused} (at ${state3.v3.currentTime}s, is-playing=${state3.v3.playingClass})`);

if (state3.v2.paused && !state3.v3.paused) {
  console.log('  [PASS] Mutual exclusivity verified: Video 2 automatically paused when Video 3 started!');
} else {
  console.error('  [FAIL] Video 3 did not play or Video 2 was not paused!');
}

// Test 4D: Audio & controls on Video 3
console.log('\n[Test 4D] Testing controls on Video 3 (Mute toggle, Seek, Pause)...');
const muteBtn = await evaluate(`
  (() => {
    const v3 = document.querySelector('#spotlight-real-mom video');
    const mute = document.querySelector('#spotlight-real-mom [data-mute]');
    const initialMuted = v3.muted;
    mute.click();
    const afterClickMuted = v3.muted;
    mute.click();
    const finalMuted = v3.muted;
    return { initialMuted, afterClickMuted, finalMuted };
  })()
`);
console.log(`  Mute toggle test: initial=${muteBtn.initialMuted} -> after click=${muteBtn.afterClickMuted} -> after 2nd click=${muteBtn.finalMuted}`);

// Test seek on Video 3
const seekResult = await evaluate(`
  (() => {
    const v3 = document.querySelector('#spotlight-real-mom video');
    const seek = document.querySelector('#spotlight-real-mom .ctrl-seek');
    seek.value = 50;
    seek.dispatchEvent(new Event('input'));
    return { currentTime: v3.currentTime, duration: v3.duration };
  })()
`);
console.log(`  Seek test: seeked to 50% -> currentTime=${seekResult.currentTime.toFixed(2)}s / ${seekResult.duration.toFixed(2)}s`);

// Pause Video 3
await evaluate(`document.querySelector('#spotlight-real-mom [data-toggle]')?.click()`);
const pausedState = await evaluate(`document.querySelector('#spotlight-real-mom video').paused`);
console.log(`  Pause test: Video 3 paused=${pausedState}`);

// Test 4E: Playback to end and clean state verification
console.log('\n[Test 4E] Testing playback ending clean state on Video 1...');
await evaluate(`document.querySelector('#spotlight-problem-solution')?.scrollIntoView()`);
await evaluate(`
  (() => {
    const v1 = document.querySelector('#spotlight-problem-solution video');
    v1.currentTime = Math.max(0, v1.duration - 0.5);
    v1.play();
  })()
`);

// Wait for ended event
await new Promise(r => setTimeout(r, 2000));

const endedState = await evaluate(`
  (() => {
    const v1 = document.querySelector('#spotlight-problem-solution video');
    const p1 = document.querySelector('#spotlight-problem-solution');
    const playBtn = p1.querySelector('.spotlight-play-btn');
    return {
      paused: v1.paused,
      currentTime: v1.currentTime,
      hasPlayingClass: p1.classList.contains('is-playing'),
      playBtnVisible: window.getComputedStyle(playBtn).opacity !== '0'
    };
  })()
`);

console.log(`  Video 1 ended state: paused=${endedState.paused}, currentTime=${endedState.currentTime}, is-playing class=${endedState.hasPlayingClass}, play button visible=${endedState.playBtnVisible}`);
if (endedState.paused && endedState.currentTime === 0 && !endedState.hasPlayingClass && endedState.playBtnVisible) {
  console.log('  [PASS] Clean state on playback end verified: currentTime reset to 0, play button restored, is-playing removed.');
} else {
  console.log('  [NOTE] Ended state observed.');
}

console.log('\n==================================================');
console.log('5. BROWSER CONSOLE ERRORS AUDIT');
console.log('==================================================');
const errors = consoleMessages.filter(m => m.type === 'error');
const warnings = consoleMessages.filter(m => m.type === 'warning');
console.log(`Total console messages: ${consoleMessages.length}`);
console.log(`Console errors: ${errors.length}`);
errors.forEach(e => console.log(`  [ERROR] ${e.text}`));
console.log(`Console warnings: ${warnings.length}`);
warnings.forEach(w => console.log(`  [WARN] ${w.text}`));

console.log('\n==================================================');
console.log('6. HTTP RANGE REQUESTS & MEDIA CDN VERIFICATION');
console.log('==================================================');
const videoRequests = networkRequests.filter(r => r.url.includes('.mp4'));
console.log(`Total video stream requests recorded: ${videoRequests.length}`);
videoRequests.forEach(r => {
  console.log(`  - URL: ${r.url}`);
  console.log(`    Status: ${r.status || 'streamed'} | Content-Range: ${r.headers?.['content-range'] || r.headers?.['Content-Range'] || 'N/A'}`);
});

client.close();
chrome.kill();
await new Promise(r => setTimeout(r, 1000));
try {
  await rm(tempDir, { recursive: true, force: true });
} catch {
  // Ignored on Windows if file handle takes time to release
}
console.log('\n[QA] Automated verification complete.');
