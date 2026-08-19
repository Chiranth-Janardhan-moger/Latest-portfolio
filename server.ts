import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { sqlguardjs } from "sqlguardjs";
import rateLimit from "express-rate-limit";

dotenv.config();
if (!process.env.DISCORD_WEBHOOK_URL && fs.existsSync("D:/.env")) {
  dotenv.config({ path: "D:/.env" });
}
if (!process.env.DISCORD_WEBHOOK_URL && fs.existsSync("C:/Users/Chiranth/.env")) {
  dotenv.config({ path: "C:/Users/Chiranth/.env" });
}

const app = express();
const PORT = 3000;

// Enable native trust proxy for accurate behind-reverse-proxy IP resolution
app.set("trust proxy", true);

// Body parser
app.use(express.json());

// Initialize Rate Limiters for Security/Quota Protection
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 3 requests per 15 minutes
  standardHeaders: true, // Return rate limit info in standard headers
  legacyHeaders: false, // Disable legacy X-RateLimit-* headers
  message: {
    error: "Rate limit exceeded. Maximum 3 contact submissions allowed every 15 minutes to prevent spam.",
  }
});

// Initialize SQLGuardJS Heuristic Protection Middleware
const guard = sqlguardjs({
  mode: "block",
  level: "balanced",
  logRequests: true,
  maxLogs: 100,
  scanHeaders: false,
  scanCookies: false,
  logAttacks: (event) => {
    console.warn("[SQLGuardJS Threat Blocked]:", event);
  }
});

// Register Global Guard
app.use(guard.global());

// In-memory store for contact form submissions and blog posts (transient, perfect for this prototype)
interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  publishedAt: string;
  readingTime: string;
  tags: string[];
}

const contactSubmissions: ContactSubmission[] = [];
const customBlogPosts: BlogPost[] = [];

// In-memory visit and security logs store

// API routes first
// Cybersecurity Honeypot Routes
const HONEYPOT_ROUTES = [
  "/admin",
  "/.env",
  "/wp-admin",
  "/wp-login.php",
  "/.git",
  "/config",
  "/config.json",
  "/administrator",
  "/.env.local",
  "/.env.production",
  "/etc/passwd"
];

app.get("/api/my-ip", (req, res) => {
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  res.json({ ip });
});

