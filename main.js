// Spin The Traits — responsive animated SVG pie with history in cookies

// --- Data & Config ---------------------------------------------------------
// A large pool of traits (>500). Each spin will sample a small subset
// to keep the chart readable while the pool itself is rich.

const TRAIT_POOL = (() => {
  const base = [
    { key: 'sexy', label: 'Sexy', color: '#f472b6' },
    { key: 'shy', label: 'Shy', color: '#60a5fa' },
    { key: 'stupid', label: 'Stupid', color: '#f59e0b' },
    { key: 'side', label: 'Side Character', color: '#22c55e' },
    { key: 'mysterious', label: 'Mysterious', color: '#a78bfa' },
  ];

  const adjectives = [
    'Brave','Calm','Clever','Curious','Daring','Dreamy','Elegant','Eager','Fierce','Friendly','Gentle','Gloomy','Graceful','Happy','Honest','Humble','Kind','Lively','Loyal','Lucky','Nervy','Noble','Proud','Quiet','Quirky','Radiant','Rebel','Silly','Sly','Smarty','Snarky','Spicy','Steady','Swift','Tidy','Trendy','Vivid','Witty','Zany','Bold','Chill','Crafty','Dizzy','Feisty','Gritty','Jolly','Mellow','Mighty','Nifty','Peppy','Plucky','Spunky','Spry','Sunny','Tough','Whimsy','Wise','Zesty','Stoic','Artsy','Broody','Cheery','Crisp','Dapper','Dramatic','Earthy','Edgy','Flashy','Fuzzy','Geeky','Gleeful','Gutsy','Icy','Jaunty','Jazzy','Jumpy','Keen','Kooky','Leafy','Lunar','Lucky','Mirthful','Moody','Nifty','Nimble','Perky','Practical','Quaint','Rugged','Rustic','Shady','Shiny','Slick','Smug','Snug','Spirited','Stormy','Suave','Twinkly','Upbeat','Valiant','Zippy'
  ];
  const archetypes = [
    'Hero','Scholar','Trickster','Guardian','Sage','Wanderer','Artist','Leader','Healer','Outlaw','Mystic','Inventor','Poet','Scout','Jester','Strategist','Merchant','Seer','Knight','Rogue','Tactician','Explorer','Pilot','Chef','Druid','Bard','Monk','Captain','Detective','Engineer','Smith','Ranger','Alchemist','Magician','Diplomat','Caretaker','Gardener','Navigator','Professor','Athlete'
  ];

  const extras = [];
  let idx = 0;
  outer: for (let a = 0; a < adjectives.length; a++) {
    for (let b = 0; b < archetypes.length; b++) {
      const label = `${adjectives[a]} ${archetypes[b]}`;
      const key = `t${String(idx + 1).padStart(3, '0')}`;
      const hue = (idx * 137.508) % 360; // golden angle sweep for distinct colors
      const color = `hsl(${hue.toFixed(2)}, 70%, 60%)`;
      extras.push({ key, label, color });
      idx++;
      if (idx >= 500) break outer;
    }
  }
  return base.concat(extras);
})();

const HISTORY_COOKIE = 'spin_history_v1';
const HISTORY_LIMIT = 50;

// --- Utilities -------------------------------------------------------------
const $ = (id) => document.getElementById(id);
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

// Cookie helpers
function setCookie(name, value, days = 365) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

// Random integer inclusive
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// Ease function for spin
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

