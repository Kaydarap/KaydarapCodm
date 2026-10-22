// Lightweight rising embers on a canvas. Off in low-fx, reading mode and
// reduced motion; paused while the tab is hidden.
export function startEmbers() {
  const canvas = document.querySelector('[data-embers]');
  if (!canvas) return;
  const html = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0;
  let parts = [];
  let w = 0;
  let h = 0;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const enabled = () => html.dataset.fx !== 'low' && html.dataset.reading !== 'on' && !reduced.matches;
  const count = () => (html.dataset.fx === 'full' ? 34 : 16);

  function size() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const spawn = (anywhere) => ({
    x: Math.random() * w,
    y: anywhere ? Math.random() * h : h + 10,
    r: Math.random() * 1.6 + 0.4,
    vy: Math.random() * 0.35 + 0.12,
    vx: (Math.random() - 0.5) * 0.18,
    a: Math.random() * 0.6 + 0.25,
    hue: Math.random() < 0.88 ? 350 : Math.random() < 0.5 ? 190 : 265,
  });

  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      p.y -= p.vy;
      p.x += p.vx + Math.sin(p.y / 60) * 0.12;
      if (p.y < -10) Object.assign(p, spawn(false));
      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${p.a * Math.min(1, p.y / h + 0.25)})`;
      ctx.shadowColor = `hsla(${p.hue}, 100%, 55%, .9)`;
      ctx.shadowBlur = 8;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  }

  function sync() {
    cancelAnimationFrame(raf);
    if (!enabled() || document.hidden) {
      ctx.clearRect(0, 0, w, h);
      return;
    }
    if (parts.length !== count()) parts = Array.from({ length: count() }, () => spawn(true));
    raf = requestAnimationFrame(frame);
  }

  size();
  window.addEventListener('resize', () => { size(); sync(); });
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener?.('change', sync);
  window.addEventListener('kd:prefs', sync);
  sync();
}
