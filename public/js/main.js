import { fetchJson, esc } from './services/data.js';
import { fetchGitHubRepos, fetchRepoReadme } from './services/github.js';
import { renderLayout, socialLinks } from './layout.js';

let PROFILE = null;

document.addEventListener('DOMContentLoaded', async () => {
    PROFILE = await fetchJson('./data/profile.json') || {
        name: 'Isaac Koga', fullName: 'Isaac Koga', logo: 'isaac.koga', github: 'akog777',
        linkedin: '#', email: '',
    };
    const page = document.body.dataset.page || 'home';
    renderLayout(PROFILE, page);

    const routes = {
        home: renderHome,
        experience: renderExperience,
        academic: renderAcademic,
        certifications: renderCerts,
        'cert-detail': renderCertDetail,
        projects: renderProjects,
        'project-view': renderProjectView,
    };
    await (routes[page] || renderHome)();
});

/* ---------------------------------------------------------------- helpers */

const materialIcon = (name, cls = '') => `<span translate="no" class="material-icons ${cls}" aria-hidden="true">${name}</span>`;

function formatDate(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short', ...(d ? { day: 'numeric' } : {}) });
}

// Merges GitHub repos with the curated info in projects.json.
async function loadProjects() {
    const [blacklist, custom] = await Promise.all([
        fetchJson('./data/blacklist.json'),
        fetchJson('./data/projects.json'),
    ]);
    const aliases = custom?.alias || [];
    const extras = (custom?.extra || []).map(e => ({ ...e, name: e.title, isExtra: true }));

    let repos = [];
    let apiFailed = false;
    try {
        repos = await fetchGitHubRepos(PROFILE.github);
    } catch (e) {
        console.warn('GitHub API unavailable, using projects.json only.', e);
        apiFailed = true;
        // Fallback: build cards from the curated list so the page is never empty.
        repos = aliases.map(a => ({ name: a.alias, html_url: `https://github.com/${PROFILE.github}/${a.alias}` }));
    }

    const items = repos
        .filter(r => !(blacklist || []).includes(r.name))
        .map(r => {
            const a = aliases.find(x => x.alias === r.name) || {};
            return {
                ...r,
                repo: r.name,
                name: a.title || r.name,
                description: a.description || r.description,
                stack: a.stack || r.language,
                featured: !!a.featured,
                order: a.order ?? 999,
            };
        })
        .sort((x, y) => x.order - y.order || new Date(y.updated_at || 0) - new Date(x.updated_at || 0));

    return { items: [...items, ...extras], apiFailed, aliases };
}

function projectCard(p) {
    const isLink = !p.isExtra || p.url;
    const href = p.isExtra ? p.url : `project-view.html?repo=${encodeURIComponent(p.repo)}`;
    const accent = p.isExtra ? 'tertiary' : 'primary';
    const tag = isLink ? 'a' : 'div';
    const attrs = isLink
        ? `href="${esc(href)}" ${p.isExtra ? 'target="_blank" rel="noopener noreferrer"' : ''}`
        : '';
    const iconName = p.isExtra ? (p.url ? 'link' : 'lock') : 'folder_open';
    const footer = p.updated_at
        ? `<div class="flex items-center gap-2 text-xs font-mono text-neutral/50 mt-auto pt-4 border-t border-white/10">${materialIcon('schedule', 'text-sm text-primary/70')} Updated ${new Date(p.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>`
        : (p.isExtra && !p.url ? `<div class="flex items-center gap-2 text-xs font-mono text-neutral/50 mt-auto pt-4 border-t border-white/10">${materialIcon('shield', 'text-sm text-tertiary/70')} Internal project</div>` : '');

    return `
    <${tag} ${attrs} class="card ${isLink ? 'card-hover cursor-pointer' : ''} group flex flex-col p-6 h-full relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-${accent}/10 to-transparent rounded-bl-full -z-10"></div>
        <div class="flex items-start justify-between gap-3 mb-5">
            <div class="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:border-${accent}/30 transition-all">
                ${materialIcon(iconName, `text-3xl text-${accent}`)}
            </div>
            <div class="flex flex-col items-end gap-2">
                <span class="text-xs font-mono px-3 py-1 bg-${accent}/10 border border-${accent}/20 text-${accent} rounded-full text-right">${esc(p.stack || 'Code')}</span>
                ${p.featured ? `<span class="text-[10px] uppercase tracking-widest font-heading font-semibold text-tertiary">★ Featured</span>` : ''}
            </div>
        </div>
        <h3 class="font-bold text-xl text-neutral group-hover:text-white transition-colors font-heading mb-3 flex items-center gap-2">
            ${esc(p.name)} ${p.isExtra && p.url ? materialIcon('open_in_new', 'text-sm text-neutral/40') : ''}
        </h3>
        <p class="text-neutral/65 text-sm mb-6 flex-grow leading-relaxed">${esc(p.description || 'No description provided.')}</p>
        ${footer}
    </${tag}>`;
}

