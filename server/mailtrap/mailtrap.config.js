const { MailtrapClient } = require("mailtrap");
const dotenv = require("dotenv");

dotenv.config();

const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
});

const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Burak",
};

module.exports = { mailtrapClient, sender };