// --- SVG Helpers -----------------------------------------------------------
function polar(cx, cy, r, a) { return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
function arcPath(cx, cy, r, a0, a1) {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
}

// --- App State -------------------------------------------------------------
const state = {
  center: { x: 500, y: 500 }, // viewBox coordinates
  radius: 360,
  labelRadius: 420,
  current: null, // { slices: [{key, pct, start, end}], rotation }
  spinning: false,
  history: [],
};

// DOM references
const svg = $('chart');
const gSlices = $('slices');
const gLines = $('connectors');
const gLabels = $('labels');
const spinBtn = $('spinBtn');
const historyToggle = $('historyToggle');
const historyPanel = $('historyPanel');
const historyList = $('historyList');
const clearHistoryBtn = $('clearHistory');
const mainEl = document.querySelector('.main');

// --- Layout & Resize -------------------------------------------------------
function computeChartGeometry() {
  // Determine how much horizontal space is available for the chart
  const section = document.getElementById('chartSection');
  const rect = section.getBoundingClientRect();
  const size = Math.min(rect.width, rect.height - 40);
  const r = clamp(size * 0.36, 120, 420); // scale radius
  state.radius = r;
  state.labelRadius = r * 1.18;
  state.center.x = 500;
  state.center.y = 500;
}

function renderSlices(data, rotation = 0) {
  // data: [{ key, pct, start, end }], angles in radians
  const { x: cx, y: cy } = state.center;
  const r = state.radius;
  gSlices.innerHTML = '';
  for (const d of data) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const a0 = d.start + rotation;
    const a1 = d.end + rotation;
    path.setAttribute('d', arcPath(cx, cy, r, a0, a1));
    const trait = TRAIT_POOL.find(t => t.key === d.key);
    path.setAttribute('fill', trait?.color || '#888');
    path.setAttribute('fill-opacity', '0.92');
    path.dataset.key = d.key;
    gSlices.appendChild(path);
  }
}

function layoutLabels(data, rotation = 0) {
  const { x: cx, y: cy } = state.center;
  const rLabel = state.labelRadius;

  // Compute preliminary positions and split left/right
  const items = data.map(d => {
    const mid = (d.start + d.end) / 2 + rotation;
    const [ax, ay] = polar(cx, cy, rLabel, mid);
    const side = Math.cos(mid) >= 0 ? 'right' : 'left';
    return { ...d, mid, ax, ay, side };
  });

  const left = items.filter(i => i.side === 'left').sort((a, b) => a.ay - b.ay);
  const right = items.filter(i => i.side === 'right').sort((a, b) => a.ay - b.ay);

  // Vertical spacing to avoid overlaps
  const bounds = svg.viewBox.baseVal; // 1000 x 1000
  const topBound = 60;
  const bottomBound = bounds.height - 60;
  const minGap = 28; // minimum label spacing

  function distribute(rows) {
    for (let i = 1; i < rows.length; i++) {
      const prev = rows[i - 1];
      const cur = rows[i];
      if (cur.ay - prev.ay < minGap) {
        rows[i].ay = prev.ay + minGap;
      }
    }
    // Clamp to top/bottom then adjust upwards if overflow
    if (rows.length) {
      const overflowBottom = rows[rows.length - 1].ay - bottomBound;
      if (overflowBottom > 0) {
        for (let i = rows.length - 1; i >= 0; i--) rows[i].ay -= overflowBottom;
      }
      const overflowTop = topBound - rows[0].ay;
      if (overflowTop > 0) {
        for (let i = 0; i < rows.length; i++) rows[i].ay += overflowTop;
      }
    }
  }
  distribute(left);
  distribute(right);

  // Compute visible horizontal bounds in viewBox units, considering history drawer
  const svgRect = svg.getBoundingClientRect();
  let vbMinX = 30, vbMaxX = 970;
  if (historyPanel.getAttribute('aria-hidden') === 'false') {
    const histRect = historyPanel.getBoundingClientRect();
    const rightBoundary = Math.min(svgRect.right, histRect.left) - 8; // px
    const ratio = (rightBoundary - svgRect.left) / svgRect.width; // 0..1
    if (isFinite(ratio)) vbMaxX = clamp(1000 * ratio - 10, 200, 970);
  }

  // Draw connectors and labels
  gLines.innerHTML = '';
  gLabels.innerHTML = '';

  for (const arr of [left, right]) {
    for (const it of arr) {
      const outer = polar(cx, cy, state.radius, it.mid);
      const elbowX = it.side === 'right' ? it.ax + 16 : it.ax - 16;
      let labelX = it.side === 'right' ? elbowX + 16 : elbowX - 16;
      // Keep labels within dynamic bounds with padding
      labelX = clamp(labelX, vbMinX, vbMaxX);
      const elbowY = it.ay;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      path.setAttribute('fill', 'none');
      path.setAttribute('points', `${outer[0]},${outer[1]} ${elbowX},${elbowY} ${labelX},${elbowY}`);
      gLines.appendChild(path);

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      const trait = TRAIT_POOL.find(t => t.key === it.key);
      const label = `${trait?.label || it.key} ${Math.round(it.pct)}%`;
      text.textContent = label;
      text.setAttribute('x', String(labelX));
      text.setAttribute('y', String(elbowY - 4));
      const baseSize = clamp(18 + 0.02 * state.radius, 12, 24);
      text.setAttribute('font-size', baseSize);
      text.setAttribute('text-anchor', it.side === 'right' ? 'start' : 'end');
      gLabels.appendChild(text);

      // Ensure text fits horizontally between labelX and visible edge
      try {
        const bbox = text.getBBox();
        if (Number.isFinite(bbox.width) && bbox.width > 0) {
          const pxX = svgRect.left + (labelX / 1000) * svgRect.width;
          const leftEdge = it.side === 'right' ? pxX : pxX - bbox.width;
          const rightEdge = it.side === 'right' ? pxX + bbox.width : pxX;
          const limitRightPx = svgRect.left + (vbMaxX / 1000) * svgRect.width;
          const limitLeftPx = svgRect.left + (vbMinX / 1000) * svgRect.width;
          let scale = 1;
          if (rightEdge > limitRightPx - 6) {
            scale = Math.min(scale, (limitRightPx - 6 - (it.side === 'right' ? pxX : pxX - bbox.width)) / bbox.width);
          }
          if (leftEdge < limitLeftPx + 6) {
            scale = Math.min(scale, ((it.side === 'right' ? pxX + bbox.width : pxX) - (limitLeftPx + 6)) / bbox.width);
          }
          if (scale < 1 && scale > 0.5) {
            text.setAttribute('font-size', String(baseSize * scale));
          }
        }
      } catch {}
    }
  }
}

