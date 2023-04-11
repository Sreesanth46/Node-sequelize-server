const nodemailer = require('nodemailer');
require("dotenv").config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: `${process.env.MAIL_USER}`,
    pass: `${process.env.MAIL_PASSWORD}`
  }
});

exports.sendMail = async (htmlBody, sendTo, subject) => {
  if (!process.env.NODE_MAILER) {
    return null;
  }

  let mailOptions = {
    from: 'Annotation Tool <annotationtool46@gmail.com>',
    to: sendTo,
    subject: subject,
    html: htmlBody,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}