// Shared header and footer, injected on every page so they are edited in one place.
import { esc } from './services/data.js';

const NAV = [
    { page: 'home', href: './', label: 'Home' },
    { page: 'experience', href: 'experience.html', label: 'Experience' },
    { page: 'academic', href: 'academic.html', label: 'Academic' },
    { page: 'certifications', href: 'certifications.html', label: 'Certifications' },
    { page: 'projects', href: 'projects.html', label: 'Projects' },
];

const ICONS = {
    github: '<path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>',
    linkedin: '<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>',
    email: '<path d="M2 5.5A2.5 2.5 0 014.5 3h15A2.5 2.5 0 0122 5.5v13a2.5 2.5 0 01-2.5 2.5h-15A2.5 2.5 0 012 18.5v-13zm2.3-.5L12 11.2 19.7 5H4.3zM20 6.8l-7.4 6a1 1 0 01-1.2 0L4 6.8V18.5c0 .3.2.5.5.5h15c.3 0 .5-.2.5-.5V6.8z"/>',
};

function icon(name) {
    return `<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;
}

export function socialLinks(profile, extraClass = '') {
    const links = [
        { key: 'github', href: `https://github.com/${profile.github}`, label: 'GitHub' },
        { key: 'linkedin', href: profile.linkedin, label: 'LinkedIn' },
        { key: 'email', href: `mailto:${profile.email}`, label: 'Email' },
    ];
    return links.map(l => `
        <a href="${esc(l.href)}" ${l.key !== 'email' ? 'target="_blank" rel="noopener noreferrer"' : ''}
           class="text-neutral/70 hover:text-primary transition-colors ${extraClass}" aria-label="${l.label}">
            ${icon(l.key)}
        </a>`).join('');
}

export function renderLayout(profile, currentPage) {
    const header = document.getElementById('site-header');
    const footer = document.getElementById('site-footer');

    if (header) {
        const desktop = NAV.map(n => `
            <a href="${n.href}" class="nav-link ${n.page === currentPage ? 'active' : ''}"
               ${n.page === currentPage ? 'aria-current="page"' : ''}>${n.label}</a>`).join('');
        const mobile = NAV.map(n => `
            <a href="${n.href}" class="block px-3 py-2 rounded-md font-heading font-medium hover:bg-white/5 ${n.page === currentPage ? 'text-primary' : 'text-neutral hover:text-primary'}">${n.label}</a>`).join('');

        header.className = 'bg-secondary/70 backdrop-blur-lg border-b border-white/5 sticky top-0 z-50';
        header.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <a href="./" class="font-mono font-semibold text-lg text-neutral hover:text-white transition-colors">
                        <span class="text-primary">~/</span>${esc(profile.logo)}<span class="text-tertiary animate-blink">_</span>
                    </a>
                    <nav class="hidden md:flex space-x-8" aria-label="Main">${desktop}</nav>
                    <button id="mobile-menu-btn" class="md:hidden text-neutral hover:text-primary" aria-label="Open menu" aria-expanded="false">
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                    </button>
                </div>
            </div>
            <div id="mobile-menu" class="hidden md:hidden border-t border-white/10">
                <div class="px-2 pt-2 pb-3 space-y-1 bg-secondary">${mobile}</div>
            </div>`;

        const btn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('mobile-menu');
        btn.addEventListener('click', () => {
            const open = menu.classList.toggle('hidden') === false;
            btn.setAttribute('aria-expanded', String(open));
        });
    }

    if (footer) {
        footer.className = 'bg-secondary/50 backdrop-blur-md border-t border-white/5 mt-auto relative z-10';
        footer.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <p class="text-sm text-neutral/60">&copy; ${new Date().getFullYear()} ${esc(profile.fullName)}. Built with HTML, Tailwind &amp; vanilla JS.</p>
                <div class="flex items-center space-x-6">${socialLinks(profile)}</div>
            </div>`;
    }
}
