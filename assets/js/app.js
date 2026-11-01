import { getRepos, getReadme } from './github.js';

/* =========================================================================
   Interface strings (the content itself lives in data/content.json)
   ========================================================================= */
const UI = {
    pt: {
        skip: 'Pular para o conteúdo',
        'nav.overview': 'Visão geral', 'nav.experience': 'Experiência', 'nav.projects': 'Projetos',
        'nav.skills': 'Competências', 'nav.education': 'Formação', 'nav.contact': 'Contato',
        'hero.cta1': 'Ver projetos', 'hero.cta2': 'Entrar em contato',
        'ov.eyebrow': 'Visão geral', 'ov.title': 'Impacto em <em>números</em>',
        'exp.eyebrow': 'Experiência', 'exp.title': 'Onde já <em>entreguei</em>',
        'proj.eyebrow': 'Projetos', 'proj.title': 'Coisas que <em>construí</em>',
        'skills.eyebrow': 'Competências', 'skills.title': 'Stack &amp; <em>certificações</em>',
        'edu.eyebrow': 'Formação', 'edu.title': 'Base <em>acadêmica</em>',
        'contact.eyebrow': 'Contato', 'contact.title': 'Vamos construir algo <em>juntos?</em>',
        'contact.sub': 'Aberto a conversas sobre oportunidades, projetos e networking.',
        'footer.top': 'Voltar ao topo ↑',
        facts: { location: 'Localização', now: 'Atualmente', edu: 'Formação', langs: 'Idiomas' },
        langsValue: 'Português · Inglês',
        about: 'Sobre mim', nowLabel: 'Atualmente', stackLabel: 'Stack principal',
        points: [
            ['Full-Stack', 'React · Spring Boot · APIs REST'],
            ['Automação', 'Python · Playwright · VBA'],
            ['Dados', 'SQL · PostgreSQL'],
            ['IA Generativa', 'para acelerar entregas'],
        ],
        code: { eyebrow: 'Na prática', title: 'Rotinas de horas viraram minutos', text: 'Na Huawei, robôs em Python + Playwright e macros VBA assumiram exportações de relatórios e atualizações de bases que eram feitas à mão.', comment: 'rotina semanal — antes vs. depois' },
        current: 'Atual', featured: 'Destaque', internal: 'Projeto interno', updated: 'Atualizado em', details: 'Ver detalhes',
        cats: { all: 'Todos', backend: 'Back-end', web: 'Web', cloud: 'Cloud', automation: 'Automação', mobile: 'Mobile', game: 'Games' },
        ghOk: n => `${n} repositórios sincronizados com o GitHub · `,
        ghFail: 'GitHub indisponível no momento — exibindo dados locais · ',
        hours: 'horas',
        progress: 'Progresso do curso', hoursDone: 'concluídas', hoursNow: 'em curso', of: 'de',
        stageOf: n => `${n}ª de 8 etapas`, coursesDone: 'disciplinas concluídas', inProgress: 'disciplinas em curso',
        languages: 'Idiomas', curriculum: 'Grade curricular', stage: 'Etapa', coursesN: n => `${n} disciplinas`,
        st: { done: 'Concluída', current: 'Cursando', next: 'Próxima' },
        readmeLoading: 'Carregando README…', readmeFail: 'Não foi possível carregar o README agora.', readmeShort: 'Este repositório tem um README curto — abra no GitHub para ver o código.',
        internalNote: 'Projeto interno da empresa: o código não é público.',
        copyMail: 'Copiar e-mail', copied: 'E-mail copiado ✓',
        themeLabel: 'Alternar tema', langLabel: 'Switch to English',
    },
    en: {
        skip: 'Skip to content',
        'nav.overview': 'Overview', 'nav.experience': 'Experience', 'nav.projects': 'Projects',
        'nav.skills': 'Skills', 'nav.education': 'Education', 'nav.contact': 'Contact',
        'hero.cta1': 'View projects', 'hero.cta2': 'Get in touch',
        'ov.eyebrow': 'Overview', 'ov.title': 'Impact in <em>numbers</em>',
        'exp.eyebrow': 'Experience', 'exp.title': 'Where I’ve <em>delivered</em>',
        'proj.eyebrow': 'Projects', 'proj.title': 'Things I’ve <em>built</em>',
        'skills.eyebrow': 'Skills', 'skills.title': 'Stack &amp; <em>certifications</em>',
        'edu.eyebrow': 'Education', 'edu.title': 'Academic <em>background</em>',
        'contact.eyebrow': 'Contact', 'contact.title': 'Let’s build something <em>together?</em>',
        'contact.sub': 'Open to conversations about opportunities, projects and networking.',
        'footer.top': 'Back to top ↑',
        facts: { location: 'Location', now: 'Currently', edu: 'Education', langs: 'Languages' },
        langsValue: 'Portuguese · English',
        about: 'About me', nowLabel: 'Currently', stackLabel: 'Core stack',
        points: [
            ['Full-Stack', 'React · Spring Boot · REST APIs'],
            ['Automation', 'Python · Playwright · VBA'],
            ['Data', 'SQL · PostgreSQL'],
            ['Generative AI', 'to ship faster'],
        ],
        code: { eyebrow: 'In practice', title: 'Hour-long routines became minutes', text: 'At Huawei, Python + Playwright bots and VBA macros took over report exports and database updates that used to be done by hand.', comment: 'weekly routine — before vs. after' },
        current: 'Current', featured: 'Featured', internal: 'Internal project', updated: 'Updated', details: 'View details',
        cats: { all: 'All', backend: 'Back-end', web: 'Web', cloud: 'Cloud', automation: 'Automation', mobile: 'Mobile', game: 'Games' },
        ghOk: n => `${n} repositories synced from GitHub · `,
        ghFail: 'GitHub is unavailable right now — showing local data · ',
        hours: 'hours',
        progress: 'Degree progress', hoursDone: 'completed', hoursNow: 'in progress', of: 'of',
        stageOf: n => `semester ${n} of 8`, coursesDone: 'courses completed', inProgress: 'courses in progress',
        languages: 'Languages', curriculum: 'Curriculum', stage: 'Semester', coursesN: n => `${n} courses`,
        st: { done: 'Completed', current: 'In progress', next: 'Upcoming' },
        readmeLoading: 'Loading README…', readmeFail: "Couldn't load the README right now.", readmeShort: 'This repository has a short README — open it on GitHub to browse the code.',
        internalNote: 'Internal company project: the code is not public.',
        copyMail: 'Copy email', copied: 'Email copied ✓',
        themeLabel: 'Toggle theme', langLabel: 'Mudar para português',
    },
};

