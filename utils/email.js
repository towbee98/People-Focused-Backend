const nodemailer = require("nodemailer");
const pug = require("pug");
const {convert}=require("html-to-text");

module.exports= class Email{
  constructor(user,url){
    this.to= user.email;
    this.firstName=user.firstName;
    this.url=url;
    this.from = `Oladele Tobiloba <${process.env.Email_from}>`;
  }

   newTransport(){
    if(process.env.NODE_ENV==="production"){
      //Gmail
    return 1
    }
    return  nodemailer.createTransport({
      host: process.env.Email_Host,
      port: process.env.Email_Port,
      auth: {
        user: process.env.Email_Username,
        pass: process.env.Email_Password,
      },
    });
  }
   //Send the actual email
  async send(template,subject){
   //1. Render html based on a pug template
   const html =pug.render(`./../views/emails/${template}.pug`,{
     firstName:this.firstName,
     url:this.url,
     subject,
   })
   //2. Define email options
   const mailOptions = {
    from: this.from,
    to: this.to,
    subject,
    html,
    text:convert(html,{wordwrap:130}),
  };
   //3. Define a transport and send email
   await this.newTransport().sendMail(mailOptions)
  }

  async sendWelcome(){
    await this.send("Welcome","Welcome to peopleFocusedNg.com")
  }
}


