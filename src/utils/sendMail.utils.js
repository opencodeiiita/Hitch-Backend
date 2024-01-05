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

async function sendMail(toEmail,subject, body, html) {
    
    try {
      const mailOptions = {
        from: email,
        to: toEmail,
        subject: subject,
        text: body,
        html: html,
      };
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ', info.messageId);
    } catch (error) {
      console.error('Error sending email: ', error);
    }
  }

  async function sendVerificationMail(toEmail,username,verificationId) {
    const subject = "Verify Your Email";
    const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email/${verificationId}`;

    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email verification template</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
                font-family: 'Roboto', sans-serif;
            }
            #main {
                width: 70vw;
                max-width: 35rem;
                height: 55vh;
                margin:auto;
                box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
                border-radius: 10px;
                margin-top: 20vh;
                align-items: center;
                justify-content: center;
            }
            #main h3 {
                display: block;
                height: 2.5rem;
                font-size: 1.3rem;
                color: #ffc728;
                text-align: center;
                /* line-height: 2rem; */
                background-color: #1b1633;
                border-radius: 10px 10px 10px 10px;
                padding-top:6px;
            }
    
            #main .cp {
                margin-top: 2rem;
                color: #1b1633f4;
                padding: .5rem;
                line-height: 1.5rem;
            }
            .name {
                font-weight: 500;
                font-size: 1.2rem;
            }
            .content{
                font-size: 1.1rem;
                color: #1b1633d2;
            }
            .button {
                width: 70%;
                background-color: #1b1633;
                color: #fff;
                margin: auto;
                text-align: center;
                padding: 10px;
                font-size: 1.3rem;
                border-radius: 20px 20px 20px 20px;
                cursor: pointer;
                margin-top: 1rem;
            }
            footer {
                font-size: .9rem;
                width: 70vw;
                max-width: 35rem;
                margin: auto;
                color: #1b1633d8;
            }
    
        </style>
    </head>
    <body>
        <div id="main">
            <h3>Verify this email address</h3>
            <div class="cp">
            <p class="name">Hello ${username},</p>
            <br>
            <p class="content">We're excited to have you onboard <strong>Hitch</strong>! Before you begin your journey, we need to verify your account. Please click on the button below.</p>
            <br>
            <a href="${verificationLink}"> <div class="button"> Verify Email</div></a>
        </div>
        </div>
        <br><br><br>
        <footer> *You can ignore this if you did not signup for it.</footer>
        
    </body>
    </html>
    `;

    
    try {
      const mailOptions = {
        from: email,
        to: toEmail,
        subject: subject,
        html: html,
      };
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ', info.messageId);
    } catch (error) {
      console.error('Error sending email: ', error);
    }
  }
  
  module.exports = {sendMail,sendVerificationMail};