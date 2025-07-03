import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*'); // For development you can specify your domain here
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins, change in production

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, refId } = req.body;

  if (!name || !email || !refId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Configure nodemailer with Gmail and your app password
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD, // App Password generated in Gmail Security Settings
    },
  });

  const mailOptions = {
    from: `"Muna Family" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: '🎉 Welcome to Muna Family!',
    text: `Hello ${name},\n\nYou are now registered to the Muna Family!\nYour reference number is: ${refId}\n\nThank you for joining us!\n\n– Muna Family Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
