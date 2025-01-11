export const fetchGithubRepos = async () => {
    // Fetch all repos including those you've contributed to
    const response = await fetch('https://api.github.com/users/Brio97/repos?sort=updated&type=all&per_page=10', {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch GitHub repos');
    }
  
    const repos = await response.json();
    
    // Sort repos by engagement metrics (stars, forks, watchers)
    const sortedRepos = repos.sort((a, b) => {
      const scoreA = a.stargazers_count + a.forks_count + a.watchers_count;
      const scoreB = b.stargazers_count + b.forks_count + b.watchers_count;
      return scoreB - scoreA;
    });
  
    // Take top 4 repos
    return sortedRepos.slice(0, 4).map(repo => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      homepage: repo.homepage,
      html_url: repo.html_url,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count
    }));
  };  