const ICON = {
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12.02c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.56 9.56 0 0112 6.84c.85 0 1.71.12 2.5.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10.02 10.02 0 0022 12.02C22 6.48 17.52 2 12 2z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM8 19H5V8h3v11zM6.5 6.73a1.76 1.76 0 110-3.53 1.76 1.76 0 010 3.53zM20 19h-3v-5.6c0-3.37-4-3.12-4 0V19h-3V8h3v1.77c1.4-2.59 7-2.78 7 2.47V19z"/></svg>',
    email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 5.5A2.5 2.5 0 014.5 3h15A2.5 2.5 0 0122 5.5v13a2.5 2.5 0 01-2.5 2.5h-15A2.5 2.5 0 012 18.5v-13zM4.3 5L12 11.2 19.7 5H4.3zM20 6.8l-7.4 6a1 1 0 01-1.2 0L4 6.8v11.7c0 .3.2.5.5.5h15c.3 0 .5-.2.5-.5V6.8z"/></svg>',
    arrow: '<svg class="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>',
};

/* =========================================================================
   State & helpers
   ========================================================================= */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const HOVER = matchMedia('(hover: hover)').matches;

let DATA = null, LANG = 'pt', REPOS = null, GH_FAILED = false, FILTER = 'all', TERM = null;

const L = v => (v && typeof v === 'object' && !Array.isArray(v) && ('pt' in v || 'en' in v)) ? (v[LANG] ?? v.pt) : v;
const T = k => UI[LANG][k] ?? k;
const locale = () => (LANG === 'pt' ? 'pt-BR' : 'en-US');
const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
};

function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove('show'), 1800);
}

/* =========================================================================
   Rendering
   ========================================================================= */
function applyStatic() {
    document.documentElement.lang = LANG === 'pt' ? 'pt-BR' : 'en';
    $$('[data-i18n]').forEach(el => { el.textContent = T(el.dataset.i18n); });
    $$('[data-i18n-html]').forEach(el => { el.innerHTML = T(el.dataset.i18nHtml); });
    $('.skip').textContent = T('skip');
    const lb = $('#lang-btn');
    lb.textContent = LANG === 'pt' ? 'EN' : 'PT';
    lb.setAttribute('aria-label', T('langLabel'));
    $('#theme-btn').setAttribute('aria-label', T('themeLabel'));
    $('#footer-loc').textContent = DATA.profile.location;
}

