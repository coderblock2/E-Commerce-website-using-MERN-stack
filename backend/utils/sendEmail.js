const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    // host: "smtp.gmail.com",
    // host: process.env.SMPT_HOST,
    // port: process.env.SMPT_PORT,
    port: 465,   
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,         // options.email, options.subject, options.message --> ye sb userController se aa rha hai ...ya le rhe hai ...
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
