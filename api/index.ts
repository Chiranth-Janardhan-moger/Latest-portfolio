export default async function handler(req: any, res: any) {
  const url = req.url || "/";
  const method = req.method || "GET";

  const forwarded = req.headers["x-forwarded-for"];
  const ip = (typeof forwarded === "string" ? forwarded.split(",")[0].trim() : Array.isArray(forwarded) ? forwarded[0] : null) || req.headers["x-real-ip"] || req.socket?.remoteAddress || "127.0.0.1";
  const userAgent = req.headers["user-agent"] || "unknown";

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (method === "OPTIONS") {
    return res.status(200).end();
  }

  // 1. IP resolution
  if (url.startsWith("/api/my-ip")) {
    return res.status(200).json({ ip });
  }

  // 2. Visits counter
  if (url.startsWith("/api/visits")) {
    return res.status(200).json({ count: 1254 });
  }

  // 3. Custom blogs
  if (url.startsWith("/api/blogs/custom")) {
    return res.status(200).json({ posts: [] });
  }

  // 4. Security endpoints
  if (url.startsWith("/api/security/test")) {
    return res.status(200).json({
      success: true,
      mode: "block",
      status: "active",
      message: "SQLGuardJS active heuristics verified.",
      timestamp: new Date().toISOString()
    });
  }

  if (url.startsWith("/api/security/logs")) {
    return res.status(200).json({ logs: [] });
  }

  // 5. Contact form submission
  if (url.startsWith("/api/contact")) {
    const body = req.body || {};
    return res.status(200).json({
      success: true,
      message: "Submission received.",
      submission: {
        id: Math.random().toString(36).substring(2, 9),
        name: body.name || "Anonymous",
        createdAt: new Date().toISOString()
      }
    });
  }

  // 6. Telemetry pixel fallback
  if (url.startsWith("/api/telemetry") || url.startsWith("/api/track")) {
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0");
    return res.status(200).send(`<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" viewBox="0 0 1 1"><rect width="1" height="1" fill="none"/></svg>`);
  }

  // 7. Honeypot routes
  const HONEYPOT_ROUTES = [
    "/admin", "/.env", "/wp-admin", "/wp-login.php", "/.git",
    "/config", "/config.json", "/administrator", "/.env.local",
    "/.env.production", "/etc/passwd"
  ];

  const isHoneypot = HONEYPOT_ROUTES.some(route => url.startsWith(route));
  if (isHoneypot) {
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    
    // Non-blocking Discord alert if configured
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (webhookUrl && webhookUrl.startsWith("https://discord.com/api/webhooks/")) {
      try {
        fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: "SQLGuard Security Trap",
            embeds: [{
              title: `🚨 Honeypot Trap Triggered: ${url}`,
              color: 0xEF4444,
              fields: [
                { name: "🌐 IP Address", value: `\`${ip}\``, inline: true },
                { name: "⏰ Time", value: `\`${timestamp}\``, inline: true },
                { name: "📱 User Agent", value: `\`${String(userAgent).substring(0, 180)}\``, inline: false }
              ],
              timestamp: new Date().toISOString()
            }]
          }),
          signal: AbortSignal.timeout(3000)
        }).catch(() => {});
      } catch (_) {}
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(418).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HONEYPOT DETECTED // SQLGUARD SHIELD</title>
  <style>
    body {
      background-color: #FFFFFF;
      color: #111111;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 2.5rem 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
    }
    .card {
      max-width: 560px;
      width: 100%;
      background: #FFFFFF;
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 24px;
      box-shadow: 0 24px 60px -12px rgba(0, 0, 0, 0.08);
      padding: 2rem;
    }
    .pill {
      display: inline-block;
      padding: 4px 12px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #DC2626;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }
    h1 { font-size: 1.5rem; margin: 0 0 0.5rem; }
    p { color: #6B6B6B; font-size: 0.875rem; line-height: 1.5; margin-bottom: 1.5rem; }
    .box {
      background: #F9F9FB;
      border: 1px solid #E5E7EB;
      border-radius: 12px;
      padding: 1rem;
      font-family: monospace;
      font-size: 0.8rem;
      margin-bottom: 1.5rem;
    }
    .btn-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    @media (min-width: 640px) {
      .btn-group {
        flex-direction: row;
      }
    }
    a.btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #111111;
      color: #FFFFFF;
      text-decoration: none;
      padding: 10px 18px;
      border-radius: 9999px;
      font-weight: 600;
      font-size: 0.825rem;
    }
    a.btn-secondary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #FFFFFF;
      color: #111111;
      border: 1px solid rgba(0, 0, 0, 0.15);
      text-decoration: none;
      padding: 10px 18px;
      border-radius: 9999px;
      font-weight: 600;
      font-size: 0.825rem;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="pill">HONEYPOT TRAP ACTIVATED</div>
    <h1>Unauthorized Access Captured</h1>
    <p>This path is a monitored security honeypot. Your connection metadata has been logged by the SQLGuardJS security engine.</p>
    <div class="box">
      <div><strong>IP:</strong> ${ip}</div>
      <div><strong>Target:</strong> ${url}</div>
      <div><strong>Timestamp:</strong> ${timestamp}</div>
    </div>
    <div class="btn-group">
      <a href="https://cftweb-security.vercel.app/" target="_blank" rel="noopener noreferrer" class="btn-primary">Want to play CTF? Launch Challenge ↗</a>
      <a href="/" class="btn-secondary">Return to Portfolio</a>
    </div>
  </div>
</body>
</html>`);
  }

  // Default API fallback
  return res.status(200).json({ status: "ok", service: "chiranth-portfolio-api", timestamp: new Date().toISOString() });
}
