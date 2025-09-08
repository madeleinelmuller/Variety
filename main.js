// Spin The Traits — responsive animated SVG pie with history in cookies

// --- Data & Config ---------------------------------------------------------
// Large adjectives-only pool (>500). Sampling keeps charts readable.

const TRAIT_POOL = (() => {
  const ADJECTIVES = [
    'Adorable','Adventurous','Agile','Alert','Amazing','Ambitious','Amiable','Ample','Amusing','Angelic','Animated','Appreciative','Ardent','Artful','Artistic','Astonishing','Athletic','Attentive','Authentic','Aware','Awesome',
    'Balanced','Beautiful','Beloved','Best','Bewitching','Big','Blissful','Bold','Bouncy','Brave','Breezy','Bright','Brilliant','Brisk','Bubbly','Buoyant','Busy','Bustling','Buxom','Buzzing',
    'Calm','Capable','Carefree','Careful','Caring','Charming','Cheerful','Chic','Classic','Clean','Clear','Clever','Colorful','Comely','Comfortable','Compassionate','Confident','Cool','Courageous','Cozy','Creative','Crisp','Cuddly','Curious','Cute',
    'Dainty','Daring','Dashing','Dazzling','Decent','Decisive','Deep','Defiant','Delicate','Delightful','Dependable','Detailed','Determined','Devoted','Dignified','Diligent','Distinct','Divine','Dreamy','Dynamic',
    'Eager','Easy','Ebullient','Ecstatic','Educated','Effective','Efficient','Elegant','Electric','Eloquent','Eminent','Empathetic','Enchanting','Endearing','Endless','Energetic','Engaging','Enjoyable','Enlightened','Epic','Equable','Essential','Ethereal','Excellent','Excited','Exciting','Exotic','Expansive','Expert','Exquisite','Extraordinary','Exuberant',
    'Fair','Faithful','Fanciful','Fancy','Fantastic','Fast','Feisty','Felicitous','Fervent','Festive','Fierce','Fine','Flexible','Flourishing','Fluid','Focused','Fond','Forceful','Fortunate','Fragrant','Free','Fresh','Friendly','Fun','Funny','Futuristic',
    'Gallant','Generous','Genial','Gentle','Genuine','Gifted','Glad','Gleaming','Glorious','Glossy','Good','Gorgeous','Graceful','Gracious','Grand','Grateful','Great','Gregarious','Grounded','Growing',
    'Handsome','Happy','Hardy','Harmonious','Healthy','Hearty','Helpful','Heroic','Honest','Hopeful','Humble','Humorous','Hydrated','Hyper','Hypnotic',
    'Ideal','Imaginative','Immense','Immaculate','Impeccable','Important','Incisive','Incredible','Independent','Ingenious','Innovative','Insightful','Inspired','Intelligent','Intense','Interesting','Intrepid','Inviting','Iridescent','Irresistible',
    'Jaunty','Jazzy','Jocose','Jolly','Jovial','Joyful','Joyous','Juicy','Jumpy',
    'Keen','Kind','Kinetic','Knowing','Kosher',
    'Laudable','Lavish','Legendary','Legible','Light','Likable','Lithe','Lively','Logical','Lovable','Lovely','Loyal','Lucent','Lucid','Lucky','Luminous','Lush','Lustrous',
    'Magical','Magnanimous','Magnificent','Majestic','Mellow','Memorable','Merciful','Merry','Meticulous','Mighty','Mild','Mindful','Miraculous','Modern','Modest','Momentous','Neat','Nifty','Nimble','Noble','Notable','Noted','Novel','Nurturing','Nutritious',
    'Obedient','Objective','Observant','Open','Optimistic','Opulent','Orderly','Original','Outgoing','Outstanding',
    'Peaceful','Peachy','Peppy','Perfect','Perky','Persevering','Persistent','Phenomenal','Picturesque','Playful','Pleasing','Pleasant','Plucky','Polished','Popular','Positive','Powerful','Precious','Precise','Premier','Pretty','Priceless','Proactive','Productive','Proficient','Prolific','Prosperous','Proud','Prudent','Pumped','Pure',
    'Quaint','Qualified','Quick','Quick-witted','Quiet',
    'Radiant','Rapid','Rare','Rational','Ready','Real','Reassuring','Refined','Refreshing','Reliable','Remarkable','Resilient','Resolute','Resourceful','Respectful','Rested','Rich','Right','Robust','Romantic','Rosy','Rounded','Royal','Rugged','Ruling','Rustic',
    'Sacred','Sage','Sane','Sassy','Satisfying','Savvy','Secure','Sedate','Select','Selfless','Sensational','Sensible','Sensitive','Serene','Sharp','Shimmery','Shiny','Silent','Silky','Sincere','Skillful','Sleek','Slick','Slim','Smart','Smiling','Smooth','Snappy','Snazzy','Soft','Solar','Solid','Soothing','Sparkling','Special','Speedy','Spirited','Splendid','Spontaneous','Sporty','Spotless','Spry','Stable','Stately','Steadfast','Stellar','Sterling','Still','Straight','Striking','Strong','Stunning','Sturdy','Stylish','Suave','Sublime','Successful','Succinct','Sunny','Super','Superb','Supreme','Sure','Surgical','Surprising','Sweet','Swift',
    'Talented','Tame','Tasty','Teachable','Terrific','Thankful','Thorough','Thoughtful','Thrilled','Thrilling','Tidy','Timeless','Tough','Tranquil','Trendy','Triumphant','True','Trusting','Trustworthy','Truthful','Twinkling',
    'Uber','Ultimate','Ultra','Unbeaten','Unbiased','Uncommon','Undaunted','Understated','Undoubted','Unequaled','Unified','Unique','Unreal','Unrivaled','Upbeat','Upright','Upstanding','Useful','Utopian',
    'Valiant','Valid','Valuable','Vibrant','Victorious','Vigilant','Vigorous','Virtuous','Vital','Vivid','Vivacious','Vocal',
    'Warm','Wealthy','Welcome','Well','Whimsical','Whole','Wholesome','Wide','Willing','Winning','Wise','Witty','Wondrous','Worthy',
    'Youthful','Zany','Zesty','Zen','Zippy',
    // Colors & descriptive
    'Amber','Amethyst','Aqua','Aquamarine','Azure','Beige','Black','Blue','Bronze','Brown','Burgundy','Cerulean','Chartreuse','Chocolate','Cobalt','Copper','Coral','Crimson','Cyan','Emerald','Fuchsia','Gold','Golden','Gray','Green','Indigo','Ivory','Jade','Lavender','Lilac','Lime','Magenta','Maroon','Mauve','Navy','Olive','Orange','Peach','Pink','Platinum','Purple','Ruby','Saffron','Sapphire','Scarlet','Silver','Tan','Teal','Turquoise','Ultramarine','Violet','White','Yellow',
    // Nature/weather/texture
    'Airy','Balmy','Breezy','Cloudless','Cloudy','Dewy','Fluffy','Foggy','Freshened','Frosty','Gentle','Glassy','Glittering','Glossy','Grainy','Icy','Iridescent','Luminous','Matte','Misty','Pearly','Polished','Pristine','Rainy','Satiny','Shimmering','Shiny','Silken','Sleety','Snowy','Softened','Sparkly','Springy','Starry','Stormy','Sunny','Velvety','Windy',
    // Sizes/shape
    'Ample','Big','Broad','Bulky','Colossal','Compact','Curvy','Dainty','Enormous','Full','Giant','Gigantic','Grand','Huge','Immense','Jumbo','Little','Massive','Mini','Petite','Plump','Round','Slim','Small','Sizable','Tall','Tiny','Trim',
    // Taste/smell
    'Aromatic','Delectable','Flavorful','Fragrant','Savory','Spicy','Sugary','Sweet','Tangy','Toasty','Tasty','Umami','Zesty'
  ];
  // If < 500, extend by cycling unique variants with numeric keys but same labels.
  const out = [];
  const target = Math.max(ADJECTIVES.length, 520);
  for (let i = 0; i < target; i++) {
    const label = ADJECTIVES[i % ADJECTIVES.length];
    const key = `a${String(i + 1).padStart(3, '0')}`;
    const hue = (i * 137.508) % 360;
    const color = `hsl(${hue.toFixed(2)}, 70%, 60%)`;
    out.push({ key, label, color });
  }
  return out;
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
const gCenter = $('center');
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
    path.classList.add('slice');
    path.addEventListener('mouseenter', () => setHover(d.key, true));
    path.addEventListener('mouseleave', () => setHover(d.key, false));
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
      path.dataset.key = it.key;
      path.classList.add('connector');
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
      text.dataset.key = it.key;
      text.classList.add('label');
      text.addEventListener('mouseenter', () => setHover(it.key, true));
      text.addEventListener('mouseleave', () => setHover(it.key, false));
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
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = prefersReduced ? 400 : 1400; // ms
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
    showCenterLabel(finalSlices);
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

// Hover helpers to keep interactions consistent
function setHover(key, on) {
  document.querySelectorAll(`[data-key="${key}"]`).forEach(el => {
    if (on) el.classList.add('active'); else el.classList.remove('active');
  });
}

function showCenterLabel(slices) {
  const max = slices.reduce((a, b) => (a.pct > b.pct ? a : b));
  const trait = TRAIT_POOL.find(t => t.key === max.key);
  gCenter.innerHTML = '';
  const t1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  t1.setAttribute('x', '500');
  t1.setAttribute('y', '485');
  t1.setAttribute('class', 'big');
  t1.textContent = trait?.label || max.key;
  const t2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  t2.setAttribute('x', '500');
  t2.setAttribute('y', '515');
  t2.setAttribute('class', 'small');
  t2.textContent = `${Math.round(max.pct)}%`; 
  gCenter.appendChild(t1);
  gCenter.appendChild(t2);
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

// Keyboard shortcuts
window.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.code === 'Space') { e.preventDefault(); spin(); }
  if (e.key.toLowerCase() === 'h') { setHistoryOpen(historyPanel.getAttribute('aria-hidden') === 'true'); }
});

// --- Init ------------------------------------------------------------------
loadHistory();

// First render with sampled data
const initCount = 6;
const initKeys = sampleTraitKeys(initCount);
const initial = buildSlices(randomDistribution(initCount), initKeys);
state.current = { slices: initial, rotation: 0 };
render(initial, 0);
showCenterLabel(initial);
