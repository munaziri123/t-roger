import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins (or restrict to your frontend URL)
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end(); // No Content for preflight
  }

  // Allow CORS for actual requests
  res.setHeader('Access-Control-Allow-Origin', '*'); // Replace '*' with your frontend origin for better security

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, refId } = req.body;

  if (!name || !email || !refId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Muna Family" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: '🎉 Welcome to Muna Family!',
    text: `Hello ${name},\n\nYou are now registered to the Muna Family!\n\nYour reference number is: ${refId}\n\nThank you for joining us!\n\n– Muna Family Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return res.status(500).json({ success: false, message: 'Failed to send email', error });
  }
}
