// Animated background: perspective grid "floor" + drifting particle network.
// Performance budget:
//  - capped at 30 fps and drawn at 1x pixel ratio (it is a blurred-looking backdrop anyway)
//  - at most ~45 particles, linked only to near neighbours
//  - animates only while the hero is on screen; elsewhere it keeps a still frame
//  - stops when the tab is hidden, and on low-end devices / reduced motion

export function startBackground(canvas) {
    const ctx = canvas.getContext('2d', { alpha: true });
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowEnd = (navigator.hardwareConcurrency || 8) <= 4 || matchMedia('(max-width: 560px)').matches;
    const FRAME_MS = 1000 / 30;
    const LINK = 120, LINK2 = LINK * LINK;

    let w = 0, h = 0, points = [], t = 0, raf = null, last = 0;
    let heroVisible = true;
    const mouse = { x: -9999, y: -9999 };

    function resize() {
        w = canvas.clientWidth; h = canvas.clientHeight;
        canvas.width = w; canvas.height = h;           // 1x DPR on purpose
        const count = Math.round(Math.min(lowEnd ? 24 : 45, (w * h) / 26000));
        points = Array.from({ length: count }, () => ({
            x: Math.random() * w, y: Math.random() * h * 0.7,
            vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.3 + 0.5,
        }));
        draw();
    }

    function grid() {
        const horizon = h * 0.62, cx = w / 2;
        ctx.strokeStyle = 'rgba(0,229,255,0.13)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const rows = 14, offset = (t * 0.006) % 1;
        for (let i = 0; i < rows; i++) {
            const y = horizon + Math.pow((i + offset) / rows, 2.2) * (h - horizon);
            ctx.moveTo(0, y); ctx.lineTo(w, y);
        }
        const cols = 18;
        for (let i = -cols; i <= cols; i++) {
            ctx.moveTo(cx + i * 10, horizon);
            ctx.lineTo(cx + i * (w / cols) * 1.6, h);
        }
        ctx.stroke();                                    // one stroke call for the whole grid
    }

    function network() {
        for (const p of points) {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h * 0.7) p.vy *= -1;
            const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
            if (d2 < 14400 && d2 > 0) { const d = Math.sqrt(d2); p.x += dx / d; p.y += dy / d; }
        }
        ctx.strokeStyle = 'rgba(0,229,255,0.09)';
        ctx.beginPath();
        for (let i = 0; i < points.length; i++) {
            const a = points[i];
            for (let j = i + 1; j < points.length; j++) {
                const b = points[j], dx = a.x - b.x, dy = a.y - b.y;
                if (dx * dx + dy * dy < LINK2) { ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); }
            }
        }
        ctx.stroke();
        ctx.fillStyle = 'rgba(150,230,255,0.75)';
        ctx.beginPath();
        for (const a of points) { ctx.moveTo(a.x + a.r, a.y); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); }
        ctx.fill();
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);
        grid();
        network();
    }

    function loop(now) {
        raf = requestAnimationFrame(loop);
        if (now - last < FRAME_MS) return;
        last = now;
        t++;
        draw();
    }

    const animate = () => !reduce && !lowEnd && heroVisible && !document.hidden;
    function sync() {
        if (animate() && !raf) { last = 0; raf = requestAnimationFrame(loop); }
        if (!animate() && raf) { cancelAnimationFrame(raf); raf = null; }
    }

    resize();
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
    window.addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    document.addEventListener('visibilitychange', sync);

    const hero = document.getElementById('home');
    if (hero && 'IntersectionObserver' in window) {
        new IntersectionObserver(([en]) => { heroVisible = en.isIntersecting; sync(); }, { threshold: 0.05 }).observe(hero);
    }
    sync();
}