const socials = () => {
    const p = DATA.profile;
    return [
        { key: 'linkedin', label: 'LinkedIn', href: p.linkedin, value: p.linkedin.replace(/^https?:\/\/(www\.)?/, '') },
        { key: 'github', label: 'GitHub', href: `https://github.com/${p.github}`, value: `github.com/${p.github}` },
        { key: 'email', label: 'E-mail', href: `mailto:${p.email}`, value: p.email },
    ];
};

function renderHero() {
    const p = DATA.profile, h = L(p.headline);
    const cur = DATA.education.terms.find(t => t.status === 'current');
    $('#hero-status').textContent = `${L(p.status)} · ${p.location.split('—')[0].trim()}`;
    $('#hero-title').innerHTML = `${esc(h.lead)} <em>${esc(h.accent)}</em>`;
    $('#hero-sub').textContent = L(p.summary);
    $('#hero-social').innerHTML = socials().map(s => `
        <a class="social" href="${esc(s.href)}" ${s.key !== 'email' ? 'target="_blank" rel="noopener noreferrer"' : ''} aria-label="${s.label}">${ICON[s.key]}</a>`).join('');
    const f = T('facts');
    const facts = [
        [f.location, p.location],
        [f.now, 'Trainee · Management Solutions'],
        [f.edu, `${LANG === 'pt' ? 'SI' : 'B.Sc. IS'} · Mackenzie (${cur ? T('stageOf')(cur.n) : ''})`],
        [f.langs, T('langsValue')],
    ];
    $('#hero-facts').innerHTML = facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
}

function renderBento() {
    const m = DATA.metrics;
    const val = x => x.id === 'repos' ? (REPOS ? REPOS.filter(r => !r.fork).length : x.fallback) : x.value;
    const metric = (x, cls) => `
        <div class="card b b-metric ${cls} reveal" data-count="${val(x)}">
            <span class="metric-label">${esc(L(x.label))}</span>
            <div class="metric-value">${x.prefix ? `<span class="pre">${esc(x.prefix)}</span>` : ''}<span class="num">${REDUCE ? val(x) : 0}</span>${x.suffix ? `<small>${esc(x.suffix)}</small>` : ''}</div>
        </div>`;
    const core = ['React.js', 'Java', 'Spring Boot', 'Python', 'SQL', 'PostgreSQL', 'Playwright', 'VBA', 'AWS', 'Git'];
    const c = T('code');
    $('#bento').innerHTML = `
        <div class="card b b-about reveal">
            <span class="metric-label">${T('about')}</span>
            <h3>${esc(DATA.profile.name)}</h3>
            <p>${esc(L(DATA.profile.tagline))}</p>
            <div class="points">${T('points').map(([a, b]) => `<div class="point"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('')}</div>
        </div>
        ${metric(m[0], '')}
        ${metric(m[1], '')}
        ${metric(m[2], 'half')}
        ${metric(m[3], 'half')}
        <div class="card b b-now reveal">
            <div class="now-logo">MS</div>
            <div>
                <div class="now-label">${T('nowLabel')}</div>
                <div class="now-title">Trainee · Management Solutions</div>
                <div class="now-label">${esc(L(DATA.experience[0].period))}</div>
            </div>
        </div>
        <div class="card b b-stack reveal">
            <span class="metric-label">${T('stackLabel')}</span>
            <div class="tags">${core.map(s => `<span class="tag">${esc(s)}</span>`).join('')}</div>
        </div>
        <div class="card b b-code reveal">
            <div class="code-copy">
                <span class="eyebrow">${esc(c.eyebrow)}</span>
                <h3>${esc(c.title)}</h3>
                <p>${esc(c.text)}</p>
            </div>
            <div class="code-win">
                <div class="code-bar"><i></i><i></i><i></i><span>export_report.py</span></div>
<pre><span class="c"># ${esc(c.comment)}</span>
<span class="k">from</span> playwright.sync_api <span class="k">import</span> sync_playwright

