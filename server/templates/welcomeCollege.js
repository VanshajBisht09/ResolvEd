module.exports = (collegeName, adminEmail, password) => {
    const appUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const logoUrl = "https://resolved-platform.com/logo.png"; // Replace with actual hosted logo if available

    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 20px auto; padding: 0; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
        .logo { max-height: 50px; margin-bottom: 10px; }
        .content { padding: 30px; }
        .button { display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
        .credentials { background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #2563eb; margin: 20px 0; }
        .footer { background-color: #eee; padding: 15px; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <!-- <img src="${logoUrl}" alt="ResolvEd Logo" class="logo"> -->
            <h1>Welcome to ResolvEd</h1>
        </div>
        <div class="content">
            <p>Dear Administrator,</p>
            <p>We are thrilled to onboard <strong>${collegeName}</strong> to the ResolvEd platform.</p>
            <p>Your college dashboard is now ready. You can manage your students, staff, and subscription from a single place.</p>
            
            <div class="credentials">
                <p><strong>Here are your initial login credentials:</strong></p>
                <p><strong>Email:</strong> ${adminEmail}</p>
                <p><strong>Temporary Password:</strong> ${password}</p>
            </div>
            
            <p>Please login and change your password immediately.</p>
            <center><a href="${appUrl}" class="button">Login to Dashboard</a></center>
        </div>
        <div class="footer">
            &copy; ${new Date().getFullYear()} ResolvEd. All rights reserved.
        </div>
    </div>
</body>
</html>
`;
};
