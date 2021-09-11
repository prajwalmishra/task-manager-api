const nodemailer = require('nodemailer')

const mailfunc = async (email, name, cancel) => {
    //let testAccount = await nodemailer.createTestAccount()

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: 'prajwalmishra3698@gmail.com',
            pass: '8013218859@'
        },
    })

    const msg = {}

    if (cancel) {
        msg.subject = "We feel sorry that you've to leave us",
        msg.text = `Thanks for using the app ${name}. Could you tell us Why you want to quit.`
    } else {
        msg.subject = "Thanks for joining in!",
        msg.text = `Welcome to the app, ${name}. Let me know how you get along with the app`
    }

    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <prajwalmishra3698@gmail.com>', // sender address
        to: email, // list of receivers
        subject: msg.subject, // Subject line
        text: msg.text // plain text body
        //html: "<b>Hello world?</b>", // html body
      });
    
      //console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}    

module.exports = mailfunc
