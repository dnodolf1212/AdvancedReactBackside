import { createTransport, getTestMessageUrl } from "nodemailer";

//transporter - hooks up to an smtp API and send emails
const transport = createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function makeNiceEmail(text: string): string {
  return`
    <div style="
      border: 1px solid black;
      padding: 20px;
      font-family: sans-serif;
      line-height: 2;
      font-size: 20px;
      ">
      <h2>Yoyoyoyoyoyoyoyoyoyoyoyo!!!</h2>
      <p>${text}<p/>
      <p>Hugs, Dwight</p>
    </div>
  `
}

  export interface MailResponse {
    accepted?: (string)[] | null;
    rejected?: (null)[] | null;
    envelopeTime: number;
    messageTime: number;
    messageSize: number;
    response: string;
    envelope: Envelope;
    messageId: string;
  }
  export interface Envelope {
    from: string;
    to?: (string)[] | null;
  }
  


export async function sendPasswordResetEmail(
  resetToken: string, 
  to: string
  ): Promise <void> {
  //email token to user 
  const info = (await transport.sendMail({
    to, 
    from: 'test@example.com',
    subject: 'Here is your password reset token!',
    html: makeNiceEmail(`Your password reset token has arrived!
    
      <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click here to reset your password</a>
    `),
  })) as MailResponse;
  if(process.env.MAIL_USER.includes('ethereal.email')){
    console.log(`Message sent! Preview it at ${getTestMessageUrl(info)}`);
  }
}