import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
const templatePath = path.resolve("src/emailTemplates");
import logger from "../utils/logger.js";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
  DEV_SMTP_HOST,
  DEV_SMTP_PORT,
  DEV_SMTP_USER,
  DEV_SMTP_PASS,
  DEV_SMTP_FROM,
} = process.env;

const hbsOptions = {
  viewEngine: {
    extname: ".handlebars",
    partialsDir: templatePath,
    defaultLayout: false,
  },
  viewPath: templatePath,
  extName: ".handlebars",
};

let transporter;
let testAccount;

if ("development" === process.env.NODE_ENV) {
  // Generate test SMTP service account
  testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: DEV_SMTP_HOST || testAccount.smtp.host,
    port: DEV_SMTP_PORT || testAccount.smtp.port,
    secure: false,
    auth: {
      user: DEV_SMTP_USER || testAccount.user,
      pass: DEV_SMTP_PASS || testAccount.pass,
    },
  });
} else {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

transporter.use("compile", hbs(hbsOptions));

/**
 * Sends an email using nodemailer
 * @param {string} to - recipient email address
 * @param {string} subject - subject line of the email
 * @param {string} template - name of the email template to use
 * @param {Object} context - context to pass to the email template
 */
async function sendMail({ to, subject, template, context }) {
  try {
    const info = await transporter.sendMail({
      from: DEV_SMTP_FROM || SMTP_FROM,
      to,
      subject,
      template,
      context,
    });

    logger.info("Message sent: " + JSON.stringify(info, null, 2));

    if ("development" === process.env.NODE_ENV) {
      logger.info("Preview URL: " + nodemailer.getTestMessageUrl(info));
    }
  } catch (err) {
    logger.error("Error sending email: " + err.message);
  }
}

export default sendMail;
