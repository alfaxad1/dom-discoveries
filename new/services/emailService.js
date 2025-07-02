const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',  
    port: 465,             
    secure: true,          
    auth: {
        user: process.env.GMAIL_USER,  
        pass: process.env.GMAIL_PASS,  
    },
});

async function sendOtpEmail(recipientEmail, otp) {
  

  const mailOptions = {
    from: '"Vacation Masters" <info@va.ke>',
    to: recipientEmail,
    subject: 'Charge24 OTP Code',
    text: `Your verification code is ${otp}. It will expire in 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
}

async function sendCustomerEmailOptions (recipientEmail, message) {
   
  const mailOptions = {
    from: '"Vacation Masters" <info@vacationmasters.co.ke>',
    to: recipientEmail,
    subject: 'Booking Confirmation - Tour Booking',
    text: message,
  };

  await transporter.sendMail(mailOptions);
}

async function adminEmailOptions (recipientEmail, message) {
   
  const mailOptions = {
    from: '"Vacation Masters" <info@vacationmasters.co.ke>',
    to: recipientEmail,
    subject: 'New Booking Received',
    text: message,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendCustomerEmailOptions, adminEmailOptions };