app.use(HONEYPOT_ROUTES, (req, res) => {
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const userAgent = req.headers["user-agent"] || "unknown";
  const timestamp = new Date().toISOString();

  res.status(418).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HONEYPOT DETECTED // SQLGUARD SHIELD</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');

    :root {
      --color-paper: #FFFFFF;
      --color-ink: #111111;
      --color-ink-soft: #6B6B6B;
      --color-line: #E7E3D8;
      --color-cream: #F7F5EE;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #FFFFFF;
      color: var(--color-ink);
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif;
      padding: 2.5rem 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    .apple-card {
      max-width: 560px;
      width: 100%;
      background: #FFFFFF;
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 28px;
      box-shadow: 0 24px 60px -12px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.02);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(12px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .card-header {
      background: rgba(245, 244, 240, 0.6);
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      padding: 1rem 1.4rem;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .traffic-lights {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .dot {
      width: 11px;
      height: 11px;
      border-radius: 50%;
    }

    .dot-red { background-color: #FF5F56; border: 1px solid rgba(224, 68, 62, 0.4); }
    .dot-yellow { background-color: #FFBD2E; border: 1px solid rgba(222, 161, 35, 0.4); }
    .dot-green { background-color: #27C93F; border: 1px solid rgba(26, 171, 41, 0.4); }

    .header-title {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      color: var(--color-ink-soft);
    }

    .card-content {
      padding: 2rem 1.6rem;
    }

    .alert-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #DC2626;
      border-radius: 9999px;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.7rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .ping-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #EF4444;
    }

    h1 {
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.025em;
      color: var(--color-ink);
      margin-bottom: 0.5rem;
    }

    .description {
      font-size: 0.88rem;
      line-height: 1.55;
      color: var(--color-ink-soft);
      margin-bottom: 1.5rem;
    }

    .info-box {
      background: rgba(0, 0, 0, 0.025);
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-radius: 18px;
      padding: 1.1rem 1.25rem;
      margin-bottom: 1.75rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      padding: 0.45rem 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--color-ink-soft);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
    }

    .info-value {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.76rem;
      font-weight: 500;
      color: var(--color-ink);
      word-break: break-all;
      text-align: right;
    }

    .status-active {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      color: #059669;
      font-weight: 600;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10B981;
    }

    @keyframes sweep {
      0% { left: -150%; }
      50% { left: 150%; }
      100% { left: 150%; }
    }

    .btn-sweep {
      position: relative !important;
      overflow: hidden !important;
    }

    .btn-sweep::after {
      content: '';
      position: absolute;
      top: 0;
      left: -150%;
      width: 50%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.6),
        transparent
      );
      transform: skewX(-20deg);
      pointer-events: none;
    }

    .btn-sweep:hover::after {
      animation: sweep 1.2s infinite ease-in-out;
    }

    .btn-cluster {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      width: 100%;
    }

    .apple-pill-btn {
      width: 100%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1rem;
      background-color: var(--color-ink);
      color: var(--color-paper);
      border: 1px solid var(--color-ink);
      border-radius: 9999px;
      text-decoration: none;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: -0.01em;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      white-space: nowrap;
    }

    .apple-pill-btn:hover {
      background-color: #262626;
      border-color: #262626;
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.16);
    }

    .apple-pill-btn:active {
      transform: scale(0.98);
    }

    .apple-secondary-btn {
      width: 100%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 0.75rem;
      background: rgba(255, 255, 255, 0.9);
      color: var(--color-ink);
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 9999px;
      text-decoration: none;
      font-size: 0.8rem;
      font-weight: 600;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      white-space: nowrap;
    }

    .apple-secondary-btn:hover {
      background-color: #FFFFFF;
      border-color: var(--color-ink);
      transform: translateY(-1px);
    }

    .apple-secondary-btn:active {
      transform: scale(0.98);
    }

    @media (min-width: 640px) {
      .btn-cluster {
        flex-direction: row;
      }
      .apple-pill-btn {
        flex: 0.65;
        width: 65%;
      }
      .apple-secondary-btn {
        flex: 0.35;
        width: 35%;
      }
    }
  </style>
</head>
<body>
  <div class="apple-card">
    <div class="card-header">
      <div class="traffic-lights">
        <div class="dot dot-red"></div>
        <div class="dot dot-yellow"></div>
        <div class="dot dot-green"></div>
      </div>
      <div class="header-title">honeypot_shield // telemetry_trap</div>
    </div>
    <div class="card-content">
      <div class="alert-pill">
        <span class="ping-dot"></span>
        <span>Honeypot Triggered</span>
      </div>

      <h1>Nice try. This is a honeypot.</h1>
      <p class="description">Your request triggered our security honeypot trap. Resource probes targeting private administrative namespaces are recorded to harden defenses.</p>
      
      <div class="info-box">
        <div class="info-row">
          <span class="info-label">Probed Route</span>
          <span class="info-value">${req.originalUrl}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Source IP</span>
          <span class="info-value">${ip}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Client Agent</span>
          <span class="info-value">${userAgent}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Timestamp</span>
          <span class="info-value">${timestamp}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Defense Core</span>
          <span class="info-value status-active"><span class="status-dot"></span> SQLGuardJS Armed</span>
        </div>
      </div>
      
      <div class="btn-cluster">
        <a href="https://cftweb-security.vercel.app/" class="apple-pill-btn btn-sweep" target="_blank" rel="noopener noreferrer">
          <span>Want to play CTF? Launch Challenge</span>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 6px; flex-shrink: 0;">
            <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
        <a href="/" class="apple-secondary-btn">
          Return to Portfolio
        </a>
      </div>
    </div>
  </div>
</body>
</html>`);
});

// Total visit counter (increments on every page visit call, perfect for a live tracking experience)
let totalVisits = 0;
const visitsFilePath = path.join(process.cwd(), "visits.txt");

try {
  if (fs.existsSync(visitsFilePath)) {
    const content = fs.readFileSync(visitsFilePath, "utf8").trim();
    totalVisits = parseInt(content, 10) || 0;
  }
} catch (e) {
  console.warn("Could not read visits file:", e);
}

app.get("/api/visits", (req, res) => {
  totalVisits++;
  try {
    fs.writeFileSync(visitsFilePath, totalVisits.toString(), "utf8");
  } catch (e) {
    // Silent fail on read-only file systems (like Vercel production)
    console.warn("Could not write visits file:", e);
  }
  res.json({ count: totalVisits });
});

// Live-testing endpoint scanned by the global SQLGuardJS middleware
app.post("/api/security/test", (req, res) => {
  const { payload } = req.body;
  res.json({
    success: true,
    message: "Payload successfully verified. No malicious patterns detected by SQLGuardJS.",
    received: payload
  });
});

// Telemetry and Discord Webhook Notification System
interface TelemetryData {
  target: string;
  ip: string;
  userAgent: string;
  referer: string;
  path: string;
}

async function sendDiscordNotification(data: TelemetryData) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl || !webhookUrl.startsWith("https://discord.com/api/webhooks/")) {
    console.log(`[Telemetry Access]: Target="${data.target}" IP="${data.ip}" Time="${new Date().toISOString()}"`);
    return;
  }

  try {
    let geo = {
      city: "Unknown",
      regionName: "Unknown",
      country: "Unknown",
      countryCode: "",
      isp: "Unknown",
      org: "Unknown",
      status: "fail"
    };

    const isLocal = !data.ip || data.ip === "127.0.0.1" || data.ip === "::1" || data.ip.startsWith("192.168.") || data.ip.startsWith("10.");
    if (!isLocal) {
      const geoRes = await fetch(`http://ip-api.com/json/${encodeURIComponent(data.ip)}?fields=status,country,countryCode,regionName,city,isp,org,query`, {
        signal: AbortSignal.timeout(3500)
      });
      if (geoRes.ok) {
        geo = await geoRes.json();
      }
    } else {
      geo = {
        city: "Localhost",
        regionName: "Development",
        country: "Local System",
        countryCode: "DEV",
        isp: "Local Loopback",
        org: "Localhost",
        status: "success"
      };
    }

    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const locationString = geo.status === "success" 
      ? `${geo.city}, ${geo.regionName}, ${geo.country}`
      : "Location Lookup Unavailable";

    const embedPayload = {
      username: "GitHub Radar Telemetry",
      avatar_url: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      embeds: [
        {
          title: `🎯 ${data.target} Accessed`,
          color: 0x5865F2,
          fields: [
            {
              name: "🌐 IP Address",
              value: `\`${data.ip}\``,
              inline: true
            },
            {
              name: "📍 Location",
              value: locationString,
              inline: true
            },
            {
              name: "🏢 Network / ISP",
              value: geo.isp || geo.org || "Unknown ISP",
              inline: false
            },
            {
              name: "🔗 Referrer",
              value: data.referer && data.referer !== "Direct" ? `\`${data.referer}\`` : "Direct / GitHub Camo",
              inline: true
            },
            {
              name: "⏰ Time (IST)",
              value: `\`${timestamp}\``,
              inline: true
            },
            {
              name: "📱 User Agent",
              value: `\`${data.userAgent.substring(0, 180)}\``,
              inline: false
            }
          ],
          footer: {
            text: "Portfolio & GitHub Telemetry Engine"
          },
          timestamp: new Date().toISOString()
        }
      ]
    };

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(embedPayload),
      signal: AbortSignal.timeout(4000)
    });
  } catch (err) {
    console.error("[Telemetry]: Error dispatching Discord alert:", err);
  }
}

