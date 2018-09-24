require('dotenv').config(); // Load the .env file in order to get the password
const nodemailer = require('nodemailer');
const {email: defaultConfig} = require('../cfg.json');
const type = require('./type');

const defaultPassword = process.env.EMAIL_PASSWORD;

/**
 * Check if the config is ok. If called with no params, it will load the default configuration.
 *
 * @param {object} paramConfig Optional. The config.
 *
 * @returns {object} The loaded and/or checked configuration.
 */
const loadConfig = paramConfig => {
  let config;

  if (type.null(paramConfig)) {
    config = defaultConfig;
    config.password = defaultPassword;
  } else if (type.object(paramConfig)) {
    config = paramConfig;
  } else {
    throw new TypeError('"paramConfig" must be an object');
  }

  if (!(type.notEmptyString(config.provider) &&
      type.notEmptyString(config.sender) &&
      type.notEmptyString(config.password) &&
      type.boolean(config.secure) &&
      type.array(config.receivers) &&
      type.integer(config.port))) {
    throw new TypeError('Error in "config" object fields');
  }

  for (const receiver of config.receivers) {
    if (!(type.notEmptyString(receiver.email) && type.string(receiver.email))) {
      throw new TypeError('Error in "receivers" object fields');
    }
  }

  return config;
};

const loadTransporter = config => {
  const serverConfig = {
    host: config.provider,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.sender,
      pass: config.password,
    },
  };

  const transporter = nodemailer.createTransport(serverConfig);

  return transporter;
};

/**
 * Send an email.
 *
 *
 * @param {string} text The body of the email
 * @param {object} config The config of the email
 *
 * @returns {[Promise] || false} False if the there was an error establishing the connection with
 * the email provider. Otherwise, an array of promises, one per receiver.
 */
const sendMail = (text, config) => {
  if (typeof text !== 'string') {
    throw new TypeError('The argument must be a string');
  }

  let transporter;
  try {
    config = loadConfig(config);
    transporter = loadTransporter(config);
  } catch (error) {
    console.error(error);
    return false;
  }

  const promises = [];
  for (const receiver of config.receivers) {
    const mailOptions = {
      from: config.sender,
      to: receiver.email,
      subject: receiver.subject,
      text,
    };

    const response = transporter.sendMail(mailOptions);
    promises.push(response);
  }

  transporter.close();

  return promises;
};

module.exports.sendMail = sendMail;