function render(data, rotation = 0) {
  computeChartGeometry();
  renderSlices(data, rotation);
  layoutLabels(data, rotation);
}

// --- Spin logic ------------------------------------------------------------
function randomDistribution(count) {
  // Generate N random weights that sum to 100
  const raw = Array.from({ length: count }, () => Math.random());
  const sum = raw.reduce((a, b) => a + b, 0);
  return raw.map(v => (v / sum) * 100);
}

function sampleTraitKeys(count) {
  const used = new Set();
  const keys = [];
  while (keys.length < count && used.size < TRAIT_POOL.length) {
    const idx = randInt(0, TRAIT_POOL.length - 1);
    const k = TRAIT_POOL[idx].key;
    if (!used.has(k)) { used.add(k); keys.push(k); }
  }
  return keys;
}

function buildSlices(pcts, keys) {
  let acc = -Math.PI / 2; // start at top
  return pcts.map((pct, i) => {
    const span = (pct / 100) * Math.PI * 2;
    const start = acc;
    const end = acc + span;
    acc = end;
    return { key: keys[i], pct, start, end };
  });
}

function buildSlicesFromValues(values) {
  // values: [{key, pct}] in desired order
  let acc = -Math.PI / 2;
  return values.map(v => {
    const span = (v.pct / 100) * Math.PI * 2;
    const start = acc;
    const end = acc + span;
    acc = end;
    return { key: v.key, pct: v.pct, start, end };
  });
}

