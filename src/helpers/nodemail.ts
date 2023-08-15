import nodemailer from 'nodemailer';
import { config } from '../config';
import Email from 'email-templates';
import path from 'path';

const host = config.get('/nodemailer/host');
const port = config.get('/nodemailer/port');
const user = config.get('/nodemailer/auth/user');
const pass = config.get('/nodemailer/auth/pass');

const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: false, // true for 465, false for other ports
    auth: {
        user: user, // generated ethereal user
        pass: pass, // generated ethereal password
    },
});

const email = new Email({
    message: {
        from: 'no-reply@vakeelonline.pk',
    },
    transport: transporter,
    views: {
        options: {
            extension: 'ejs',
        },
    },
    send: true,
});

const sendEmail = async (to, template, object) => {
    return email
        .send({
            template: path.join(__dirname, '../../src', 'emails', template),
            // template: template,
            message: {
                to: to,
            },
            locals: object,
        })
        .then((data) => {
            console.log('Success');
        })
        .catch((err) => {
            console.log('ERROR', err);
        });
};

export default sendEmail;
