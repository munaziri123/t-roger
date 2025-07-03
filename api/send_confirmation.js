import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, refId } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Muna Family" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: 'Welcome to Muna Family 🎉',
      text: `Hi ${name},\n\nYou are registered to Muna Family. Your reference number is: ${refId}\n\nThanks!`,
    });

    return res.status(200).json({ success: true, message: 'Email sent' });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ success: false, message: 'Email failed to send' });
  }
}