// GitHub Tracking Pixel & Live Telemetry Endpoint
app.get(["/api/telemetry/pixel.svg", "/api/telemetry/pixel.png", "/api/track/github.svg"], (req, res) => {
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() || req.socket.remoteAddress || "unknown";
  const userAgent = req.headers["user-agent"] || "unknown";
  const referer = req.headers["referer"] || "Direct";
  const target = (req.query.target as string) || (req.query.repo as string) || "GitHub Profile / README";

  sendDiscordNotification({
    target,
    ip,
    userAgent,
    referer,
    path: req.originalUrl
  });

  // Return zero-cache transparent 1x1 SVG image
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  
  res.send(`<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" viewBox="0 0 1 1"><rect width="1" height="1" fill="none"/></svg>`);
});

// Logs endpoint for SQLGuardJS
app.get("/api/security/logs", guard.logsHandler());

app.post("/api/contact", contactLimiter, (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  const submission: ContactSubmission = {
    id: Math.random().toString(36).substring(2, 9),
    name,
    email,
    subject: subject || "No Subject",
    message,
    createdAt: new Date().toISOString(),
  };

  contactSubmissions.push(submission);
  console.log("New contact form submission received:", submission);
  res.json({ success: true, submission });
});

// Retrieve dynamic custom posts
app.get("/api/blogs/custom", (req, res) => {
  res.json({ posts: customBlogPosts });
});

// Explicit search indexing assets for SEO crawlers
app.get("/robots.txt", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "robots.txt"));
});

app.get("/sitemap.xml", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "sitemap.xml"));
});

// Setup Vite Dev server middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT} with Node ${process.version}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
