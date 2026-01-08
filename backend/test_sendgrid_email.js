import { testEmail } from "./config/emailService.js";

const testEmailAddress = process.env.EMAIL_USER || "test@example.com";

console.log(`\n📧 Testing Gmail email configuration...`);
console.log(`📤 Sending test email to: ${testEmailAddress}\n`);

testEmail(testEmailAddress)
  .then(() => {
    console.log(`\n✅ Test email sent successfully!`);
    console.log(`📨 Check your inbox (${testEmailAddress}) for the test email.`);
    console.log(`💡 If not in inbox, check spam folder.\n`);
    process.exit(0);
  })
  .catch(err => {
    console.error(`\n❌ Test email failed!`);
    console.error(`Error details:`, err.message || err);
    console.error(`\n🔍 Troubleshooting tips:`);
    console.error(`  1. Check EMAIL_USER and EMAIL_PASS in backend/.env`);
    console.error(`  2. Verify you have 2-Factor Authentication enabled on Google Account`);
    console.error(`  3. Use App Password (16 chars), NOT your regular Gmail password`);
    console.error(`  4. Email format should be: your-email@gmail.com`);
    console.error(`  5. App Password format: xxxx xxxx xxxx xxxx (with spaces)\n`);
    process.exit(1);
  });
