import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, message,html = null) => {
  try {
    console.log("Try to send email");
    
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_SMTP_HOST,
      port: process.env.MAILTRAP_SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASS,
      },
    });


    const info = await transporter.sendMail({
      from: "Inngest TMS <noreply@inngest.com>",
      to,
      subject,
      text:message,
      html, 
    });

  console.log("Message sent:", info.messageId);
  return info;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};
