const nodemailer = require('nodemailer');

module.exports = async (event) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });

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
};