/* ---------------------------------------------------------------- home */

async function renderHome() {
    const hero = document.getElementById('hero');
    if (hero && PROFILE.hero) {
        const h = PROFILE.hero;
        hero.querySelector('[data-status]').textContent = PROFILE.status || '';
        hero.querySelector('[data-headline]').innerHTML =
            `${esc(h.before)} <span class="text-gradient">${esc(h.highlight)}</span><br class="hidden md:block"/> ${esc(h.after)}`;
        hero.querySelector('[data-greeting]').textContent = h.greeting;
        hero.querySelector('[data-summary]').textContent = h.summary;
        hero.querySelector('[data-socials]').innerHTML = socialLinks(PROFILE, 'p-2 rounded-lg border border-white/10 hover:border-primary/40 bg-white/5');
        document.title = `${PROFILE.name} — Portfolio`;
    }

    const stats = document.getElementById('stats');
    if (stats && PROFILE.stats) {
        stats.innerHTML = PROFILE.stats.map(s => `
            <div class="card p-6 text-center md:text-left">
                <div class="text-2xl md:text-3xl font-heading font-bold text-gradient mb-1">${esc(s.value)}</div>
                <div class="text-sm text-neutral/60">${esc(s.label)}</div>
            </div>`).join('');
    }

    const skills = document.getElementById('skills-container');
    const skillsData = await fetchJson('./data/skills.json');
    if (skills && skillsData) {
        skills.innerHTML = skillsData.map(cat => `
            <div class="card card-hover p-6">
                <h3 class="text-lg font-bold mb-5 font-heading flex items-center gap-2">
                    ${materialIcon(cat.icon || 'code', 'text-primary text-xl')} <span class="text-gradient">${esc(cat.category)}</span>
                </h3>
                <div class="flex flex-wrap gap-2">
                    ${cat.skills.map(s => `<span class="bg-primary/10 text-primary px-3 py-1 rounded-md text-sm font-mono">${esc(s)}</span>`).join('')}
                </div>
            </div>`).join('');
    }

    // Featured projects come from projects.json only (no API call on the home page).
    const featured = document.getElementById('featured-projects');
    const custom = await fetchJson('./data/projects.json');
    if (featured && custom) {
        const list = (custom.alias || []).filter(a => a.featured).sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
            .map(a => ({ ...a, repo: a.alias, name: a.title, featured: false }));
        featured.innerHTML = list.map(projectCard).join('');
    }
}

/* ---------------------------------------------------------------- experience */

async function renderExperience() {
    const container = document.getElementById('experience-container');
    const data = await fetchJson('./data/exp.json');
    if (!container || !data) return;

    container.innerHTML = data.map(item => `
        <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div class="flex items-center justify-center w-12 h-12 rounded-full border ${item.current ? 'border-primary/60 shadow-glow-sm' : 'border-white/20'} bg-secondary text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform group-hover:scale-110">
                ${materialIcon('work', 'text-xl')}
            </div>
            <div class="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] card card-hover p-7">
                <div class="flex flex-col xl:flex-row xl:justify-between xl:items-center mb-3 gap-2">
                    <h3 class="font-bold text-gradient text-xl font-heading">${esc(item.title)}</h3>
                    <span class="text-xs font-mono text-tertiary border border-tertiary/30 bg-tertiary/10 px-3 py-1 rounded-full whitespace-nowrap self-start">${esc(item.period)}</span>
                </div>
                <h4 class="text-neutral font-heading text-lg mb-4 flex flex-wrap items-center gap-2">
                    ${materialIcon('business', 'text-base text-neutral/50')} ${esc(item.company)}
                    <span class="text-neutral/40 text-sm">| ${esc(item.location)}</span>
                </h4>
                <p class="text-neutral/70 text-sm mb-4 leading-relaxed">${esc(item.description)}</p>
                ${item.highlights?.length ? `
                <ul class="space-y-2 mb-6">
                    ${item.highlights.map(h => `<li class="flex gap-2 text-sm text-neutral/75 leading-relaxed">${materialIcon('chevron_right', 'text-base text-primary mt-0.5')}<span>${esc(h)}</span></li>`).join('')}
                </ul>` : '<div class="mb-2"></div>'}
                <div class="flex flex-wrap gap-2">
                    ${(item.tech_stack || []).map(t => `<span class="tag hover:bg-primary/20 hover:text-primary transition-colors">${esc(t)}</span>`).join('')}
                </div>
            </div>
        </div>`).join('');
}

