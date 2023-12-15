const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// Please add email address and 16 code password in you env variables
const email = process.env.MAIL_ADDRESS;
const password = process.env.MAIL_PASSWORD;

const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:465,
    secure: true,
    auth: {
      user: email,
      pass: password,
    },
    tls : { rejectUnauthorized: false }
  });

async function sendMail(toEmail, body, html) {
    
    try {
      const mailOptions = {
        from: email,
        to: toEmail,
        subject: 'Test Email',
        text: body,
        html: html,
      };
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ', info.messageId);
    } catch (error) {
      console.error('Error sending email: ', error);
    }
  }
  
  module.exports = sendMail;