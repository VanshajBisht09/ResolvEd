module.exports = (memberName, collegeName, email, password, role, logoUrl) => {
  const year = new Date().getFullYear();
  const appUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const collegeLogo = logoUrl || ""; // Fallback if no logo

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Welcome to ${collegeName}</title>
  <style>
    /* Basic reset for email clients */
    html, body { margin:0; padding:0; }
    body {
      background: #f6f8fb;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
    }
    a { color: inherit; }

    .wrapper { padding: 24px 12px; }
    .container {
      max-width: 640px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(17, 24, 39, 0.06);
    }

    .header {
      padding: 22px 22px 18px;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 60%, #0ea5e9 100%);
      color: #ffffff;
      text-align: center;
    }
    .brand {
      display: inline-block;
      font-size: 12px;
      letter-spacing: .12em;
      text-transform: uppercase;
      opacity: .95;
      margin-bottom: 10px;
    }
    .logo-img {
      max-height: 60px;
      margin-bottom: 15px;
      background: white;
      padding: 5px;
      border-radius: 8px;
    }
    .title {
      margin: 0;
      font-size: 20px;
      line-height: 1.3;
      font-weight: 700;
    }
    .subtitle {
      margin: 8px 0 0;
      font-size: 14px;
      opacity: .95;
    }
    /* Rest of styles same... */
    .content { padding: 22px; }
    .greeting { margin-top: 0; }

    .card {
      margin: 16px 0;
      padding: 16px;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      background: #f9fafb;
    }
    .pill {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      background: rgba(37, 99, 235, 0.12);
      color: #1d4ed8;
      margin-left: 6px;
      vertical-align: middle;
    }

    .label { font-size: 12px; color: #6b7280; margin: 0 0 6px; }
    .mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      word-break: break-word;
    }
    .row { margin: 0 0 12px; }

    .btn {
      display: inline-block;
      text-decoration: none;
      background: #2563eb;
      color: #ffffff !important;
      padding: 12px 16px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 14px;
    }
    .btn:hover { filter: brightness(0.95); }

    .help {
      margin: 14px 0 0;
      font-size: 12px;
      color: #6b7280;
    }
    .divider {
      height: 1px;
      background: #e5e7eb;
      margin: 18px 0;
    }

    .footer {
      padding: 16px 22px 22px;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
      background: #ffffff;
    }
    .footer a { color: #2563eb; text-decoration: none; }
    .muted { color: #6b7280; }

    /* Mobile-friendly spacing */
    @media (max-width: 480px) {
      .wrapper { padding: 16px 10px; }
      .content, .footer, .header { padding-left: 16px; padding-right: 16px; }
      .title { font-size: 18px; }
    }
  </style>
</head>

<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        ${collegeLogo ? `<img src="${collegeLogo}" alt="${collegeName} Logo" class="logo-img" />` : `<div class="brand">ResolvEd</div>`}
        <h1 class="title">Welcome to ${collegeName} Portal</h1>
        <p class="subtitle">Your account has been created. You can sign in and start using the platform.</p>
      </div>

      <div class="content">
        <p class="greeting">Hello <strong>${memberName}</strong>,</p>

        <p>
          You’ve been added to <strong>${collegeName}</strong> on ResolvEd as
          <span class="pill">${role}</span>.
        </p>

        <div class="card">
          <p class="row"><strong>What you can do now</strong></p>
          <ul style="margin: 0; padding-left: 18px;">
            <li>View announcements and updates</li>
            <li>Submit and track complaints</li>
            <li>Access college communications in one place</li>
          </ul>
        </div>

        <div class="card">
          <p class="row"><strong>Login credentials</strong></p>

          <p class="label">Email</p>
          <div class="mono">${email}</div>

          <div class="divider"></div>

          <p class="label">Temporary password</p>
          <div class="mono">${password}</div>

          <p class="help">
            For security, please change your password after your first login.
          </p>
        </div>

        <p style="margin: 18px 0 10px;">
          <a class="btn" href="${appUrl}" target="_blank" rel="noopener noreferrer">Login to ResolvEd</a>
        </p>

        <p class="help">
          If the button doesn’t work, copy and paste this link into your browser:<br/>
          <span class="mono">${appUrl}</span>
        </p>
      </div>

      <div class="footer">
        <div>&copy; ${year} <strong>${collegeName}</strong> via ResolvEd.</div>
        <div class="muted">This is an automated message. Please do not reply.</div>
      </div>
    </div>
  </div>
</body>
</html>`;
};
