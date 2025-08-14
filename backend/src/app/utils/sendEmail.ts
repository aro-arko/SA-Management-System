import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.node_env === 'development',
    auth: {
      user: 'aroarko.sd@gmail.com',
      pass: 'hamf llyz rpuw fdqa',
    },
  });

  await transporter.sendMail({
    from: 'aroarko.sd@gmail.com',
    to,
    subject: 'Reset your password within ten mins!',
    text: '',
    html,
  });
};
