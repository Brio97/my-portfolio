const fetch = require('node-fetch');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

exports.handler = async (event) => {
  const fullPath = event.path.replace('/.netlify/functions/api/', '');

  try {
    switch (fullPath) {
      case 'contact':
        const { name, email, message } = JSON.parse(event.body);
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: `Portfolio Contact from ${name}`,
          text: `From: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          html: `<strong>From:</strong> ${name}<br>
                 <strong>Email:</strong> ${email}<br><br>
                 <strong>Message:</strong><br>${message}`
        });
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ message: 'Email sent successfully' })
        };          

      case 'translate':
        const { q, target } = JSON.parse(event.body);
        const translateUrl = `https://translation.googleapis.com/language/translate/v2?key=${process.env.VITE_GOOGLE_TRANSLATE_API_KEY}`;
        const translateResponse = await fetch(translateUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ q, target })
        });
        const translateData = await translateResponse.json();
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(translateData)
        };

      case 'translate/languages':
        const languagesResponse = await fetch(`https://translation.googleapis.com/language/translate/v2/languages?key=${process.env.VITE_GOOGLE_TRANSLATE_API_KEY}&target=en`);
        const languagesData = await languagesResponse.json();
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(languagesData)
        };

      case 'weather':
        try {
          const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?${event.queryStringParameters.q ? `q=${event.queryStringParameters.q}` : `lat=${event.queryStringParameters.lat}&lon=${event.queryStringParameters.lon}`}&appid=${process.env.VITE_WEATHER_API_KEY}`;
          console.log('Weather URL:', weatherUrl); // For debugging
          const weatherResponse = await fetch(weatherUrl);
          if (!weatherResponse.ok) {
            throw new Error('Weather API response not ok');
          }
          const weatherData = await weatherResponse.json();
          return {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(weatherData)
          };
        } catch (error) {
          console.error('Weather API Error:', error);
          return {
            statusCode: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Weather service error', details: error.message })
          };
        }        

      case 'github':
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

      default:
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'Not Found', path: fullPath })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
