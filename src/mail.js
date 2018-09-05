const nodemailer = require('nodemailer');
const key = require('./mail-key.json');

const transporter = nodemailer.createTransport({
  host: 'gmail',
  auth: {
    user: key.email,
    password: key.password,
  },
});

const mailOptions = {
  from: key.email,
  to: key.to,
  subject: '',
  text: '',
};

const sendMail = (subject, text) => {
  if (typeof subject !== 'string' || typeof text !== 'string') {
    throw new TypeError('The arguments must be strings');
  }

  const newMailOptions = JSON.parse(JSON.stringify(mailOptions));
  newMailOptions.subject = subject;
  newMailOptions.text = text;

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.error(err);
    }

    console.log('Message sent');

  });
};

module.exports.sendMail = sendMail;