<span class="k">def</span> <span class="f">export_report</span>(page, filters):
    page.goto(ERP_URL)
    page.fill(<span class="s">"#filter"</span>, filters)
    page.click(<span class="s">"text=Export"</span>)

<span class="c"># manual:     3–4 h</span>
<span class="c"># automated: </span><span class="ok">≤ 10 min ✓</span></pre>
            </div>
        </div>`;
}

function renderJobs() {
    $('#jobs').innerHTML = DATA.experience.map(j => `
        <li class="job reveal">
            <div class="job-when">${esc(L(j.period))}${j.current ? `<br><span class="now">${T('current')}</span>` : ''}</div>
            <div>
                <div class="job-head"><h3>${esc(j.company)}</h3><span class="job-type">${esc(L(j.type))}</span></div>
                <p class="job-role">${esc(L(j.role))}</p>
                <ul>${L(j.bullets).map(b => `<li>${esc(b)}</li>`).join('')}</ul>
                <div class="tags">${j.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
            </div>
        </li>`).join('');
}

function renderFilters() {
    const cats = T('cats'), counts = { all: DATA.projects.length };
    DATA.projects.forEach(p => { counts[p.cat] = (counts[p.cat] || 0) + 1; });
    $('#filters').innerHTML = Object.keys(cats).filter(c => counts[c]).map(c => `
        <button class="filter" type="button" role="tab" data-cat="${c}" aria-selected="${c === FILTER}">${esc(cats[c])}<span class="n">${counts[c]}</span></button>`).join('');
}

function renderProjects() {
    const cats = T('cats');
    let bigUsed = false;
    $('#projects-grid').innerHTML = DATA.projects.map((p, i) => {
        const gh = REPOS?.find(r => r.name === p.repo);
        const date = gh?.pushed ? new Date(gh.pushed).toLocaleDateString(locale(), { month: 'short', year: 'numeric' }) : null;
        const big = p.featured && !bigUsed && (bigUsed = true);
        const left = p.internal ? `🔒 ${T('internal')}` : p.repo ? (date ? `${T('updated')} ${date}` : `github/${p.repo}`) : (p.url || '').replace('https://', '');
        return `
        <button type="button" class="card hoverable spot proj ${big ? 'big' : ''} reveal ${FILTER !== 'all' && p.cat !== FILTER ? 'hide' : ''}" data-idx="${i}" data-cat="${p.cat}">
            <div class="proj-top">
                <span class="proj-cat">${esc(cats[p.cat] || p.cat)}</span>
                ${p.featured ? `<span class="proj-star">${T('featured')}</span>` : ''}
            </div>
            <h3>${esc(L(p.title))}${ICON.arrow}</h3>
            <p>${esc(L(p.desc))}</p>
            <div class="tags">${p.stack.map(s => `<span class="tag">${esc(s)}</span>`).join('')}</div>
            <div class="proj-foot"><span>${esc(left)}</span><span>${T('details')} →</span></div>
        </button>`;
    }).join('');

    const user = DATA.profile.github, link = `<a href="https://github.com/${user}" target="_blank" rel="noopener noreferrer">github.com/${user}</a>`;
    $('#gh-note').innerHTML = REPOS ? esc(T('ghOk')(REPOS.filter(r => !r.fork).length)) + link : GH_FAILED ? esc(T('ghFail')) + link : '';
    bindSpotlight($('#projects-grid'));
}

function renderSkills() {
    $('#skills-list').innerHTML = DATA.skills.map(s => `
        <div class="skill-row reveal">
            <h3>${esc(L(s.title))}</h3>
            <div class="tags">${s.items.map(it => `<span class="tag">${esc(it)}</span>`).join('')}</div>
        </div>`).join('');
    $('#certs').innerHTML = DATA.certifications.map(c => `
        <div class="card cert reveal">
            <span class="cert-issuer">${esc(c.issuer)}</span>
            <span class="cert-title">${esc(L(c.title))}</span>
            <span class="cert-hours">${c.hours} ${T('hours')}</span>
        </div>`).join('');
}

function renderEducation() {
    const e = DATA.education;
    const start = new Date(`${e.start}T12:00:00`), end = new Date(`${e.end}T12:00:00`);
    const fmt = d => d.toLocaleDateString(locale(), { month: 'short', year: 'numeric' });
    const num = n => n.toLocaleString(locale());
    const pctDone = (e.hoursDone / e.hoursTotal) * 100, pctNow = (e.hoursInProgress / e.hoursTotal) * 100;
    const cur = e.terms.find(t => t.status === 'current') || e.terms[0];
    const done = e.terms.filter(t => t.status === 'done').reduce((n, t) => n + t.courses.length, 0);
    if (TERM === null) TERM = cur.n;

    $('#edu').innerHTML = `
        <div class="edu-top">
            <div class="card edu-main reveal">
                <span class="edu-dates">${esc(fmt(start))} — ${esc(fmt(end))}</span>
                <h3 class="edu-inst">${esc(e.institution)}</h3>
                <p class="edu-degree">${esc(L(e.degree))} · ${esc(T('stageOf')(cur.n))}</p>
                <div class="progress-row"><span>${T('progress')}</span><b>${pctDone.toFixed(0)}%</b></div>
                <div class="bar"><i data-w="${pctDone}"></i><em data-w="${pctNow}" style="left:${pctDone}%"></em></div>
                <div class="legend">
                    <span><i class="sw" style="background:var(--accent)"></i>${num(e.hoursDone)}h ${T('hoursDone')}</span>
                    <span><i class="sw" style="background:var(--ok)"></i>${num(e.hoursInProgress)}h ${T('hoursNow')}</span>
                    <span>${T('of')} ${num(e.hoursTotal)}h</span>
                </div>
            </div>
            <div class="edu-stats">
                <div class="card stat reveal"><b>${done}</b><span>${T('coursesDone')} · ${cur.courses.length} ${T('inProgress')}</span></div>
                <div class="card stat reveal">
                    <span>${T('languages')}</span>
                    ${e.languages.map(l => `
                    <div class="lang"><b style="font:600 15px var(--f-head)">${esc(L(l.name))}</b><span>${esc(L(l.level))}</span></div>
                    <div class="bar"><i data-w="${l.pct}"></i></div>`).join('')}
                </div>
            </div>
        </div>
        <div class="card curriculum reveal">
            <div class="curriculum-head"><h3>${T('curriculum')}</h3></div>
            <div class="stepper" role="tablist" aria-label="${esc(T('curriculum'))}">
                ${e.terms.map(t => `
                <button type="button" class="step ${t.status}" role="tab" data-term="${t.n}" aria-selected="${t.n === TERM}">
                    <b>${String(t.n).padStart(2, '0')}</b><span>${esc(t.period)}</span>
                </button>`).join('')}
            </div>
            <div id="term-panel"></div>
        </div>`;
    renderTerm();
}

function renderTerm() {
    const t = DATA.education.terms.find(x => x.n === TERM);
    if (!t) return;
    $('#term-panel').innerHTML = `
        <div class="curriculum-head">
            <span class="muted" style="font-size:14px">${T('stage')} ${t.n} · ${esc(t.period)} · ${esc(T('coursesN')(t.courses.length))}</span>
            <span class="step-status ${t.status}">${T('st')[t.status]}</span>
        </div>
        <ul class="courses ${t.status}">
            ${t.courses.map((c, i) => `<li style="--i:${i}"><span>${String(i + 1).padStart(2, '0')}</span>${esc(L(c))}</li>`).join('')}
        </ul>`;
}

function renderContact() {
    const s = socials();
    $('#cta-actions').innerHTML = `
        <a class="btn btn-solid" href="${esc(s[0].href)}" target="_blank" rel="noopener noreferrer">LinkedIn <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
        <button type="button" class="btn btn-line copy-mail" id="copy-mail" title="${T('copyMail')}">${esc(DATA.profile.email)}</button>
        <a class="btn btn-line" href="${esc(s[1].href)}" target="_blank" rel="noopener noreferrer">GitHub</a>`;
}

function renderAll() {
    applyStatic();
    renderHero();
    renderBento();
    renderJobs();
    renderFilters();
    renderProjects();
    renderSkills();
    renderEducation();
    renderContact();
    observeReveal();
}

/* =========================================================================
   Effects
   ========================================================================= */
let revealObs;
function observeReveal() {
    revealObs ??= new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (!en.isIntersecting) return;
            const el = en.target;
            el.classList.add('in');
            if (el.dataset.count !== undefined) countUp(el);
            $$('.bar i, .bar em', el).forEach(b => { b.style.width = `${b.dataset.w}%`; });
            revealObs.unobserve(el);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal:not(.in)').forEach((el, i) => {
        el.style.transitionDelay = `${(i % 4) * 70}ms`;
        revealObs.observe(el);
    });
}

function countUp(el) {
    const target = Number(el.dataset.count), num = $('.num', el);
    if (!num) return;
    if (REDUCE) { num.textContent = target; return; }
    const t0 = performance.now(), dur = 1200;
    const step = now => {
        const k = Math.min(1, (now - t0) / dur);
        num.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

function bindSpotlight(root) {
    if (!HOVER || REDUCE) return;
    $$('.spot', root).forEach(card => {
        card.addEventListener('pointermove', e => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - r.left}px`);
            card.style.setProperty('--my', `${e.clientY - r.top}px`);
        }, { passive: true });
    });
}