/* ---------------------------------------------------------------- academic */

async function renderAcademic() {
    const header = document.getElementById('academic-header');
    const termsEl = document.getElementById('academic-terms');
    const data = await fetchJson('./data/academic.json');
    if (!header || !termsEl || !data) return;

    const start = new Date(data.start);
    const end = new Date(data.end);
    const now = new Date();
    const progress = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
    const scale = data.scale || 10;

    header.innerHTML = `
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full -z-10"></div>
        <div>
            <h2 class="text-2xl md:text-3xl font-bold text-gradient font-heading mb-2">${esc(data.institution)}</h2>
            <p class="text-neutral text-xl">${esc(data.degree)}</p>
            <p class="text-neutral/60 text-sm mt-3 flex items-center gap-2">${materialIcon('place', 'text-base text-primary/70')} ${esc(data.location)}</p>
        </div>
        <div class="w-full md:w-64 bg-black/20 p-5 rounded-xl border border-white/5">
            <div class="flex justify-between items-end mb-3">
                <span class="text-xs font-heading text-neutral/50 uppercase tracking-widest font-semibold">Progress</span>
                <span class="text-xl font-bold text-primary font-mono">${progress.toFixed(0)}%</span>
            </div>
            <div class="w-full bg-white/10 rounded-full h-2 mb-2 overflow-hidden">
                <div class="bg-gradient-to-r from-primary to-tertiary h-2 rounded-full" style="width:${progress}%"></div>
            </div>
            <div class="flex justify-between text-xs text-neutral/40 font-mono"><span>${start.getFullYear()}</span><span>${end.getFullYear()}</span></div>
        </div>`;

    const averages = [];
    let totalSum = 0, totalCount = 0;

    termsEl.innerHTML = (data.terms || []).map(t => {
        const graded = t.courses.filter(c => typeof c.grade === 'number');
        const sum = graded.reduce((acc, c) => acc + c.grade, 0);
        if (graded.length) {
            averages.push({ term: t.term, avg: sum / graded.length });
            totalSum += sum; totalCount += graded.length;
        }
        const rows = t.courses.map(c => `
            <tr class="border-t border-white/5 hover:bg-white/5 transition-colors">
                <td class="px-6 py-4 text-sm text-neutral/90 font-medium">${esc(c.name)}</td>
                <td class="px-6 py-4 text-sm text-neutral/55 hidden sm:table-cell">${esc(c.project || '')}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-mono ${typeof c.grade === 'number' ? 'text-primary font-bold' : 'text-neutral/40'}">${typeof c.grade === 'number' ? c.grade.toFixed(1) : (t.current ? 'In progress' : '—')}</td>
            </tr>`).join('');
        return `
        <div class="card overflow-hidden">
            <div class="bg-white/5 px-6 py-5 border-b border-white/10 flex items-center justify-between">
                <div>
                    <h3 class="font-bold text-xl text-gradient font-heading">${esc(t.term)}</h3>
                    <span class="text-xs text-neutral/50 font-mono">${esc(t.label || '')}</span>
                </div>
                <div class="p-2 bg-primary/10 rounded-lg">${materialIcon('school', 'text-primary/80 text-2xl block')}</div>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full">
                    <thead class="bg-black/20"><tr>
                        <th class="px-6 py-3 text-left text-xs font-bold text-neutral/50 uppercase tracking-wider font-heading">Course</th>
                        <th class="px-6 py-3 text-left text-xs font-bold text-neutral/50 uppercase tracking-wider font-heading hidden sm:table-cell">Highlight</th>
                        <th class="px-6 py-3 text-right text-xs font-bold text-neutral/50 uppercase tracking-wider font-heading">Grade</th>
                    </tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            ${graded.length ? `
            <div class="bg-black/20 px-6 py-4 border-t border-white/10 flex items-center justify-between">
                <span class="text-xs font-heading text-neutral/50 uppercase tracking-widest font-semibold">Semester average</span>
                <span class="text-xl font-bold text-gradient">${(sum / graded.length).toFixed(1)}</span>
            </div>` : ''}
        </div>`;
    }).join('');

    // Performance card only appears once grades are filled in academic.json.
    if (averages.length) {
        const bars = [...averages].reverse().map(a => `
            <div class="flex flex-col items-center gap-3 group">
                <div class="h-32 w-10 sm:w-12 bg-black/20 rounded-t-lg relative flex items-end overflow-hidden border-b border-white/10">
                    <div class="w-full bg-gradient-to-t from-primary/50 to-tertiary/80 rounded-t" style="height:${(a.avg / scale) * 100}%"></div>
                    <span class="absolute bottom-2 inset-x-0 text-center text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">${a.avg.toFixed(1)}</span>
                </div>
                <span class="text-xs font-mono text-neutral/50">${esc(a.term)}</span>
            </div>`).join('');
        termsEl.insertAdjacentHTML('beforeend', `
            <div class="card p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div class="text-center md:text-left">
                    <h3 class="text-xl font-bold mb-2 font-heading flex items-center gap-2 justify-center md:justify-start">${materialIcon('insights', 'text-tertiary')} Overall performance</h3>
                    <p class="text-sm text-neutral/60 mb-4">Cumulative average (0–${scale})</p>
                    <div class="text-5xl font-bold text-gradient font-heading">${(totalSum / totalCount).toFixed(1)}</div>
                </div>
                <div class="flex items-end gap-4">${bars}</div>
            </div>`);
    }
}

