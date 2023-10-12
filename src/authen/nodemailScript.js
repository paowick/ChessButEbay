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
      subject: "[ChessButEbay] Verify your email", // Subject line
      html: `<center><img src="https://drive.google.com/uc?export=view&id=1sS541yV_McPlRFz2ESFgAsK1xy9KJOao" width="600" height="200">
      <h1>Email Address Verification</h1>
      <h2>Before you can apply for membership, we need to verify that this email belongs to you.</h2>
      <h1>Code to verify your email address is ${code}</h1>
      <h3>Thank You For Signing Up</h3>
      </center>`// html body
      
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