/* =========================================================================
   Behaviour
   ========================================================================= */
function bindNav() {
    const nav = $('#nav'), links = $('#nav-links'), btn = $('#menu-btn');
    const onScroll = () => nav.classList.toggle('scrolled', scrollY > 10);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });

    btn.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
    });
    $$('a', links).forEach(a => a.addEventListener('click', () => { links.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }));

    const anchors = $$('a', links);
    const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (en.isIntersecting) anchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${en.target.id}`));
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main > section[id]').forEach(s => io.observe(s));

    $('#lang-btn').addEventListener('click', () => {
        LANG = LANG === 'pt' ? 'en' : 'pt';
        store.set('lang', LANG);
        renderAll();
    });
    $('#theme-btn').addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        $('meta[name="theme-color"]').setAttribute('content', next === 'dark' ? '#0B0C0F' : '#FAFAF9');
        store.set('theme', next);
    });
}

function bindInteractions() {
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
    $('#edu').addEventListener('click', e => {
        const b = e.target.closest('.step');
        if (!b) return;
        TERM = Number(b.dataset.term);
        $$('.step').forEach(x => x.setAttribute('aria-selected', String(x === b)));
        renderTerm();
    });
    $('#cta-actions').addEventListener('click', async e => {
        if (!e.target.closest('#copy-mail')) return;
        try { await navigator.clipboard.writeText(DATA.profile.email); toast(T('copied')); }
        catch { location.href = `mailto:${DATA.profile.email}`; }
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
    $('#modal-path').textContent = p.repo ? `github.com/${user}/${p.repo}` : p.internal ? T('internal') : (p.url || '').replace('https://', '');
    const gh = $('#modal-gh');
    gh.hidden = !link;
    if (link) gh.href = link;

    $('#modal-body').innerHTML = `
        <div class="tags">${p.stack.map(s => `<span class="tag">${esc(s)}</span>`).join('')}</div>
        <p class="modal-desc">${esc(L(p.desc))}</p>
        <div class="readme" id="readme">${p.repo ? `<p class="loading">${T('readmeLoading')}</p>` : `<p class="muted">${p.internal ? T('internalNote') : ''}</p>`}</div>`;
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
        if (md.trim().length < 120) target.insertAdjacentHTML('beforeend', `<p class="muted">${T('readmeShort')}</p>`);
    } catch (err) {
        console.warn(err);
        target.innerHTML = `<p class="muted">${T('readmeFail')} <a href="${esc(link)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a></p>`;
    }
}

function closeModal() {
    $('#modal').hidden = true;
    document.body.classList.remove('locked');
    lastFocus?.focus();
}

/* =========================================================================
   Init
   ========================================================================= */
async function init() {
    try {
        DATA = await (await fetch('data/content.json', { cache: 'no-cache' })).json();
    } catch (e) {
        console.error('Failed to load data/content.json', e);
        return;
    }
    const saved = store.get('lang');
    LANG = saved === 'pt' || saved === 'en' ? saved : ((navigator.language || 'pt').toLowerCase().startsWith('pt') ? 'pt' : 'en');
    $('#year').textContent = new Date().getFullYear();
    renderAll();
    bindNav();
    bindInteractions();

    try { REPOS = await getRepos(DATA.profile.github); }
    catch (e) { console.warn('GitHub unavailable, using local data.', e); GH_FAILED = true; }
    renderProjects();
    observeReveal();
    const repoCard = $$('#bento [data-count]').at(-1);
    if (REPOS && repoCard) {
        const n = REPOS.filter(r => !r.fork).length;
        repoCard.dataset.count = n;
        if (repoCard.classList.contains('in')) $('.num', repoCard).textContent = n;
    }
}

init();