/* ---------------------------------------------------------------- certifications */

async function renderCerts() {
    const grid = document.getElementById('certs-grid');
    const data = await fetchJson('./data/certs.json');
    if (!grid || !data) return;

    grid.innerHTML = data.map(c => `
        <a href="cert-detail.html?id=${encodeURIComponent(c.id)}" class="card card-hover group block p-6 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-tertiary/10 to-transparent rounded-bl-full -z-10"></div>
            <div class="flex justify-between items-start mb-6">
                <div class="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:border-tertiary/30 group-hover:shadow-glow-amber transition-all">
                    ${materialIcon('verified', 'text-2xl text-tertiary')}
                </div>
                <span class="text-xs font-mono px-3 py-1 bg-white/5 rounded-full text-neutral/60">${c.date ? esc(formatDate(c.date)) : (c.hours ? `${c.hours}h` : '')}</span>
            </div>
            <h3 class="font-bold text-xl text-neutral group-hover:text-white transition-colors font-heading mb-2">${esc(c.title)}</h3>
            <p class="text-neutral/60 text-sm flex items-center gap-1">${materialIcon('apartment', 'text-sm')} ${esc(c.issuer)}</p>
        </a>`).join('');
}

async function renderCertDetail() {
    const container = document.getElementById('cert-detail-container');
    if (!container) return;
    const id = new URLSearchParams(location.search).get('id');
    const data = await fetchJson('./data/certs.json');
    const cert = data?.find(c => c.id === id);

    if (!cert) {
        container.innerHTML = `<p class="text-primary">Certification not found.</p>
            <a href="certifications.html" class="inline-block mt-6 text-sm text-neutral/60 hover:text-primary">← Back to Certifications</a>`;
        return;
    }
    document.title = `${cert.title} — ${PROFILE.name}`;

    let viewer = '';
    if (cert.file) {
        viewer = cert.file.toLowerCase().endsWith('.pdf')
            ? `<div class="mt-8 w-full h-[60vh] min-h-[420px] border border-white/10 rounded-2xl overflow-hidden"><iframe src="${esc(cert.file)}" title="Certificate" class="w-full h-full"></iframe></div>`
            : `<div class="mt-8 border border-white/10 rounded-2xl overflow-hidden bg-white/5 p-4 flex justify-center"><img src="${esc(cert.file)}" alt="Certificate: ${esc(cert.title)}" class="max-w-full max-h-[75vh] object-contain rounded-lg"/></div>`;
    }
    const meta = [
        cert.date ? `${materialIcon('calendar_today', 'text-sm text-neutral/60')} ${esc(formatDate(cert.date))}` : '',
        cert.hours ? `${materialIcon('timer', 'text-sm text-neutral/60')} ${cert.hours} hours` : '',
    ].filter(Boolean).map(m => `<span class="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm font-mono text-neutral/80">${m}</span>`).join('');

    container.innerHTML = `
        <div class="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6 shadow-glow-sm">${materialIcon('workspace_premium', 'text-5xl text-primary')}</div>
        <h1 class="text-3xl font-bold mb-2 font-heading">${esc(cert.title)}</h1>
        <p class="text-xl text-primary mb-6">${esc(cert.issuer)}</p>
        <div class="flex flex-wrap justify-center gap-3">${meta}</div>
        ${viewer}
        ${cert.url ? `<a href="${esc(cert.url)}" target="_blank" rel="noopener noreferrer" class="mt-8 inline-flex items-center gap-2 bg-primary text-secondary px-8 py-3 rounded-xl font-bold hover:shadow-glow-lg hover:-translate-y-0.5 transition-all font-heading">${materialIcon('open_in_new', 'text-xl')} Verify credential</a>` : ''}
        <div class="mt-10"><a href="certifications.html" class="inline-flex items-center gap-2 text-neutral/50 hover:text-primary text-sm transition-colors">${materialIcon('arrow_back', 'text-base')} Back to Certifications</a></div>`;
}

