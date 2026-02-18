const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
    let transporter;

    // Use Real SMTP if configured
    if (process.env.MAIL_HOST && process.env.MAIL_USER) {
        transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });
    } else {
        // Fallback to Ethereal (Test Account)
        console.log('[EmailService] No SMTP credentials found. Using Ethereal Test Account...');
        const testAccount = await nodemailer.createTestAccount();
        
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }

    try {
        const info = await transporter.sendMail({
            from: `"ResolvEd Admin" <${process.env.MAIL_USER || 'no-reply@resolv-ed.com'}>`,
            to,
            subject,
            html
        });
        
        console.log("Message sent: %s", info.messageId);
        
        // Log Ethereal Preview URL
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
           console.log('=================================================');
           console.log(' ✉️  EMAIL SENT (TEST MODE)');
           console.log(' 👉 Preview URL:', previewUrl);
           console.log('=================================================');
        }

        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        
        // Final fallback to console log
        console.log('=================================================');
        console.log(' [MANUAL LOG BACKUP] ');
        console.log(` To: ${to}`);
        console.log(` Subject: ${subject}`);
        console.log(html);
        console.log('=================================================');
        
        throw error;
    }
};

module.exports = { sendEmail };
