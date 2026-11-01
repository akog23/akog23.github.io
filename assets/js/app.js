import { startBackground } from './bg.js';
import { getRepos, getReadme } from './github.js';

/* =========================================================================
   UI strings (content itself lives in data/content.json)
   ========================================================================= */
const UI = {
    pt: {
        online: 'SISTEMA ONLINE',
        'nav.home': 'Início', 'nav.about': 'Perfil', 'nav.experience': 'Experiência', 'nav.projects': 'Projetos',
        'nav.skills': 'Skills', 'nav.education': 'Formação', 'nav.contact': 'Contato',
        'hero.eyebrow': 'PORTFÓLIO // v2.0', 'hero.cta1': 'Ver projetos', 'hero.cta2': 'Abrir terminal', 'hero.scroll': 'ROLAR',
        'hud.status': 'STATUS', 'hud.location': 'LOCAL', 'hud.coords': 'COORD.', 'hud.stack': 'CORE', 'hud.edu': 'EDU',
        'about.title': 'Perfil', 'code.comment': 'rotina semanal — antes vs. depois',
        'exp.title': 'Experiência', 'proj.title': 'Projetos', 'skills.title': 'Skills', 'certs.title': '// CERTIFICAÇÕES',
        'edu.title': 'Formação', 'contact.title': 'Contato', 'footer.built': 'Feito à mão com HTML, CSS e JavaScript puro',
        current: 'ATUAL', featured: 'DESTAQUE', internal: 'interno', open: 'ABRIR', view: 'VER', updated: 'atualizado',
        cats: { all: 'Todos', backend: 'Back-end', web: 'Web', cloud: 'Cloud', automation: 'Automação', mobile: 'Mobile', game: 'Games' },
        ghOk: n => `// ${n} repositórios sincronizados ao vivo com github.com/`,
        ghFail: '// GitHub indisponível agora — exibindo dados locais. Veja em github.com/',
        progress: 'PROGRESSO DO CURSO', courses: 'Disciplinas em destaque', langs: 'Idiomas', hoursUnit: 'horas',
        readmeLoading: 'carregando README', readmeFail: 'Não foi possível carregar o README agora.', readmeShort: 'Este repositório tem um README curto — abra no GitHub para ver o código.',
        internalNote: 'Projeto interno: o código não é público.',
        copy: 'COPIADO', email: 'E-mail', linkedin: 'LinkedIn', github: 'GitHub',
        points: [
            ['Full-Stack', 'React · Spring Boot · APIs REST'],
            ['Automação', 'Python · Playwright · VBA'],
            ['Dados', 'SQL · PostgreSQL · troubleshooting'],
            ['IA Generativa', 'para acelerar entregas'],
        ],
        term: {
            welcome: 'IK//OS terminal v2.0 — digite <span class="hl">help</span> para ver os comandos.',
            help: [
                ['whoami', 'quem sou eu'], ['experience', 'experiência profissional'], ['projects', 'lista de projetos'],
                ['skills', 'stack técnica'], ['education', 'formação'], ['contact', 'como falar comigo'],
                ['open <projeto>', 'abre o README de um projeto'], ['github | linkedin | email', 'abre o link'],
                ['lang en', 'switch to English'], ['clear', 'limpa a tela'],
            ],
            notFound: c => `comando não encontrado: ${c}. Digite <span class="hl">help</span>.`,
            noProject: 'projeto não encontrado. Use <span class="hl">projects</span> para ver os nomes.',
            hire: 'Permissão concedida ✓ Envie um e-mail para <a href="mailto:{email}">{email}</a> e vamos conversar.',
            opening: 'abrindo',
        },
    },
    en: {
        online: 'SYSTEM ONLINE',
        'nav.home': 'Home', 'nav.about': 'Profile', 'nav.experience': 'Experience', 'nav.projects': 'Projects',
        'nav.skills': 'Skills', 'nav.education': 'Education', 'nav.contact': 'Contact',
        'hero.eyebrow': 'PORTFOLIO // v2.0', 'hero.cta1': 'View projects', 'hero.cta2': 'Open terminal', 'hero.scroll': 'SCROLL',
        'hud.status': 'STATUS', 'hud.location': 'LOCATION', 'hud.coords': 'COORDS', 'hud.stack': 'CORE', 'hud.edu': 'EDU',
        'about.title': 'Profile', 'code.comment': 'weekly routine — before vs. after',
        'exp.title': 'Experience', 'proj.title': 'Projects', 'skills.title': 'Skills', 'certs.title': '// CERTIFICATIONS',
        'edu.title': 'Education', 'contact.title': 'Contact', 'footer.built': 'Hand-built with plain HTML, CSS and JavaScript',
        current: 'CURRENT', featured: 'FEATURED', internal: 'internal', open: 'OPEN', view: 'VIEW', updated: 'updated',
        cats: { all: 'All', backend: 'Back-end', web: 'Web', cloud: 'Cloud', automation: 'Automation', mobile: 'Mobile', game: 'Games' },
        ghOk: n => `// ${n} repositories synced live from github.com/`,
        ghFail: '// GitHub is unavailable right now — showing local data. See github.com/',
        progress: 'DEGREE PROGRESS', courses: 'Highlighted courses', langs: 'Languages', hoursUnit: 'hours',
        readmeLoading: 'loading README', readmeFail: "Couldn't load the README right now.", readmeShort: 'This repository has a short README — open it on GitHub to browse the code.',
        internalNote: 'Internal project: the code is not public.',
        copy: 'COPIED', email: 'Email', linkedin: 'LinkedIn', github: 'GitHub',
        points: [
            ['Full-Stack', 'React · Spring Boot · REST APIs'],
            ['Automation', 'Python · Playwright · VBA'],
            ['Data', 'SQL · PostgreSQL · troubleshooting'],
            ['Generative AI', 'to ship faster'],
        ],
        term: {
            welcome: 'IK//OS terminal v2.0 — type <span class="hl">help</span> to list commands.',
            help: [
                ['whoami', 'who I am'], ['experience', 'work history'], ['projects', 'project list'],
                ['skills', 'tech stack'], ['education', 'education'], ['contact', 'how to reach me'],
                ['open <project>', "opens a project's README"], ['github | linkedin | email', 'opens the link'],
                ['lang pt', 'mudar para português'], ['clear', 'clear the screen'],
            ],
            notFound: c => `command not found: ${c}. Type <span class="hl">help</span>.`,
            noProject: 'project not found. Use <span class="hl">projects</span> to list names.',
            hire: 'Permission granted ✓ Email <a href="mailto:{email}">{email}</a> and let\'s talk.',
            opening: 'opening',
        },
    },
};

