// GitHub public API helpers with a 30-minute sessionStorage cache
// (the unauthenticated API allows 60 requests/hour per visitor).

const TTL = 30 * 60 * 1000;

function cacheGet(key) {
    try {
        const hit = JSON.parse(sessionStorage.getItem(key));
        return hit && Date.now() - hit.t < TTL ? hit.d : null;
    } catch { return null; }
}
function cacheSet(key, d) {
    try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), d })); } catch { /* ignore */ }
}

export async function getRepos(user) {
    const key = `gh2:repos:${user}`;
    const hit = cacheGet(key);
    if (hit) return hit;
    const res = await fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`);
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const data = (await res.json()).map(r => ({
        name: r.name, fork: r.fork, pushed: r.pushed_at, stars: r.stargazers_count,
        language: r.language, url: r.html_url, homepage: r.homepage,
    }));
    cacheSet(key, data);
    return data;
}

export async function getReadme(user, repo) {
    const key = `gh2:readme:${user}/${repo}`;
    const hit = cacheGet(key);
    if (hit) return hit;
    const res = await fetch(`https://api.github.com/repos/${user}/${repo}/readme`, {
        headers: { Accept: 'application/vnd.github.raw+json' },
    });
    if (!res.ok) throw new Error(`README ${res.status}`);
    const md = await res.text();
    cacheSet(key, md);
    return md;
}
