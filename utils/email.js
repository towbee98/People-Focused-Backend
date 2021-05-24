const nodemailer = require("nodemailer");
//const dotenv = require("dotenv");

//dotenv.config({ path: "./../config.env" });

const sendEmail = async (options) => {
  //1.)Create a Transporter
  const transporter = await nodemailer.createTransport({
    host: process.env.Email_Host,
    port: process.env.Email_Port,
    auth: {
      user: process.env.Email_Username,
      pass: process.env.Email_Password,
    },
  });

  //2.)Define the email options
  const mailOptions = {
    from: "Oladele Tobiloba <tobiemma200@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //3.) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
