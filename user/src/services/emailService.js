import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendSOSMail = async ({
  to,
  userName,
  locationUrl,
  battery,
}) => {
  await transporter.sendMail({
    from: `"CareOn SOS" <${process.env.EMAIL_FROM}>`,
    to,
    subject: "🚨 Emergency Alert",
    html: `
      <h2>Emergency Alert</h2>
      <p><strong>${userName}</strong> may need urgent help.</p>

      <p>📍 Location: 
      <a href="${locationUrl}">Open Live Location</a></p>

      <p>🔋 Battery: ${battery}%</p>

      <p>Please contact immediately.</p>
    `,
  });
};