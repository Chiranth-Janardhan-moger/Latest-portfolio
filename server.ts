import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { sqlguardjs } from "sqlguardjs";
import rateLimit from "express-rate-limit";

dotenv.config();

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
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

    :root {
      --color-paper: #FFFFFF;
      --color-ink: #111111;
      --color-ink-soft: #6B6B6B;
      --color-line: #E7E3D8;
      --color-cream: #F7F4EC;
    }

    body {
      background-color: var(--color-paper);
      color: var(--color-ink);
      font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 2rem 1rem;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      box-sizing: border-box;
    }

    .card {
      max-width: 600px;
      width: 100%;
      background-color: var(--color-paper);
      border: 1px solid var(--color-line);
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(17, 17, 17, 0.04);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .card-header {
      background-color: var(--color-cream);
      border-bottom: 1px solid var(--color-line);
      padding: 1.25rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-icon {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #EF4444; /* Alert color */
      flex-shrink: 0;
    }

    .header-title {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--color-ink);
    }

    .card-content {
      padding: 2rem 1.5rem;
    }

    h1 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-top: 0;
      margin-bottom: 0.75rem;
      letter-spacing: -0.02em;
      color: var(--color-ink);
    }

    .description {
      font-size: 0.95rem;
      line-height: 1.6;
      color: var(--color-ink-soft);
      margin-bottom: 1.5rem;
    }

    .info-box {
      background-color: var(--color-cream);
      border: 1px solid var(--color-line);
      border-radius: 8px;
      padding: 1.25rem;
      margin-bottom: 2rem;
      /* Slightly offset visual effect */
      transform: translate(2px, 2px);
      box-shadow: -2px -2px 0px var(--color-line);
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      padding: 0.5rem 0;
      border-bottom: 1px dashed var(--color-line);
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--color-ink-soft);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
    }

    .info-value {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--color-ink);
      word-break: break-all;
      text-align: right;
    }

    .ctf-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      box-sizing: border-box;
      padding: 0.85rem 1.5rem;
      background-color: var(--color-ink);
      color: var(--color-paper);
      border: 1px solid var(--color-ink);
      border-radius: 6px;
      text-decoration: none;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      transition: all 0.2s ease-out;
    }

    .ctf-button:hover {
      background-color: var(--color-ink-soft);
      border-color: var(--color-ink-soft);
      transform: translateY(-1px);
    }

    .ctf-button:active {
      transform: translateY(0);
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="card-header">
      <div class="header-icon"></div>
      <div class="header-title">Security Honeypot Shield Active</div>
    </div>
    <div class="card-content">
      <h1>Nice try. This is a honeypot.</h1>
      <p class="description">Your request triggered our security honeypot. We log resource probes targeting non-public systems to better protect the core platform.</p>
      
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
          <span class="info-value">SQLGuardJS (Armed)</span>
        </div>
      </div>
      
      <a href="https://cftweb-security.vercel.app/" class="ctf-button" target="_blank" rel="noopener noreferrer">
        Want to play CTF? Click here
      </a>
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
