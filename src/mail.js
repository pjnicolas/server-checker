require('dotenv').config(); // Load the .env file in order to get the password
const nodemailer = require('nodemailer');
const config = require('../cfg.json');

const {email} = config;
const emailPassword = process.env.EMAIL_PASSWORD;

const serverConfig = {
  host: email.provider,
  port: email.port,
  secure: email.secure,
  auth: {
    user: email.sender,
    pass: emailPassword,
  },
};

const transporter = nodemailer.createTransport(serverConfig);

const sendMail = text => {
  if (typeof text !== 'string') {
    throw new TypeError('The argument must be a string');
  }

  for (const receiver of email.receivers) {
    const mailOptions = {
      from: email.sender,
      to: receiver.email,
      subject: receiver.subject,
      text,
    };

    console.log(mailOptions);

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return console.error(err); // TODO: Handle error
      }

      console.log('Message sent');
    });
  }

};

module.exports.sendMail = sendMail;