function spin() {
  if (state.spinning) return;
  state.spinning = true;
  const count = randInt(5, 8); // keep a readable number of slices
  const keys = sampleTraitKeys(count);
  const pcts = randomDistribution(count);
  const slices = buildSlices(pcts, keys);
  const rotationTarget = (randInt(2, 6) + Math.random()) * Math.PI * 2; // several turns

  const startTime = performance.now();
  const duration = 1400; // ms
  function frame(now) {
    const t = clamp((now - startTime) / duration, 0, 1);
    const rot = easeOutCubic(t) * rotationTarget;
    render(slices, rot);
    if (t < 1) requestAnimationFrame(frame); else finish(slices, rot);
  }
  requestAnimationFrame(frame);

  function finish(finalSlices, rot) {
    state.current = { slices: finalSlices, rotation: rot % (Math.PI * 2) };
    state.spinning = false;
    addToHistory(finalSlices);
  }
}

// --- History (cookie) ------------------------------------------------------
function loadHistory() {
  try {
    const raw = getCookie(HISTORY_COOKIE);
    state.history = raw ? JSON.parse(raw) : [];
  } catch { state.history = []; }
  renderHistory();
}

function saveHistory() {
  try {
    const trimmed = state.history.slice(-HISTORY_LIMIT);
    setCookie(HISTORY_COOKIE, JSON.stringify(trimmed));
  } catch {}
}

function addToHistory(slices) {
  const entry = {
    at: Date.now(),
    values: slices.map(s => ({ key: s.key, pct: Math.round(s.pct) })),
  };
  state.history.push(entry);
  saveHistory();
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = '';
  const last = [...state.history].slice(-HISTORY_LIMIT).reverse();
  for (const item of last) {
    const li = document.createElement('li');
    li.className = 'history-item';

    const top = document.createElement('div');
    top.className = 'hist-row';
    const dt = new Date(item.at);
    top.textContent = dt.toLocaleString();
    li.appendChild(top);

    const pills = document.createElement('div');
    for (const v of item.values) {
      const t = TRAIT_POOL.find(t => t.key === v.key);
      const span = document.createElement('span');
      span.className = 'pill';
      span.style.background = t?.color ?? '#444';
      span.style.color = '#000';
      span.textContent = `${t?.label ?? v.key}: ${v.pct}%`;
      pills.appendChild(span);
    }
    li.appendChild(pills);

    // Clicking history re-renders chart to that state
    li.addEventListener('click', () => {
      const slices = buildSlicesFromValues(item.values);
      state.current = { slices, rotation: 0 };
      render(slices, 0);
    });

    historyList.appendChild(li);
  }
}

// --- Drawer toggle ---------------------------------------------------------
function setHistoryOpen(open) {
  historyPanel.setAttribute('aria-hidden', String(!open));
  historyToggle.setAttribute('aria-expanded', String(open));
  mainEl.classList.toggle('with-history-open', open);
  // Re-layout when the drawer is animating; do a couple frames
  const start = performance.now();
  const duration = 380;
  function tick(now) {
    const t = (now - start) / duration;
    if (t < 1) {
      if (state.current) render(state.current.slices, state.current.rotation);
      requestAnimationFrame(tick);
    } else if (state.current) {
      render(state.current.slices, state.current.rotation);
    }
  }
  requestAnimationFrame(tick);
}

// --- Event wiring ----------------------------------------------------------
spinBtn.addEventListener('click', spin);
historyToggle.addEventListener('click', () => setHistoryOpen(historyPanel.getAttribute('aria-hidden') === 'true'));
clearHistoryBtn.addEventListener('click', () => { state.history = []; saveHistory(); renderHistory(); });

window.addEventListener('resize', () => {
  if (state.current) render(state.current.slices, state.current.rotation);
});

// --- Init ------------------------------------------------------------------
loadHistory();

// First render with sampled data
const initCount = 6;
const initKeys = sampleTraitKeys(initCount);
const initial = buildSlices(randomDistribution(initCount), initKeys);
state.current = { slices: initial, rotation: 0 };
render(initial, 0);
