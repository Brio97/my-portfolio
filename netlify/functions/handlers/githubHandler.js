const fetch = (await import('node-fetch')).default;

const githubHandler = async () => {
  const githubResponse = await fetch('https://api.github.com/user/repos?per_page=100&page=1&type=all', {
    headers: {
      'Authorization': `token ${process.env.VITE_GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  const githubData = await githubResponse.json();
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(githubData)
  };
};

module.exports = githubHandler;