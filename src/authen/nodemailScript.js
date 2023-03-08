import nodemailer from "nodemailer"

import * as dotenv from 'dotenv'
dotenv.config()

// config
const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  service: process.env.SERVICE,
  port: 465,
  secure: true, // upgrade later with STARTTLS
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});


export async function sendVerifycode(email,code) {
  try {
    let mailOptions = {
      from: "ChessButEbay@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Verify Code <ChessButEbay>", // Subject line
      html: `<h1>your code is ${code}<h1/>`// html body
    };
    transporter.sendMail(mailOptions,
      (error, info) => {
        console.log(info);
        console.log(error);
      });
  } catch(e) {
    throw Error(e)
  }
}

export async function test() {
  // verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

}