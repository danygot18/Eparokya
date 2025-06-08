// const nodemailer = require('nodemailer');

// const sendEmail = async options => {
//     const transporter = nodemailer.createTransport({
//         host: process.env.SMTP_HOST,
//         port: process.env.SMTP_PORT,
//         auth: {
//             user: process.env.SMTP_EMAIL,
//             pass: process.env.SMTP_PASSWORD
//         }
//     });

//     const message = {
//         from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
//         to: options.email,
//         subject: options.subject,
//         html: `<p>${options.message}</p>`
//     }

//     await transporter.sendMail(message)
// }

// module.exports = sendEmail;

// Gmail Nodemailer
const nodemailer = require("nodemailer");

const sendEmail = async ({ email, subject, message }) => {
  try {

    // console.log("Attempting to send email...");
    // console.log("GMAIL_USER:", process.env.GMAIL_USER);
    // console.log("GMAIL_APP_PASSWORD (first 5 chars):", process.env.GMAIL_APP_PASSWORD ? process.env.GMAIL_APP_PASSWORD.substring(0, 5) + '...' : 'Not set'); 

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"E:Parokya" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: subject,
      html: message,
    });

    console.log("Email sent successfully to", email);
  } catch (error) {
    console.error("Email sending error:", error.message);
    throw error; 
  }
};
module.exports = sendEmail;
