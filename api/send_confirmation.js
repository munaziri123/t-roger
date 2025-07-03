import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, refId, category } = req.body;

  // Debug environment variables
  console.log("ENV SENDER_EMAIL:", process.env.SENDER_EMAIL);
  console.log("ENV SENDER_PASSWORD:", process.env.SENDER_PASSWORD ? "✅ Set" : "❌ Not Set");

  if (!process.env.SENDER_EMAIL || !process.env.SENDER_PASSWORD) {
    return res.status(500).json({ message: 'Missing email credentials' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"T-Roger Family" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: '🎉 Welcome to T-Roger Family Competition!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 10px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://raw.githubusercontent.com/munaziri123/t-roger/main/public/react.jpg" alt="T-Roger Logo" width="100" />
          <h2 style="color:rgb(99, 10, 18);">Welcome to T-Roger Talent Family Competition 🎉</h2>
        </div>

        <p>Dear <strong>${name}</strong>,</p>

        <p>
          We are thrilled to welcome you to the <strong>T-Roger Family</strong>! You are successfully registered to perform as a:
          <br/>
          <span style="font-size: 16px; font-weight: bold; color: #1d3557;">${category}</span>
        </p>

        <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #457b9d; background-color: #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
          <p style="margin: 0;">
            <strong>Your Registration Number:</strong><br/>
            <span style="font-size: 20px; color: #2a9d8f; font-weight: bold;">${refId}</span>
          </p>
        </div>

        <p style="color: #333;">
          📲 To complete your registration, please pay your registration fee using <strong>MoMo code: <span style="color: #e76f51;">12345</span></strong>.
          <br/>
          Once your payment is confirmed, you will receive your participation badge and a confirmation message.
        </p>

        <p>Let’s make your talent shine on the biggest stage! 🌟</p>

        <div style="margin-top: 30px; font-size: 13px; color: #888;">
          <hr/>
          <p style="text-align: center;">© 2025 T-Roger Family | Kigali, Rwanda</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Email sending failed', error: error.message });
  }
}
