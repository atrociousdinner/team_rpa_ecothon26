import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: `${process.env.EMAIL}`,
    pass: `${process.env.SENDMAIL_PASSWORD}`,
  },
})

export default async function sendMail(to:string,toUsername:string,otp:number):Promise<void> {
  
  try{
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"altEco" <${process.env.EMAIL}>`, //sender
      to,  //receiver
      subject:'Your OTP for Account Registration', 
      text:'',
      html:`Dear ${toUsername},<br>
      Thank you for registering with altEco.<br>
      To complete your registration, please use the following One-Time Password:<br>
      <h4>${otp}</h4><br>
      The One-Time Password is valid for 2 minutes. If you did not initiate this request, please disregard this email.<br><br>
      Best regards,<br>
      altEco Team`
    })
    console.log("Message sent: %s", info.messageId)
  }
  catch(e){
    console.error(e)
  }
  
}

// export const sendMailPasswordChange = async (to,otp) => {
//  try{
//     const info = await transporter.sendMail({
//       from: `"KUConnect" <${process.env.EMAIL}>`, //sender
//       to,  //receiver
//       subject:'Reset Your Password', 
//       text:'',
//       html: `Dear User,<br>
//       We received a request to reset your password for your KUConnect account.<br>
//       To proceed with resetting your password, please use the following One-Time Password (OTP):<br>
//       <h4>${otp}</h4><br>
//       If you did not request a password reset, please ignore this email.<br><br>
//       Best regards,<br>
//       KUConnect Team`   
//     })
//     console.log("Message sent: %s", info.messageId)
//   }
//   catch(e){
//     console.log(e)
//   }
//
// }