const ICON = {
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12.02c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.56 9.56 0 0112 6.84c.85 0 1.71.12 2.5.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10.02 10.02 0 0022 12.02C22 6.48 17.52 2 12 2z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM8 19H5V8h3v11zM6.5 6.73a1.76 1.76 0 110-3.53 1.76 1.76 0 010 3.53zM20 19h-3v-5.6c0-3.37-4-3.12-4 0V19h-3V8h3v1.77c1.4-2.59 7-2.78 7 2.47V19z"/></svg>',
    email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 5.5A2.5 2.5 0 014.5 3h15A2.5 2.5 0 0122 5.5v13a2.5 2.5 0 01-2.5 2.5h-15A2.5 2.5 0 012 18.5v-13zM4.3 5L12 11.2 19.7 5H4.3zM20 6.8l-7.4 6a1 1 0 01-1.2 0L4 6.8v11.7c0 .3.2.5.5.5h15c.3 0 .5-.2.5-.5V6.8z"/></svg>',
};

/* =========================================================================
   State & helpers
   ========================================================================= */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;

let DATA = null;
let LANG = 'pt';
let REPOS = null;      // GitHub data (null until loaded / on failure)
let GH_FAILED = false;
let FILTER = 'all';

const L = v => (v && typeof v === 'object' && !Array.isArray(v) && ('pt' in v || 'en' in v)) ? (v[LANG] ?? v.pt) : v;
const T = key => UI[LANG][key] ?? key;

