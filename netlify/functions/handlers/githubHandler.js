const fetch = require('node-fetch');

const githubHandler = async (event) => {
  const token = process.env.VITE_GITHUB_TOKEN;
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch('https://api.github.com/user/repos', { headers });
  const data = await response.json();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data)
  };
};

module.exports = githubHandler;