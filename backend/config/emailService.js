import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Gmail Configuration
let transporter = null;

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn("⚠️ EMAIL_USER or EMAIL_PASS not set in .env — emails will fail.");
} else {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

const FROM_EMAIL = process.env.EMAIL_USER || "support@learnix.com";

/* =========================
   SEND CONFIRMATION EMAIL TO USER
========================= */
export const sendContactConfirmationEmail = async (userEmail, userName) => {
  const msg = {
    to: userEmail,
    from: FROM_EMAIL,
    subject: "We received your inquiry - Learnix Support",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ff8c00 0%, #ff6b35 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0;">Thank You for Contacting Us!</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f5f5f5; border-radius: 0 0 10px 10px;">
          <p>Dear ${userName},</p>
          
          <p>Thank you for reaching out to us! We have received your inquiry and will get back to you as soon as possible, typically within 24 hours.</p>
          
          <div style="background-color: white; padding: 15px; border-left: 4px solid #ff8c00; margin: 20px 0;">
            <p style="margin: 0; color: #666;"><strong>What's Next?</strong></p>
            <p style="margin: 10px 0 0 0; color: #666;">Our support team is reviewing your message. You will receive a response at this email address shortly.</p>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            If you don't receive a response within 24 hours, please check your spam folder or contact us directly at support@elearnhub.com
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          
          <p style="color: #999; font-size: 12px; margin: 0;">
            Best regards,<br/>
            <strong>Learnix Support Team</strong><br/>
            E-LearnHub Learning Center, Chennai
          </p>
        </div>
      </div>
    `,
  };

  try {
    if (!transporter) {
      throw new Error("Email transporter not configured. Set EMAIL_USER and EMAIL_PASS in .env");
    }
    await transporter.sendMail(msg);
    console.log(`✅ Confirmation email sent to ${userEmail}`);
  } catch (err) {
    console.error(`❌ Error sending confirmation email to ${userEmail}:`, err.message);
    throw err;
  }
};

/* =========================
   SEND REPLY EMAIL TO USER
========================= */
export const sendReplyEmail = async (recipientEmail, subject, message, emailType = "Response") => {
  const msg = {
    to: recipientEmail,
    from: FROM_EMAIL,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ff8c00 0%, #ff6b35 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0;">${emailType}</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f5f5f5; border-radius: 0 0 10px 10px;">
          <div style="background-color: white; padding: 15px; border-left: 4px solid #ff8c00; margin: 20px 0; white-space: pre-wrap; word-wrap: break-word;">
            ${message}
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          
          <p style="color: #999; font-size: 12px; margin: 0;">
            Best regards,<br/>
            <strong>Learnix Support Team</strong><br/>
            E-LearnHub Learning Center, Chennai
          </p>
        </div>
      </div>
    `,
  };

  try {
    if (!transporter) {
      throw new Error("Email transporter not configured. Set EMAIL_USER and EMAIL_PASS in .env");
    }
    await transporter.sendMail(msg);
    console.log(`✅ Email sent to ${recipientEmail}`);
  } catch (err) {
    console.error(`❌ Error sending email to ${recipientEmail}:`, err.message);
    throw err;
  }
};

/* =========================
   TEST EMAIL FUNCTION (for development)
========================= */
export const testEmail = async (testEmail) => {
  const msg = {
    to: testEmail,
    from: FROM_EMAIL,
    subject: "Test Email - Learnix",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Test Email Configuration</h2>
        <p>This is a test email to verify your SendGrid configuration is working correctly.</p>
        <p style="color: #ff8c00;"><strong>✓ Email service is configured successfully!</strong></p>
      </div>
    `,
  };

  try {
    if (!transporter) {
      throw new Error("Email transporter not configured. Set EMAIL_USER and EMAIL_PASS in .env");
    }
    await transporter.sendMail(msg);
    console.log(`✅ Test email sent to ${testEmail}`);
    return true;
  } catch (err) {
    console.error(`❌ Test email failed:`, err.message);
    throw err;
  }
};
