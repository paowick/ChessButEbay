import nodemailer from "nodemailer"

// config
const transporter = nodemailer.createTransport({
  host: "mail",
  port: 587,
  secure: false, // upgrade later with STARTTLS
});

let mailOptions = {
      from: "korn2k9@gmail.com", // sender address
      to: "korn2k9@gmail.com", // list of receivers
      subject: "test" , // Subject line
      text: "test", // plain text body
      html: "<h1>test<h1/>"// html body
    };

export async function testsend() {
    transporter.sendMail(mailOptions,
      (error, info) => {
        console.log(info);
      });
}

export async function test(){
// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

}