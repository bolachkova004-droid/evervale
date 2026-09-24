/* Living portraits: every hero illustration is redrawn in WebGL as a 2.5D
   scene. A soft depth map (figure silhouette + light) lets the foreground
   shift against the background as the card tilts, while the hero breathes,
   catches light and gathers drifting motes in their own colour. Without
   WebGL the cards still tilt in 3D over the original CSS artwork. */
(() => {
  const ART = '.protagonist-art,.codex-art,.appearance-art,.campaign-art,.character-img,.intro-portrait,.caretaker-portrait,.irene-photo';
  const CARD = '.protagonist-card,.codex-card,.appearance-card,.campaign-visual,.character,.caretaker-portrait';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

  // Each hero glows in their own colour (linear RGB 0..1).
  const AURA = {
    elara: [0.55, 0.45, 1.0], female: [0.55, 0.45, 1.0],
    arden: [1.0, 0.42, 0.38], male: [1.0, 0.42, 0.38],
    irene: [0.78, 0.5, 1.0], silas: [1.0, 0.55, 0.3],
    morwen: [1.0, 0.8, 0.42], oren: [0.35, 1.0, 0.72],
    kael: [0.45, 0.72, 1.0], queen: [0.62, 0.9, 1.0],
    mara: [1.0, 0.7, 0.45]
  };
  const DEFAULT_AURA = [0.72, 0.55, 1.0];

  const targets = new Map();
  const pointer = { x: 0, y: 0, active: false, last: 0 };
  let gl = null, glCanvas = null, program = null, uni = {}, liveGL = true;
  const textures = new Map();

  /* ---------- CSS background parsing ---------- */
  function splitLayers(value) {
    const out = []; let depth = 0, cur = '';
    for (const ch of value) {
      if (ch === '(') depth++;
      if (ch === ')') depth--;
      if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; } else cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }
  function readArt(el) {
    const cs = getComputedStyle(el);
    const layers = splitLayers(cs.backgroundImage || '');
    let index = -1;
    layers.forEach((layer, i) => { if (/^url\(/.test(layer)) index = i; });
    if (index < 0) return null;
    const url = layers[index].replace(/^url\((['"]?)(.*)\1\)$/, '$2');
    const sizes = splitLayers(cs.backgroundSize || 'auto');
    const positions = splitLayers(cs.backgroundPosition || '50% 50%');
    const size = sizes[index % sizes.length] || 'cover';
    const pos = (positions[index % positions.length] || '50% 50%').split(/\s+/);
    const pct = v => (/%$/.test(v || '') ? parseFloat(v) / 100 : 0.5);
    return { url, contain: size === 'contain', focus: [pct(pos[0]), pct(pos[1])] };
  }
  function auraFor(el) {
    const cls = el.className + ' ' + (el.closest('.protagonist-card')?.className || '');
    const m = cls.match(/img-([a-z]+)/) || cls.match(/\b(female|male)\b/);
    if (m && AURA[m[1]]) return AURA[m[1]];
    if (el.matches('.caretaker-portrait')) return AURA.mara;
    if (el.matches('.character-img')) return AURA.silas;
    if (el.matches('.irene-photo')) return AURA.irene;
    return DEFAULT_AURA;
  }

  /* ---------- WebGL ---------- */
  const VERT = `attribute vec2 aPos;varying vec2 vP;
    void main(){vP=vec2(aPos.x*.5+.5,.5-aPos.y*.5);gl_Position=vec4(aPos,0.,1.);}`;
  const FRAG = `precision highp float;
    varying vec2 vP;
    uniform sampler2D uTex,uSmall;
    uniform vec2 uView,uImg,uFocus,uTilt;
    uniform float uContain,uTime,uHover,uSeed,uMotion;
    uniform vec3 uAura;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    vec2 fit(vec2 p,float contain,float zoom){
      vec2 r=uView/uImg;float s=(contain>.5?min(r.x,r.y):max(r.x,r.y))*zoom;
      vec2 d=uImg*s;return (p*uView-(uView-d)*uFocus)/d;}
    void main(){
      vec2 p=vP;
      float breathe=sin(uTime*1.25+uSeed)*.5+.5;
      vec2 t0=fit(p,uContain,uContain>.5?1.02:1.08);
      vec2 anchor=vec2(.5,1.);
      t0=anchor+(t0-anchor)*(1.-.007*breathe*uMotion);
      vec2 off=uTilt*(.022+.014*uHover);
      vec2 t=t0;
      for(int i=0;i<5;i++){float d=texture2D(uSmall,clamp(t,0.,1.)).a;t=t0-off*(d-.42);}
      vec4 small=texture2D(uSmall,clamp(t,0.,1.));
      vec2 edge=min(t,1.-t);
      float inside=smoothstep(-.002,.02,min(edge.x,edge.y));
      vec3 amb=texture2D(uSmall,clamp(fit(p,0.,1.25),0.,1.)).rgb*.72+uAura*.08;
      vec3 col=mix(amb,texture2D(uTex,clamp(t,0.,1.)).rgb,inside);
      // Twilight grade: open the shadows, richer colour, tinted by the hero.
      col=pow(max(col,0.),vec3(.93));
      float l=dot(col,vec3(.299,.587,.114));
      col=mix(vec3(l),col,1.15);
      col+=(1.-smoothstep(0.,.42,l))*uAura*.05;
      // A lantern of light that follows the viewer's hand.
      vec2 lp=vec2(.5,.32)+uTilt*vec2(.42,.3);
      float glow=exp(-dot(p-lp,p-lp)*6.);
      col+=uAura*glow*(.05+.14*uHover)*(.45+small.a);
      // Slow sheen sweeping across the figure.
      float sweep=fract(uTime*.06+uSeed*.37)*2.8-.6;
      float band=exp(-pow(p.x*.75+p.y*.55-sweep,2.)*120.);
      col+=vec3(1.,.93,.82)*band*.11*small.a*uMotion;
      // Drifting motes in the hero's colour.
      float motes=0.;
      for(int k=0;k<3;k++){
        float fk=float(k);
        vec2 q=p*vec2(6.+fk*3.,8.+fk*3.5);
        q.y+=uTime*(.22+.1*fk)*uMotion+uSeed*5.;
        q.x+=sin(q.y*.8+fk*2.)*.25;
        vec2 id=floor(q),f=fract(q)-.5;
        float h=hash(id+fk*17.3);
        vec2 c=(vec2(hash(id+3.1),hash(id+7.7))-.5)*.6;
        float tw=.55+.45*sin(uTime*(1.6+h*3.)+h*40.);
        motes+=step(.74,h)*smoothstep(.1,0.,length(f-c))*tw*(.55+.25*fk);
      }
      col+=mix(uAura,vec3(1.,.92,.7),.45)*motes*.45;
      float v=smoothstep(1.05,.35,length((p-.5)*vec2(1.,1.1)));
      col*=mix(.7,1.,v);
      gl_FragColor=vec4(col,1.);
    }`;

  function initGL() {
    try {
      glCanvas = document.createElement('canvas');
      gl = glCanvas.getContext('webgl', { preserveDrawingBuffer: true, antialias: false, premultipliedAlpha: false });
      if (!gl) throw new Error('no webgl');
      const compile = (type, src) => {
        const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
        return s;
      };
      program = gl.createProgram();
      gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
      gl.useProgram(program);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(program, 'aPos');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ['uTex', 'uSmall', 'uView', 'uImg', 'uFocus', 'uTilt', 'uContain', 'uTime', 'uHover', 'uSeed', 'uMotion', 'uAura']
        .forEach(n => { uni[n] = gl.getUniformLocation(program, n); });
      gl.uniform1i(uni.uTex, 0);
      gl.uniform1i(uni.uSmall, 1);
      glCanvas.addEventListener('webglcontextlost', e => { e.preventDefault(); disableGL(); });
    } catch (err) {
      gl = null; liveGL = false;
    }
  }
  function disableGL() {
    liveGL = false; gl = null;
    targets.forEach(t => { t.canvas?.remove(); t.canvas = null; t.el.classList.remove('ev-live'); });
  }
  function makeTexture(source) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    return tex;
  }

  /* A tiny blurred copy of the art: rgb = ambient colour, a = estimated depth.
     Depth favours the central figure and its lit face over the backdrop. */
  function buildSmall(img) {
    const W = 48, H = Math.max(24, Math.min(96, Math.round(48 * img.naturalHeight / img.naturalWidth)));
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, W, H);
    const data = ctx.getImageData(0, 0, W, H); // throws on tainted (file://) art
    const px = data.data, n = W * H;
    const blur = (src, ch, stride) => {
      const out = new Float32Array(n);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        let s = 0, k = 0;
        for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
          const xx = Math.min(W - 1, Math.max(0, x + dx)), yy = Math.min(H - 1, Math.max(0, y + dy));
          s += src[(yy * W + xx) * stride + ch]; k++;
        }
        out[y * W + x] = s / k;
      }
      return out;
    };
    const lum = new Float32Array(n);
    for (let i = 0; i < n; i++) lum[i] = (px[i * 4] * 0.299 + px[i * 4 + 1] * 0.587 + px[i * 4 + 2] * 0.114) / 255;
    const softLum = blur(blur(lum, 0, 1), 0, 1);
    const rgb = [0, 1, 2].map(ch => blur(blur(px, ch, 4), 0, 1));
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x, u = (x + 0.5) / W, v = (y + 0.5) / H;
      const body = Math.max(0, 1 - Math.hypot((u - 0.5) / 0.34, (v - 0.52) / 0.56));
      const head = Math.max(0, 1 - Math.hypot((u - 0.5) / 0.17, (v - 0.26) / 0.14));
      const mask = Math.min(1, body * 1.6);
      const d = Math.min(1, 0.58 * mask + 0.25 * head + 0.26 * softLum[i] * mask + 0.06 * softLum[i]);
      px[i * 4] = rgb[0][i]; px[i * 4 + 1] = rgb[1][i]; px[i * 4 + 2] = rgb[2][i]; px[i * 4 + 3] = d * 255;
    }
    return data;
  }

  function loadTexture(url) {
    if (textures.has(url)) return textures.get(url);
    const entry = { ready: false, failed: false, w: 1, h: 1, tex: null, small: null };
    textures.set(url, entry);
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      if (!gl) return;
      try {
        const small = buildSmall(img);
        entry.tex = makeTexture(img);
        entry.small = makeTexture(small);
        entry.w = img.naturalWidth; entry.h = img.naturalHeight; entry.ready = true;
        targets.forEach(t => { if (t.art?.url === url) t.dirty = true; });
      } catch (err) {
        entry.failed = true; // cross-origin or file:// art: keep the CSS artwork
      }
    };
    img.onerror = () => { entry.failed = true; };
    img.src = url;
    return entry;
  }

  /* ---------- targets ---------- */
  function register(el) {
    if (targets.has(el)) return;
    const card = el.closest(CARD) || el;
    const t = { el, card, canvas: null, ctx: null, art: null, visible: false, tilt: [0, 0], hover: 0, seed: Math.random() * 10, dirty: true, tick: 0 };
    targets.set(el, t);
    el.classList.add('ev-portrait');
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    if (!card.classList.contains('ev-tilt')) {
      card.classList.add('ev-tilt');
      const glare = document.createElement('span');
      glare.className = 'ev-glare'; glare.setAttribute('aria-hidden', 'true');
      card.append(glare);
      card.addEventListener('pointerenter', () => { card.dataset.evHover = '1'; });
      card.addEventListener('pointerleave', () => { delete card.dataset.evHover; card.style.removeProperty('--ev-rx'); card.style.removeProperty('--ev-ry'); });
      card.addEventListener('pointermove', e => {
        if (reduceMotion.matches) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        const max = r.height > 520 ? 5 : 9;
        card.style.setProperty('--ev-ry', ((x - 0.5) * 2 * max).toFixed(2) + 'deg');
        card.style.setProperty('--ev-rx', ((0.5 - y) * 2 * max).toFixed(2) + 'deg');
        card.style.setProperty('--ev-gx', (x * 100).toFixed(1) + '%');
        card.style.setProperty('--ev-gy', (y * 100).toFixed(1) + '%');
      });
    }
    observer.observe(el);
    classWatch.observe(el, { attributes: true, attributeFilter: ['class', 'style', 'hidden', 'data-seg'] });
  }
  function refreshArt(t) {
    const art = readArt(t.el);
    const same = art && t.art && art.url === t.art.url && art.contain === t.art.contain && art.focus[0] === t.art.focus[0] && art.focus[1] === t.art.focus[1];
    if (same) return;
    t.art = art; t.aura = auraFor(t.el); t.dirty = true;
    if (art && liveGL) loadTexture(art.url);
  }
  function ensureCanvas(t) {
    if (t.canvas) return;
    t.canvas = document.createElement('canvas');
    t.canvas.className = 'ev-canvas';
    t.canvas.setAttribute('aria-hidden', 'true');
    t.el.prepend(t.canvas);
    t.ctx = t.canvas.getContext('2d');
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { const t = targets.get(e.target); if (t) { t.visible = e.isIntersecting; if (t.visible) { refreshArt(t); t.dirty = true; } } });
  }, { rootMargin: '80px' });
  const classWatch = new MutationObserver(list => {
    list.forEach(m => { const t = targets.get(m.target); if (t) refreshArt(t); });
  });

  function scan() { document.querySelectorAll(ART).forEach(register); }

  /* ---------- render loop ---------- */
  function render(t, now) {
    const tex = t.art && textures.get(t.art.url);
    if (!liveGL || !tex || !tex.ready) return;
    const rect = t.el.getBoundingClientRect();
    if (rect.width < 8 || rect.height < 8) return;
    ensureCanvas(t);
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    let w = Math.round(rect.width * dpr), h = Math.round(rect.height * dpr);
    const scale = Math.min(1, Math.sqrt(900000 / (w * h)));
    w = Math.max(1, Math.round(w * scale)); h = Math.max(1, Math.round(h * scale));
    if (t.canvas.width !== w || t.canvas.height !== h) { t.canvas.width = w; t.canvas.height = h; }
    if (glCanvas.width < w || glCanvas.height < h) {
      glCanvas.width = Math.max(glCanvas.width, w); glCanvas.height = Math.max(glCanvas.height, h);
    }

    // Tilt target: the hovered card follows the hand; others drift gently.
    const motion = reduceMotion.matches ? 0 : 1;
    let tx = 0, ty = 0;
    const hovered = t.card.dataset.evHover === '1';
    if (motion) {
      const idle = now - pointer.last > 2500 || !pointer.active;
      if (hovered) {
        tx = (pointer.x - (rect.left + rect.width / 2)) / (rect.width / 2);
        ty = (pointer.y - (rect.top + rect.height / 2)) / (rect.height / 2);
      } else if (!idle) {
        tx = (pointer.x / innerWidth - 0.5) * 0.9;
        ty = (pointer.y / innerHeight - 0.5) * 0.9;
      }
      const sway = idle ? 0.55 : 0.2;
      tx += Math.sin(now / 2300 + t.seed) * sway;
      ty += Math.cos(now / 3100 + t.seed * 1.7) * sway * 0.6;
      tx = Math.max(-1.2, Math.min(1.2, tx)); ty = Math.max(-1.2, Math.min(1.2, ty));
    }
    t.tilt[0] += (tx - t.tilt[0]) * 0.08;
    t.tilt[1] += (ty - t.tilt[1]) * 0.08;
    t.hover += ((hovered ? 1 : 0) - t.hover) * 0.08;

    gl.viewport(0, 0, w, h);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex.tex);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, tex.small);
    gl.uniform2f(uni.uView, w, h);
    gl.uniform2f(uni.uImg, tex.w, tex.h);
    gl.uniform2f(uni.uFocus, t.art.focus[0], t.art.focus[1]);
    gl.uniform2f(uni.uTilt, t.tilt[0], t.tilt[1]);
    gl.uniform1f(uni.uContain, t.art.contain ? 1 : 0);
    gl.uniform1f(uni.uTime, motion ? now / 1000 : 0);
    gl.uniform1f(uni.uHover, t.hover);
    gl.uniform1f(uni.uSeed, t.seed);
    gl.uniform1f(uni.uMotion, motion);
    gl.uniform3fv(uni.uAura, t.aura || DEFAULT_AURA);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    t.ctx.drawImage(glCanvas, 0, glCanvas.height - h, w, h, 0, 0, w, h);
    if (!t.el.classList.contains('ev-live')) t.el.classList.add('ev-live');
    t.dirty = false;
  }

  function frame(now) {
    requestAnimationFrame(frame);
    if (!liveGL) return;
    const still = reduceMotion.matches;
    targets.forEach(t => {
      if (!t.visible || !t.el.isConnected || t.el.offsetParent === null) return;
      if (++t.tick % 45 === 0) refreshArt(t);
      if (still && !t.dirty) return;
      render(t, now);
    });
  }

  /* ---------- wiring ---------- */
  addEventListener('pointermove', e => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true; pointer.last = performance.now(); }, { passive: true });
  addEventListener('deviceorientation', e => {
    if (e.gamma == null || e.beta == null) return;
    pointer.x = innerWidth * (0.5 + Math.max(-1, Math.min(1, e.gamma / 35)) * 0.5);
    pointer.y = innerHeight * (0.5 + Math.max(-1, Math.min(1, (e.beta - 45) / 35)) * 0.5);
    pointer.active = true; pointer.last = performance.now();
  }, { passive: true });

  /* Aurora and fireflies drifting over every screen. */
  function buildSky() {
    const app = document.getElementById('app');
    if (!app || app.querySelector('.ev-sky')) return;
    const sky = document.createElement('div');
    sky.className = 'ev-sky'; sky.setAttribute('aria-hidden', 'true');
    const colours = ['#ffd27d', '#ff7eb3', '#5ee6d3', '#a98bff', '#7cc4ff', '#ffad5c'];
    for (let i = 0; i < 26; i++) {
      const f = document.createElement('i');
      f.style.left = (Math.random() * 100).toFixed(1) + '%';
      f.style.setProperty('--s', (2 + Math.random() * 4).toFixed(1) + 'px');
      f.style.setProperty('--c', colours[i % colours.length]);
      f.style.setProperty('--d', (12 + Math.random() * 16).toFixed(1) + 's');
      f.style.setProperty('--delay', (-Math.random() * 28).toFixed(1) + 's');
      f.style.setProperty('--x', ((Math.random() - 0.5) * 160).toFixed(0) + 'px');
      sky.append(f);
    }
    app.append(sky);
  }

  function start() {
    buildSky();
    initGL();
    scan();
    const engineGo = window.go;
    if (typeof engineGo === 'function') {
      window.go = id => { const r = engineGo(id); requestAnimationFrame(() => { scan(); targets.forEach(t => refreshArt(t)); }); return r; };
    }
    requestAnimationFrame(frame);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
