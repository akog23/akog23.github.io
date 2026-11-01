// GitHub API helpers.
// The public API allows 60 requests/hour per visitor IP, so responses are cached in
// sessionStorage for 30 minutes and the projects page needs only ONE request.

const CACHE_TTL_MS = 30 * 60 * 1000;

function readCache(key) {
    try {
        const raw = sessionStorage.getItem(key);
        if (!raw) return null;
        const { time, data } = JSON.parse(raw);
        if (Date.now() - time > CACHE_TTL_MS) return null;
        return data;
    } catch {
        return null;
    }
}

function writeCache(key, data) {
    try {
        sessionStorage.setItem(key, JSON.stringify({ time: Date.now(), data }));
    } catch {
        /* storage unavailable or full: ignore */
    }
}

export async function fetchGitHubRepos(username) {
    const key = `gh:repos:${username}`;
    const cached = readCache(key);
    if (cached) return cached;

    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    if (!response.ok) throw new Error(`GitHub API ${response.status}`);

    const repos = (await response.json())
        .filter(r => !r.fork && !r.archived)
        .map(r => ({
            name: r.name,
            description: r.description,
            language: r.language,
            updated_at: r.pushed_at || r.updated_at,
            html_url: r.html_url,
            homepage: r.homepage,
            stars: r.stargazers_count,
        }));

    writeCache(key, repos);
    return repos;
}

// Returns the raw README markdown (no base64 decoding needed with the "raw" media type).
export async function fetchRepoReadme(username, repoName) {
    const key = `gh:readme:${username}/${repoName}`;
    const cached = readCache(key);
    if (cached) return cached;

    const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/readme`, {
        headers: { Accept: 'application/vnd.github.raw+json' },
    });
    if (!response.ok) throw new Error(`README ${response.status}`);

    const markdown = await response.text();
    writeCache(key, markdown);
    return markdown;
}