function initialLang() {
    try {
        const saved = localStorage.getItem('lang');
        if (saved === 'pt' || saved === 'en') return saved;
    } catch { /* storage blocked */ }
    return (navigator.language || 'pt').toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

/* =========================================================================
   Boot
   ========================================================================= */
async function boot() {
    const el = $('#boot');
    let seen = false;
    try { seen = sessionStorage.getItem('booted') === '1'; } catch { /* ignore */ }
    if (REDUCE || seen) { el.classList.add('done'); return; }

    const lines = [
        'loading kernel ............ <span class="ok">ok</span>',
        'mounting /projects ........ <span class="ok">ok</span>',
        'linking github://akog777 .. <span class="ok">ok</span>',
        'calibrating HUD ........... <span class="ok">ok</span>',
        '<span class="ok">welcome, visitor.</span>',
    ];
    const log = $('#boot-log'), bar = $('.boot-bar i');
    for (let i = 0; i < lines.length; i++) {
        log.innerHTML += lines[i] + '\n';
        bar.style.width = `${((i + 1) / lines.length) * 100}%`;
        await new Promise(r => setTimeout(r, 190));
    }
    await new Promise(r => setTimeout(r, 250));
    el.classList.add('done');
    try { sessionStorage.setItem('booted', '1'); } catch { /* ignore */ }
}

/* =========================================================================
   Render
   ========================================================================= */
function applyStatic() {
    document.documentElement.lang = LANG === 'pt' ? 'pt-BR' : 'en';
    $$('[data-i18n]').forEach(el => { el.textContent = T(el.dataset.i18n); });
    $('#lang-btn').textContent = LANG === 'pt' ? 'EN' : 'PT';
    $('#lang-btn').setAttribute('aria-label', LANG === 'pt' ? 'Switch to English' : 'Mudar para português');
}

function socialList() {
    const p = DATA.profile;
    return [
        { key: 'github', label: T('github'), value: `github.com/${p.github}`, href: `https://github.com/${p.github}` },
        { key: 'linkedin', label: T('linkedin'), value: p.linkedin.replace(/^https?:\/\/(www\.)?/, ''), href: p.linkedin },
        { key: 'email', label: T('email'), value: p.email, href: `mailto:${p.email}` },
    ];
}

function renderHero() {
    const p = DATA.profile;
    $('#hero-summary').textContent = L(p.tagline || p.summary);
    $('#hud-status').textContent = L(p.status);
    $('#hud-location').textContent = p.location;
    $('#hud-coords').textContent = p.coords;
    $('#hud-socials').innerHTML = socialList().map(s => `
        <a class="icon-btn" href="${esc(s.href)}" ${s.key !== 'email' ? 'target="_blank" rel="noopener noreferrer"' : ''} aria-label="${esc(s.label)}">${ICON[s.key]}</a>`).join('');

    // ring ticks (built once)
    const g = $('.hud-ring .ticks');
    if (g && !g.childElementCount) {
        let html = '';
        for (let i = 0; i < 60; i++) {
            const a = (i / 60) * Math.PI * 2, r1 = 98, r2 = i % 5 ? 101 : 106;
            html += `<line x1="${100 + Math.cos(a) * r1}" y1="${100 + Math.sin(a) * r1}" x2="${100 + Math.cos(a) * r2}" y2="${100 + Math.sin(a) * r2}"/>`;
        }
        g.innerHTML = html;
    }
}

function renderMetrics() {
    $('#metrics').innerHTML = DATA.metrics.map(m => {
        const value = m.id === 'repos' ? (REPOS ? REPOS.filter(r => !r.fork).length : m.fallback) : m.value;
        return `
        <div class="metric reveal" data-count="${value}">
            <div class="metric-value">${m.prefix ? `<span class="p">${esc(m.prefix)}</span>` : ''}<span class="num">${REDUCE ? value : 0}</span>${m.suffix ? `<span class="u">${esc(m.suffix)}</span>` : ''}</div>
            <div class="metric-label">${esc(L(m.label))}</div>
        </div>`;
    }).join('');
}

function renderAbout() {
    $('#about-summary').textContent = L(DATA.profile.summary);
    $('#about-points').innerHTML = T('points').map(([a, b]) => `
        <li><span class="ico">▹</span><span><b>${esc(a)}</b>${esc(b)}</span></li>`).join('');
}

function renderExperience() {
    $('#timeline').innerHTML = DATA.experience.map(j => `
        <article class="job reveal ${j.current ? 'current' : ''}">
            <span class="job-node" aria-hidden="true"></span>
            <div class="panel">
                <span class="panel-label mono">${esc(L(j.type))}</span>
                <div class="job-top">
                    <h3 class="job-company">${esc(j.company)}</h3>
                    <span class="job-period mono">${esc(L(j.period))}</span>
                </div>
                <p class="job-role">${esc(L(j.role))} ${j.current ? `<span class="badge live">${T('current')}</span>` : ''}</p>
                <ul>${L(j.bullets).map(b => `<li>${esc(b)}</li>`).join('')}</ul>
                <div class="tags">${j.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
            </div>
        </article>`).join('');
}

function projectList() {
    return DATA.projects.map(p => {
        const gh = REPOS?.find(r => r.name === p.repo);
        return { ...p, gh };
    });
}

function renderFilters() {
    const cats = T('cats');
    const counts = { all: DATA.projects.length };
    DATA.projects.forEach(p => { counts[p.cat] = (counts[p.cat] || 0) + 1; });
    $('#filters').innerHTML = Object.keys(cats).filter(c => counts[c]).map(c => `
        <button class="filter" role="tab" data-cat="${c}" aria-selected="${c === FILTER}">${esc(cats[c])}<span class="n">${counts[c]}</span></button>`).join('');
}

function renderProjects() {
    const cats = T('cats');
    $('#projects-grid').innerHTML = projectList().map((p, i) => {
        const date = p.gh?.pushed ? new Date(p.gh.pushed).toLocaleDateString(LANG === 'pt' ? 'pt-BR' : 'en-US', { month: 'short', year: 'numeric' }) : null;
        const foot = p.internal
            ? `<span>🔒 ${T('internal')}</span><span class="go">${T('view')} →</span>`
            : `<span>${p.repo ? (date ? `${T('updated')} ${esc(date)}` : `github/${esc(p.repo)}`) : esc((p.url || '').replace('https://', ''))}</span><span class="go">${T('open')} →</span>`;
        return `
        <button class="proj reveal ${FILTER !== 'all' && p.cat !== FILTER ? 'hide' : ''}" data-idx="${i}" data-cat="${p.cat}">
            <div class="panel">
                <div class="proj-top">
                    <span class="proj-cat">${esc(cats[p.cat] || p.cat)}</span>
                    ${p.featured ? `<span class="proj-star">★ ${T('featured')}</span>` : ''}
                </div>
                <h3>${esc(L(p.title))}</h3>
                <p>${esc(L(p.desc))}</p>
                <div class="tags">${p.stack.map(s => `<span class="tag">${esc(s)}</span>`).join('')}</div>
                <div class="proj-foot">${foot}</div>
            </div>
        </button>`;
    }).join('');

    const note = $('#gh-note');
    const user = DATA.profile.github;
    note.innerHTML = REPOS
        ? `${esc(T('ghOk')(REPOS.filter(r => !r.fork).length))}<a href="https://github.com/${user}" target="_blank" rel="noopener noreferrer">${user}</a>`
        : GH_FAILED ? `${esc(T('ghFail'))}<a href="https://github.com/${user}" target="_blank" rel="noopener noreferrer">${user}</a>` : '';
    bindTilt();
}

function renderSkills() {
    $('#skills-grid').innerHTML = DATA.skills.map((s, i) => `
        <div class="panel skill-mod reveal">
            <h3><span class="n">0${i + 1}</span>${esc(L(s.title))}</h3>
            <div class="skill-list">${s.items.map(it => `<span class="skill">${esc(it)}</span>`).join('')}</div>
        </div>`).join('');
    $('#certs').innerHTML = DATA.certifications.map(c => `
        <div class="cert reveal">
            <span class="cert-issuer">${esc(c.issuer)}</span>
            <span class="cert-title">${esc(L(c.title))}</span>
            <span class="cert-hours"><b>${c.hours}</b> ${T('hoursUnit')}</span>
        </div>`).join('');
}

function renderEducation() {
    const e = DATA.education;
    const start = new Date(`${e.start}T12:00:00`), end = new Date(`${e.end}T12:00:00`), now = new Date();
    const pct = Math.max(0, Math.min(100, ((now - start) / (end - start)) * 100));
    $('#edu').innerHTML = `
        <div class="panel reveal">
            <span class="panel-label mono">B.Sc.</span>
            <span class="small-label">${start.getFullYear()} — ${end.getFullYear()}</span>
            <h3 class="edu-inst">${esc(e.institution)}</h3>
            <p class="edu-degree mono">${esc(L(e.degree))}</p>
            <div class="progress-top"><span>${T('progress')}</span><b>${pct.toFixed(0)}%</b></div>
            <div class="bar"><i data-w="${pct}"></i></div>
            <div class="bar-ends"><span>${start.toLocaleDateString(LANG === 'pt' ? 'pt-BR' : 'en-US', { month: 'short', year: 'numeric' })}</span><span>${end.toLocaleDateString(LANG === 'pt' ? 'pt-BR' : 'en-US', { month: 'short', year: 'numeric' })}</span></div>
            <div class="edu-courses">
                <span class="small-label">${T('courses')}</span>
                <div class="tags">${e.courses.map(c => `<span class="tag">${esc(c)}</span>`).join('')}</div>
            </div>
        </div>
        <div class="panel reveal">
            <span class="panel-label mono">i18n</span>
            <span class="small-label">${T('langs')}</span>
            <div style="margin-top:18px">
                ${e.languages.map(l => `
                <div class="lang-row">
                    <div class="lang-top"><b>${esc(L(l.name))}</b><span>${esc(L(l.level))}</span></div>
                    <div class="bar"><i data-w="${l.pct}"></i></div>
                </div>`).join('')}
            </div>
        </div>`;
}

function renderContact() {
    $('#contact-cards').innerHTML = socialList().map(s => `
        <a class="c-card" href="${esc(s.href)}" ${s.key !== 'email' ? 'target="_blank" rel="noopener noreferrer"' : ''} data-key="${s.key}" data-copied="${T('copy')}">
            ${ICON[s.key]}
            <span><small>${esc(s.label)}</small><strong>${esc(s.value)}</strong></span>
            <span class="arrow">↗</span>
        </a>`).join('');
    $('#term-hints').innerHTML = ['help', 'whoami', 'projects', 'open mackestagios', 'contact']
        .map(c => `<button type="button" data-cmd="${c}">${c}</button>`).join('');
}

function renderAll() {
    applyStatic();
    renderHero();
    renderMetrics();
    renderAbout();
    renderExperience();
    renderFilters();
    renderProjects();
    renderSkills();
    renderEducation();
    renderContact();
    observeReveal();
}

/* =========================================================================
   Effects: reveal, counters, bars, typed text, clock, tilt, glitch
   ========================================================================= */
let revealObs;
function observeReveal() {
    if (!revealObs) {
        revealObs = new IntersectionObserver(entries => {
            entries.forEach(en => {
                if (!en.isIntersecting) return;
                const el = en.target;
                el.classList.add('in');
                if (el.dataset.count !== undefined) countUp(el);
                $$('.bar i', el).forEach(b => { b.style.width = `${b.dataset.w}%`; });
                revealObs.unobserve(el);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    }
    $$('.reveal:not(.in)').forEach((el, i) => {
        el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
        revealObs.observe(el);
    });
    // elements already revealed (after a language switch) keep their final state
    $$('.reveal.in .bar i, .in.reveal .bar i').forEach(b => { b.style.width = `${b.dataset.w}%`; });
}

function countUp(el) {
    const target = Number(el.dataset.count), num = $('.num', el);
    if (REDUCE || !num) { if (num) num.textContent = target; return; }
    const t0 = performance.now(), dur = 1400;
    const step = now => {
        const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        num.textContent = Math.round(target * e);
        if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

let typedTimer;
function startTyped() {
    clearTimeout(typedTimer);
    const el = $('#typed');
    const roles = L(DATA.profile.roles);
    if (REDUCE) { el.textContent = roles[0]; return; }
    let r = 0, c = 0, del = false;
    const tick = () => {
        const word = roles[r];
        el.textContent = word.slice(0, c);
        if (!del && c < word.length) { c++; typedTimer = setTimeout(tick, 55); }
        else if (!del) { del = true; typedTimer = setTimeout(tick, 1700); }
        else if (c > 0) { c--; typedTimer = setTimeout(tick, 28); }
        else { del = false; r = (r + 1) % roles.length; typedTimer = setTimeout(tick, 300); }
    };
    tick();
}

function startClock() {
    const el = $('#clock');
    const fmt = new Intl.DateTimeFormat('pt-BR', { timeZone: DATA.profile.timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const tick = () => { el.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 1000);
}

function bindTilt() {
    if (REDUCE || !matchMedia('(hover: hover)').matches) return;
    $$('.proj').forEach(card => {
        card.addEventListener('pointermove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
            card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 8}deg) translateY(-4px)`;
            card.style.setProperty('--mx', `${x * 100}%`);
            card.style.setProperty('--my', `${y * 100}%`);
        });
        card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
}

function glitchLoop() {
    if (REDUCE) return;
    setInterval(() => {
        const g = $$('.glitch');
        const el = g[Math.floor(Math.random() * g.length)];
        el.classList.add('zap');
        setTimeout(() => el.classList.remove('zap'), 900);
    }, 5200);
}

/* =========================================================================
   Navigation
   ========================================================================= */
function bindNav() {
    const nav = $('#sidenav'), btn = $('#menu-btn');
    const close = () => { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
    });
    $$('a', nav).forEach(a => a.addEventListener('click', close));

    const links = $$('[data-nav]');
    const obs = new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (en.isIntersecting) links.forEach(l => l.classList.toggle('active', l.dataset.nav === en.target.id));
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main > section').forEach(s => obs.observe(s));

    $('#lang-btn').addEventListener('click', () => setLang(LANG === 'pt' ? 'en' : 'pt'));

    if (matchMedia('(hover: hover)').matches) {
        const glow = $('.cursor-glow');
        document.body.classList.add('has-pointer');
        window.addEventListener('pointermove', e => { glow.style.transform = `translate(${e.clientX - 260}px, ${e.clientY - 260}px)`; }, { passive: true });
    }
}

function setLang(lang) {
    LANG = lang;
    try { localStorage.setItem('lang', lang); } catch { /* ignore */ }
    renderAll();
    startTyped();
    termPrint(`<span class="ok">lang → ${lang}</span>`);
}

/* =========================================================================
   Projects: filters + modal
   ========================================================================= */
function bindProjects() {
    $('#filters').addEventListener('click', e => {
        const b = e.target.closest('.filter');
        if (!b) return;
        FILTER = b.dataset.cat;
        $$('.filter').forEach(f => f.setAttribute('aria-selected', String(f === b)));
        $$('.proj').forEach(p => p.classList.toggle('hide', FILTER !== 'all' && p.dataset.cat !== FILTER));
    });
    $('#projects-grid').addEventListener('click', e => {
        const card = e.target.closest('.proj');
        if (card) openProject(DATA.projects[Number(card.dataset.idx)]);
    });
    $('#modal').addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#modal').hidden) closeModal(); });
}

let lastFocus = null;
async function openProject(p) {
    lastFocus = document.activeElement;
    const user = DATA.profile.github;
    const link = p.repo ? `https://github.com/${user}/${p.repo}` : p.url;
    $('#modal-title').textContent = L(p.title);
    $('#modal-path').textContent = p.repo ? `~/github/${user}/${p.repo}` : (p.internal ? '~/internal' : `~/${(p.url || '').replace('https://', '')}`);
    const gh = $('#modal-gh');
    gh.hidden = !link;
    if (link) gh.href = link;

    const body = $('#modal-body');
    body.innerHTML = `
        <div class="modal-meta">${p.stack.map(s => `<span class="tag">${esc(s)}</span>`).join('')}</div>
        <p class="modal-desc">${esc(L(p.desc))}</p>
        <div class="readme" id="readme">${p.repo ? `<p class="loader-line">${T('readmeLoading')}</p>` : `<p class="dim">${p.internal ? T('internalNote') : ''}</p>`}</div>`;

    $('#modal').hidden = false;
    document.body.classList.add('locked');
    $('.modal-box [data-close]').focus();

    if (!p.repo) return;
    const target = $('#readme');
    try {
        const md = await getReadme(user, p.repo);
        if (!window.marked || !window.DOMPurify) throw new Error('markdown libs not loaded');
        target.innerHTML = window.DOMPurify.sanitize(window.marked.parse(md));
        const rel = u => u && !/^(https?:|mailto:|#|data:|\/\/)/i.test(u);
        $$('img', target).forEach(img => { const s = img.getAttribute('src'); if (rel(s)) img.src = `https://raw.githubusercontent.com/${user}/${p.repo}/HEAD/${s.replace(/^\.?\//, '')}`; });
        $$('a', target).forEach(a => {
            const h = a.getAttribute('href');
            if (rel(h)) a.href = `${link}/blob/HEAD/${h.replace(/^\.?\//, '')}`;
            if (!h?.startsWith('#')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
        });
        if (md.trim().length < 120) target.insertAdjacentHTML('beforeend', `<p class="dim">${T('readmeShort')}</p>`);
    } catch (err) {
        console.warn(err);
        target.innerHTML = `<p class="dim">${T('readmeFail')} <a href="${esc(link)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a></p>`;
    }
}

function closeModal() {
    $('#modal').hidden = true;
    document.body.classList.remove('locked');
    lastFocus?.focus();
}

/* =========================================================================
   Contact: copy email + terminal
   ========================================================================= */
function bindContact() {
    $('#contact-cards').addEventListener('click', async e => {
        const card = e.target.closest('.c-card[data-key="email"]');
        if (!card) return;
        try {
            await navigator.clipboard.writeText(DATA.profile.email);
            card.classList.add('copied');
            setTimeout(() => card.classList.remove('copied'), 1600);
        } catch { /* clipboard blocked: mailto still opens */ }
    });

    const form = $('#term-form'), input = $('#term-in');
    const history = []; let hIdx = 0;
    form.addEventListener('submit', e => {
        e.preventDefault();
        const cmd = input.value.trim();
        if (!cmd) return;
        history.push(cmd); hIdx = history.length;
        input.value = '';
        runCmd(cmd);
    });
    input.addEventListener('keydown', e => {
        if (e.key === 'ArrowUp' && hIdx > 0) { input.value = history[--hIdx]; e.preventDefault(); }
        if (e.key === 'ArrowDown') { hIdx = Math.min(history.length, hIdx + 1); input.value = history[hIdx] || ''; }
    });
    $('#term-hints').addEventListener('click', e => {
        const b = e.target.closest('[data-cmd]');
        if (b) { runCmd(b.dataset.cmd); input.focus({ preventScroll: true }); }
    });
    $('#terminal').addEventListener('click', e => { if (!e.target.closest('a,button')) input.focus({ preventScroll: true }); });
    termPrint(UI[LANG].term.welcome);
}

function termPrint(html) {
    const out = $('#term-out');
    out.insertAdjacentHTML('beforeend', `<div>${html}</div>`);
    out.scrollTop = out.scrollHeight;
}

function runCmd(raw) {
    const t = UI[LANG].term;
    const p = DATA.profile;
    termPrint(`<span class="cmd">${esc(raw)}</span>`);
    const [cmd, ...args] = raw.toLowerCase().split(/\s+/);
    const arg = args.join(' ');
    const pad = s => s.padEnd(26, ' ').replace(/ /g, '&nbsp;');

    switch (cmd) {
        case 'help':
            t.help.forEach(([c, d]) => termPrint(`<span class="hl">${pad(esc(c))}</span>${esc(d)}`));
            break;
        case 'whoami':
            termPrint(`<span class="hl">${esc(p.name)}</span> — ${esc(L(p.roles)[0])} · ${esc(p.location)}`);
            termPrint(esc(L(p.summary)));
            break;
        case 'experience': case 'exp':
            DATA.experience.forEach(j => termPrint(`<span class="hl">${esc(L(j.period))}</span> · ${esc(j.company)} — ${esc(L(j.role))}`));
            break;
        case 'projects': case 'ls':
            DATA.projects.forEach(pr => termPrint(`<span class="hl">${pad(esc(pr.repo || L(pr.title)))}</span>${esc(pr.stack.join(', '))}`));
            break;
        case 'skills':
            DATA.skills.forEach(s => termPrint(`<span class="hl">${esc(L(s.title))}:</span> ${esc(s.items.join(', '))}`));
            break;
        case 'education': case 'edu':
            termPrint(`${esc(DATA.education.institution)} — ${esc(L(DATA.education.degree))}`);
            break;
        case 'contact':
            socialList().forEach(s => termPrint(`<span class="hl">${pad(esc(s.label))}</span><a href="${esc(s.href)}" target="_blank" rel="noopener noreferrer">${esc(s.value)}</a>`));
            break;
        case 'github': case 'linkedin': case 'email': {
            const s = socialList().find(x => x.key === cmd);
            termPrint(`${t.opening} ${esc(s.value)} ...`);
            window.open(s.href, cmd === 'email' ? '_self' : '_blank', 'noopener');
            break;
        }
        case 'open': case 'cat': {
            const pr = DATA.projects.find(x => (x.repo || '').toLowerCase() === arg || String(L(x.title)).toLowerCase() === arg)
                || DATA.projects.find(x => arg && ((x.repo || '').toLowerCase().includes(arg) || String(L(x.title)).toLowerCase().includes(arg)));
            if (pr) { termPrint(`${t.opening} ${esc(L(pr.title))} ...`); openProject(pr); }
            else termPrint(`<span class="err">${t.noProject}</span>`);
            break;
        }
        case 'lang':
            if (arg === 'pt' || arg === 'en') setLang(arg);
            else termPrint('lang pt | lang en');
            break;
        case 'clear': $('#term-out').innerHTML = ''; break;
        case 'date': termPrint(new Date().toString()); break;
        case 'sudo':
            termPrint(`<span class="ok">${t.hire.replace(/\{email\}/g, esc(p.email))}</span>`);
            break;
        default:
            termPrint(`<span class="err">${t.notFound(esc(cmd))}</span>`);
    }
}

/* =========================================================================
   Init
   ========================================================================= */
async function init() {
    startBackground($('#bg'));
    const bootDone = boot();
    try {
        const res = await fetch('data/content.json', { cache: 'no-cache' });
        DATA = await res.json();
    } catch (e) {
        console.error('Failed to load data/content.json', e);
        $('#boot').classList.add('done');
        return;
    }
    LANG = initialLang();
    $('#year').textContent = new Date().getFullYear();
    renderAll();
    bindNav();
    bindProjects();
    bindContact();
    startClock();
    await bootDone;
    startTyped();
    glitchLoop();

    // GitHub sync (non-blocking): updates dates + repo counter
    try {
        REPOS = await getRepos(DATA.profile.github);
    } catch (e) {
        console.warn('GitHub unavailable, using local data.', e);
        GH_FAILED = true;
    }
    renderProjects();
    observeReveal();
    const repoMetric = $('#metrics .metric:last-child');
    if (REPOS && repoMetric) {
        const n = REPOS.filter(r => !r.fork).length;
        repoMetric.dataset.count = n;
        if (repoMetric.classList.contains('in')) $('.num', repoMetric).textContent = n;
    }
}

init();
