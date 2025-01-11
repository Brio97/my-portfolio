export const fetchGithubRepos = async () => {
    const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
    let allRepos = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const response = await fetch(`https://api.github.com/user/repos?per_page=100&page=${page}&type=all`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${GITHUB_TOKEN}`
            }
        });

        if (!response.ok) {
            console.error('GitHub API Error:', await response.text());
            break;
        }

        const repos = await response.json();
        if (repos.length === 0) {
            hasMore = false;
        } else {
            allRepos = [...allRepos, ...repos];
            page++;
        }
    }

    const projectRepos = allRepos.filter(repo => {
        const name = repo.name.toLowerCase();
        const excludePatterns = ['config', '.github', 'setup', 'template'];
        return !excludePatterns.some(pattern => name.includes(pattern));
    });

    return projectRepos.map(repo => ({
        name: repo.name,
        description: repo.description || 'A cool project',
        technologies: [repo.language].filter(Boolean),
        homepage: repo.homepage,
        html_url: repo.html_url,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        isPrivate: repo.private
    }));
};