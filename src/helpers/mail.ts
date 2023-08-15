import nodemailer from 'nodemailer';
import { config } from '../config';

const sendMail = async (to, subject, html) => {
  const host = config.get('/config/nodemailer/host');
  const port = config.get('/config/nodemailer/port');

  try {
    const testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    let info = await transporter.sendMail({
      to: to,
      from: 'email@example.com',//TODO::email
      subject: subject,
      html: html
    });

    console.log(nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.log(err.message);
  }
}

export default sendMail