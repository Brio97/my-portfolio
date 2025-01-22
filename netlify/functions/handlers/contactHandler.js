const nodemailer = require('nodemailer');

const handler = async (event) => {
  // Log incoming request
  console.log('Received contact request:', event.body);

  try {
    // Validate environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      throw new Error('Missing email configuration');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });

    // Validate request body
    const { name, email, message } = JSON.parse(event.body);
    if (!name || !email || !message) {
      throw new Error('Missing required fields');
    }

    // Test email connection
    await transporter.verify();

    // Send emails
    const ownerMailResult = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Portfolio Contact from ${name}`,
      text: `From: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    });

    console.log('Owner email sent:', ownerMailResult);

    const replyMailResult = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Brian Mutai',
      text: `Dear ${name},\n\nThank you for reaching out. I will get back to you within 24 hours.\n\nBest regards,\nBrian Mutai`
    });

    console.log('Reply email sent:', replyMailResult);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        message: 'Contact form submitted successfully',
        ownerMail: ownerMailResult.messageId,
        replyMail: replyMailResult.messageId
      })
    };
  } catch (error) {
    console.error('Contact form error:', {
      message: error.message,
      stack: error.stack,
      event: event.body
    });

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Contact form submission failed',
        details: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};

module.exports = handler;