/* ---------------------------------------------------------------- projects */

async function renderProjects() {
    const loading = document.getElementById('projects-loading');
    const notice = document.getElementById('projects-notice');
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    const { items, apiFailed } = await loadProjects();
    loading?.classList.add('hidden');
    if (apiFailed && notice) notice.classList.remove('hidden');

    grid.innerHTML = items.length
        ? items.map(projectCard).join('')
        : '<p class="text-neutral/60">No projects found.</p>';
    grid.classList.remove('hidden');
}

async function renderProjectView() {
    const loading = document.getElementById('readme-loading');
    const errorEl = document.getElementById('readme-error');
    const content = document.getElementById('readme-content');
    const head = document.getElementById('project-head');
    const repo = new URLSearchParams(location.search).get('repo');
    if (!content) return;

    if (!repo) {
        loading.classList.add('hidden');
        errorEl.textContent = 'Repository not specified.';
        errorEl.classList.remove('hidden');
        return;
    }

    const repoUrl = `https://github.com/${PROFILE.github}/${repo}`;
    const ghLink = document.getElementById('github-link');
    ghLink.href = repoUrl;
    ghLink.classList.remove('hidden');

    const custom = await fetchJson('./data/projects.json');
    const meta = custom?.alias?.find(a => a.alias === repo);
    head.innerHTML = `
        <span class="text-xs font-mono px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full">${esc(meta?.stack || 'Repository')}</span>
        <h1 class="text-3xl md:text-4xl font-bold font-heading mt-4 mb-3">${esc(meta?.title || repo)}</h1>
        ${meta?.description ? `<p class="text-neutral/70 leading-relaxed max-w-3xl">${esc(meta.description)}</p>` : ''}`;
    document.title = `${meta?.title || repo} — ${PROFILE.name}`;

    try {
        const markdown = await fetchRepoReadme(PROFILE.github, repo);
        const rawBase = `https://raw.githubusercontent.com/${PROFILE.github}/${repo}/HEAD/`;
        const blobBase = `${repoUrl}/blob/HEAD/`;
        const html = window.DOMPurify.sanitize(window.marked.parse(markdown));
        content.innerHTML = html;

        // Fix relative image and link paths so README assets load from GitHub.
        const isRelative = u => u && !/^(https?:|mailto:|#|data:|\/\/)/i.test(u);
        content.querySelectorAll('img').forEach(img => {
            const src = img.getAttribute('src');
            if (isRelative(src)) img.src = rawBase + src.replace(/^\.?\//, '');
        });
        content.querySelectorAll('a').forEach(a => {
            const href = a.getAttribute('href');
            if (isRelative(href)) a.href = blobBase + href.replace(/^\.?\//, '');
            if (!href?.startsWith('#')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
        });

        if (markdown.trim().length < 120) {
            content.insertAdjacentHTML('beforeend', `<p class="text-neutral/50 text-sm">This repository has a short README — open it on GitHub to browse the source code.</p>`);
        }
    } catch (e) {
        console.error(e);
        errorEl.innerHTML = `Couldn't load the README right now. <a class="underline" href="${esc(repoUrl)}" target="_blank" rel="noopener noreferrer">Open it on GitHub</a>.`;
        errorEl.classList.remove('hidden');
        content.parentElement.classList.add('hidden');
    } finally {
        loading.classList.add('hidden');
    }
}
