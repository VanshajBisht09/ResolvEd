module.exports = (collegeName, adminEmail, password, logoUrl) => {
    // Restore appUrl
    const appUrl = process.env.CLIENT_URL || "http://localhost:3000";
    
    // Ensure logoUrl is valid and public. If not, fallback to a placeholder.
    const safeLogoUrl = (logoUrl && (logoUrl.startsWith('http://') || logoUrl.startsWith('https://'))) 
        ? logoUrl 
        : "https://ui-avatars.com/api/?name=" + encodeURIComponent(collegeName) + "&background=random&color=fff&size=200";

    return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Welcome to ResolvEd</title>
    <!--[if mso]>
    <style type="text/css">
    body, table, td, a {font-family: Arial, Helvetica, sans-serif !important;}
    </style>
    <![endif]-->
    <style type="text/css">
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        
        body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Plus Jakarta Sans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased; }
        table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        td { padding: 0; }
        img { border: 0; display: block; outline: none; }
        
        .wrapper { width: 100%; table-layout: fixed; background-color: #f1f5f9; padding-bottom: 60px; }
        .main-table { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }

        /* Mobile Responsive */
        @media screen and (max-width: 600px) {
            .main-table { width: 100% !important; border-radius: 0 !important; }
            .content-padding { padding: 24px !important; }
            .mobile-block { display: block !important; width: 100% !important; }
            .mobile-center { text-align: center !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="wrapper">
        <tr>
            <td align="center" style="padding-top: 40px; padding-bottom: 40px;">
                
                <!-- Brand Header -->
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="margin-bottom: 24px;">
                    <tr>
                        <td align="center">
                            <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 800; color: #334155; letter-spacing: -0.5px;">
                                <span style="color: #4f46e5;">Resolv</span>Ed.
                            </div>
                        </td>
                    </tr>
                </table>

                <!-- Main Card -->
                <table border="0" cellpadding="0" cellspacing="0" width="600" class="main-table">
                    
                    <!-- Hero Section -->
                    <tr>
                        <td align="center" style="background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); padding: 48px 40px;">
                            ${safeLogoUrl ? `
                            <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                                <tr>
                                    <td align="center">
                                        <div style="background: white; padding: 12px; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
                                            <img src="${safeLogoUrl}" alt="${collegeName}" width="64" height="64" style="display: block; width: 64px; height: 64px; object-fit: contain;" />
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            ` : ''}
                            <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                                Welcome Aboard!
                            </h1>
                            <p style="margin: 12px 0 0 0; font-size: 16px; color: #e0e7ff; font-weight: 500;">
                                Your institution dashboard is ready using our premium setup.
                            </p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td class="content-padding" style="padding: 40px;">
                            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 26px; color: #334155;">
                                <strong>Hello Administrator,</strong>
                            </p>
                            <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 26px; color: #475569;">
                                We are thrilled to partner with <strong>${collegeName}</strong>. You now have full control to manage your campus, students, and subscriptions through the ResolvEd Super Admin Console.
                            </p>

                            <!-- Credentials Box -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 32px;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">
                                            ACCESS CREDENTIALS
                                        </div>
                                        
                                        <!-- User -->
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 12px;">
                                            <tr>
                                                <td width="32" style="padding-right: 12px;">
                                                    <span style="font-size: 18px;">📧</span>
                                                </td>
                                                <td>
                                                    <div style="font-size: 14px; color: #64748b; margin-bottom: 2px;">Email ID</div>
                                                    <div style="font-family: monospace; font-size: 15px; color: #0f172a; font-weight: 600;">${adminEmail}</div>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Divider -->
                                        <div style="height: 1px; background-color: #e2e8f0; margin: 12px 0;"></div>
                                        
                                        <!-- Pass -->
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td width="32" style="padding-right: 12px;">
                                                    <span style="font-size: 18px;">🔑</span>
                                                </td>
                                                <td>
                                                    <div style="font-size: 14px; color: #64748b; margin-bottom: 2px;">Temporary Password</div>
                                                    <div style="font-family: monospace; font-size: 15px; color: #0f172a; font-weight: 600; background: #e0e7ff; color: #4338ca; padding: 2px 6px; border-radius: 4px; display: inline-block;">${password}</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- CTA Button -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <a href="${appUrl}" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%); color: #ffffff; padding: 16px 48px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);">
                                            Login to Dashboard &rarr;
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 24px 0 0 0; text-align: center; font-size: 13px; color: #94a3b8;">
                                Note: This password expires in 24 hours. Change it immediately.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Next Steps -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 32px 40px; border-top: 1px solid #f1f5f9;">
                            <div style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">
                                NEXT STEPS
                            </div>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td valign="top" width="24" style="padding-right: 12px; padding-bottom: 12px;">
                                        <div style="width: 20px; height: 20px; background-color: #e0e7ff; color: #4338ca; border-radius: 50%; font-size: 12px; font-weight: 700; text-align: center; line-height: 20px;">1</div>
                                    </td>
                                    <td valign="top" style="padding-bottom: 12px; font-size: 14px; color: #475569;">
                                        Log in using the credentials above.
                                    </td>
                                </tr>
                                <tr>
                                    <td valign="top" width="24" style="padding-right: 12px; padding-bottom: 12px;">
                                        <div style="width: 20px; height: 20px; background-color: #e0e7ff; color: #4338ca; border-radius: 50%; font-size: 12px; font-weight: 700; text-align: center; line-height: 20px;">2</div>
                                    </td>
                                    <td valign="top" style="padding-bottom: 12px; font-size: 14px; color: #475569;">
                                        Navigate to <strong>Settings</strong> to update your profile.
                                    </td>
                                </tr>
                                <tr>
                                    <td valign="top" width="24" style="padding-right: 12px;">
                                        <div style="width: 20px; height: 20px; background-color: #e0e7ff; color: #4338ca; border-radius: 50%; font-size: 12px; font-weight: 700; text-align: center; line-height: 20px;">3</div>
                                    </td>
                                    <td valign="top" style="font-size: 14px; color: #475569;">
                                        Invite staff members and students.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <!-- Footer -->
                <table border="0" cellpadding="0" cellspacing="0" width="600">
                    <tr>
                        <td align="center" style="padding: 24px;">
                            <p style="margin: 0 0 8px 0; font-size: 13px; color: #94a3b8;">
                                &copy; ${new Date().getFullYear()} ResolvEd Platform.
                            </p>
                            <p style="margin: 0; font-size: 13px;">
                                <a href="#" style="color: #64748b; text-decoration: none; margin: 0 8px;">Help</a>
                                <a href="#" style="color: #64748b; text-decoration: none; margin: 0 8px;">Privacy</a>
                                <a href="#" style="color: #64748b; text-decoration: none; margin: 0 8px;">Unsubscribe</a>
                            </p>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>
</body>
</html>
    `;
};
