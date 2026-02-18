const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Subscriber = require('../models/Subscriber');

// Gmail SMTP transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // vibhudixit88@gmail.com
        pass: process.env.EMAIL_PASS  // Gmail App Password (16 chars)
    }
});

// Email HTML template (matching Swipe2Clean design)
function getEmailHTML(recipientEmail) {
    const unsubscribeLink = `https://vibhudixit.in/unsubscribe?email=${encodeURIComponent(recipientEmail)}`;

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0; padding:0; background-color:#f5f5f5; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:20px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.1);">
            <!-- Header -->
            <tr>
                <td style="background: linear-gradient(135deg, #0F6C95, #0a4f6e); padding:20px 30px; text-align:center;">
                    <h1 style="color:#ffffff; margin:0; font-size:22px;">🧹 Swipe2Clean</h1>
                </td>
            </tr>
            <!-- Body -->
            <tr>
                <td style="padding:30px;">
                    <h2 style="color:#2e7d32; margin-top:0;">Namaste First 🙏</h2>

                    <p style="color:#333; line-height:1.6;">
                        🌍 Thank you for being a valued part of <strong>Swipe2Clean</strong>.
                    </p>

                    <p style="color:#333; line-height:1.6;">
                        🔴 <strong>Please be informed:</strong><br>
                        ⏱ <strong>Your garbage pickup truck will arrive in approx. 10 minutes.</strong>
                    </p>

                    <p style="color:#333; line-height:1.6;">
                        📦 Kindly place your waste bins outside your house for smooth collection.
                    </p>

                    <hr style="border:none; border-top:1px solid #eee; margin:20px 0;">

                    <p style="color:#333; line-height:1.6;">
                        🌏 Here's your daily tip to keep India cleaner and greener:
                    </p>

                    <ul style="color:#555; line-height:2;">
                        <li>🌿 Reduce plastic, reuse items, and always recycle.</li>
                        <li>🧹 Participate in local clean-up drives to inspire others.</li>
                        <li>🚫 Do not litter in public spaces — every action counts.</li>
                    </ul>

                    <p style="color:#333; line-height:1.6;">
                        📢 <a href="https://vibhudixit.in/#Events" style="color:#0F6C95; text-decoration:none; font-weight:bold;">Click here for updates on upcoming events &amp; rallies.</a>
                    </p>

                    <hr style="border:none; border-top:1px solid #eee; margin:20px 0;">

                    <p style="color:#888; font-size:13px; line-height:1.6;">
                        ❗ <strong>Eco Tip:</strong> Please do not print this email unless necessary.<br>
                        🙌 Stay safe, stay clean — together we build a better tomorrow!
                    </p>

                    <p style="color:#333; line-height:1.6; margin-bottom:0;">
                        ~ Team <strong>Swipe2Clean</strong>
                    </p>
                </td>
            </tr>
            <!-- Footer -->
            <tr>
                <td style="background:#f9f9f9; padding:15px 30px; text-align:center; border-top:1px solid #eee;">
                    <p style="color:#999; font-size:12px; margin:0;">
                        You received this because you subscribed at <a href="https://vibhudixit.in" style="color:#0F6C95;">vibhudixit.in</a><br>
                        <a href="${unsubscribeLink}" style="color:#999; text-decoration:underline;">Unsubscribe</a>
                    </p>
                </td>
            </tr>
        </table>
    </body>
    </html>`;
}

// Send email to a single subscriber
async function sendNotificationEmail(subscriberEmail) {
    const mailOptions = {
        from: `"Swipe2Clean" <${process.env.EMAIL_USER}>`,
        to: subscriberEmail,
        subject: '🚛 Hello! Your Swipe2Clean Garbage Pickup Is Near!',
        html: getEmailHTML(subscriberEmail)
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to: ${subscriberEmail}`);
    } catch (error) {
        console.error(`❌ Failed to send email to ${subscriberEmail}:`, error.message);
    }
}

// Send daily emails to all active subscribers
async function sendDailyEmails() {
    console.log('📧 Starting daily email job...');
    try {
        const subscribers = await Subscriber.find({ active: true });
        console.log(`Found ${subscribers.length} active subscribers.`);

        for (const sub of subscribers) {
            await sendNotificationEmail(sub.email);
            // Small delay between emails to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log('📧 Daily email job completed!');
    } catch (error) {
        console.error('📧 Daily email job failed:', error);
    }
}

// Start the cron scheduler
function startEmailScheduler() {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('⚠️ EMAIL_USER or EMAIL_PASS not set. Email scheduler NOT started.');
        return;
    }

    // Schedule: Daily at 10:00 AM IST (Asia/Kolkata)
    cron.schedule('0 10 * * *', () => {
        console.log('⏰ Cron triggered: 10:00 AM IST — Sending daily emails...');
        sendDailyEmails();
    }, {
        timezone: 'Asia/Kolkata'
    });

    console.log('📧 Email scheduler started! Will send at 10:00 AM IST daily.');
}

module.exports = { startEmailScheduler, sendDailyEmails };
