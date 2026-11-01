// Animated background: perspective grid "floor" + drifting particle network
// that reacts to the pointer. Pauses when the tab is hidden; static frame when
// the visitor prefers reduced motion.

export function startBackground(canvas) {
    const ctx = canvas.getContext('2d');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w, h, dpr, points = [], t = 0, raf = null;
    const mouse = { x: -9999, y: -9999 };

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = canvas.clientWidth; h = canvas.clientHeight;
        canvas.width = w * dpr; canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const count = Math.round(Math.min(90, (w * h) / 18000));
        points = Array.from({ length: count }, () => ({
            x: Math.random() * w, y: Math.random() * h * 0.75,
            vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
            r: Math.random() * 1.4 + 0.4,
        }));
    }

    function grid() {
        const horizon = h * 0.62;
        const g = ctx.createLinearGradient(0, horizon, 0, h);
        g.addColorStop(0, 'rgba(0,229,255,0)');
        g.addColorStop(1, 'rgba(0,229,255,0.22)');
        ctx.strokeStyle = g;
        ctx.lineWidth = 1;
        // horizontal lines moving toward the viewer
        const rows = 18;
        for (let i = 0; i < rows; i++) {
            const p = ((i + (t * 0.004) % 1) / rows);
            const y = horizon + Math.pow(p, 2.2) * (h - horizon);
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }
        // vertical lines converging to the vanishing point
        const cx = w / 2, cols = 26;
        for (let i = -cols; i <= cols; i++) {
            ctx.beginPath();
            ctx.moveTo(cx + i * 8, horizon);
            ctx.lineTo(cx + i * (w / cols) * 1.6, h);
            ctx.stroke();
        }
        // horizon glow
        const hg = ctx.createRadialGradient(cx, horizon, 0, cx, horizon, w * 0.55);
        hg.addColorStop(0, 'rgba(139,92,255,0.16)');
        hg.addColorStop(1, 'rgba(139,92,255,0)');
        ctx.fillStyle = hg;
        ctx.fillRect(0, horizon - w * 0.3, w, w * 0.6);
    }

    function network() {
        for (const p of points) {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h * 0.75) p.vy *= -1;
            const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
            if (d < 140) { p.x += dx / d * 0.8; p.y += dy / d * 0.8; }
        }
        for (let i = 0; i < points.length; i++) {
            const a = points[i];
            for (let j = i + 1; j < points.length; j++) {
                const b = points[j];
                const d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d < 130) {
                    ctx.strokeStyle = `rgba(0,229,255,${0.12 * (1 - d / 130)})`;
                    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                }
            }
            ctx.fillStyle = i % 7 === 0 ? 'rgba(184,255,60,0.8)' : 'rgba(150,230,255,0.7)';
            ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
        }
    }

    function frame() {
        ctx.clearRect(0, 0, w, h);
        grid();
        network();
        t++;
        raf = reduce ? null : requestAnimationFrame(frame);
    }

    resize();
    frame();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    document.addEventListener('visibilitychange', () => {
        if (reduce) return;
        if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
        else if (!raf) frame();
    });
}
