// Helper to parse OS, Browser, Device, and Bot signatures from User-Agent
function parseUserAgent(ua: string): {
  os: string;
  browser: string;
  device: string;
  isBot: boolean;
  botName?: string;
} {
  const uaLower = ua.toLowerCase();

  // 1. Bot, Proxy, and Crawler detection
  const botSignatures: Array<{ name: string; match: RegExp | string }> = [
    { name: "GitHub Camo Proxy", match: /github-camo/i },
    { name: "GitHub Hookshot", match: /github-hookshot/i },
    { name: "Googlebot", match: /googlebot/i },
    { name: "Bingbot", match: /bingbot/i },
    { name: "Discordbot", match: /discordbot/i },
    { name: "Twitterbot", match: /twitterbot/i },
    { name: "TelegramBot", match: /telegrambot/i },
    { name: "Slackbot", match: /slackbot/i },
    { name: "WhatsApp", match: /whatsapp/i },
    { name: "LinkedInBot", match: /linkedinbot/i },
    { name: "DuckDuckBot", match: /duckduckbot/i },
    { name: "YandexBot", match: /yandexbot/i },
    { name: "Baiduspider", match: /baiduspider/i },
    { name: "curl", match: /^curl/i },
    { name: "Wget", match: /^wget/i },
    { name: "python-requests", match: /python-requests/i },
    { name: "Postman", match: /postmanruntime/i },
    { name: "axios", match: /axios/i },
    { name: "undici / node-fetch", match: /(?:undici|node-fetch)/i },
    { name: "Headless Chrome", match: /headlesschrome/i },
    { name: "Lighthouse", match: /lighthouse/i }
  ];

  for (const bot of botSignatures) {
    if (typeof bot.match === "string" ? uaLower.includes(bot.match) : bot.match.test(ua)) {
      return {
        os: "Automated Service",
        browser: bot.name,
        device: bot.name.includes("Proxy") ? "🛡️ Proxy / CDN" : "🤖 Bot / Crawler",
        isBot: true,
        botName: bot.name
      };
    }
  }

  if (uaLower.includes("bot") || uaLower.includes("spider") || uaLower.includes("crawler")) {
    return {
      os: "Automated Service",
      browser: "Custom Bot",
      device: "🤖 Bot / Crawler",
      isBot: true,
      botName: "Web Crawler"
    };
  }

  // 2. Operating System & Device category detection
  let os = "Unknown OS";
  let device = "💻 Desktop";

  if (/windows nt 10\.0/i.test(ua)) os = "Windows 10/11";
  else if (/windows nt 6\.3/i.test(ua)) os = "Windows 8.1";
  else if (/windows nt 6\.2/i.test(ua)) os = "Windows 8";
  else if (/windows nt 6\.1/i.test(ua)) os = "Windows 7";
  else if (/windows/i.test(ua)) os = "Windows";
  else if (/android/i.test(ua)) {
    const match = ua.match(/android\s+([0-9.]+)/i);
    os = match ? `Android ${match[1]}` : "Android";
    device = /mobile/i.test(ua) ? "📱 Android Mobile" : "📱 Android Tablet";
  } else if (/iphone/i.test(ua)) {
    const match = ua.match(/os\s+([0-9_]+)\s+like\s+mac\s+os\s+x/i);
    os = match ? `iOS ${match[1].replace(/_/g, ".")}` : "iOS (iPhone)";
    device = "📱 Apple iPhone";
  } else if (/ipad/i.test(ua)) {
    const match = ua.match(/os\s+([0-9_]+)\s+like\s+mac\s+os\s+x/i);
    os = match ? `iPadOS ${match[1].replace(/_/g, ".")}` : "iPadOS";
    device = "📱 Apple iPad";
  } else if (/macintosh|mac os x/i.test(ua)) {
    const match = ua.match(/mac\s+os\s+x\s+([0-9_]+)/i);
    os = match ? `macOS ${match[1].replace(/_/g, ".")}` : "macOS";
    device = "💻 Mac Desktop/Laptop";
  } else if (/cros/i.test(ua)) {
    os = "ChromeOS";
    device = "💻 Chromebook";
  } else if (/ubuntu/i.test(ua)) {
    os = "Linux (Ubuntu)";
    device = "💻 Linux Desktop";
  } else if (/linux/i.test(ua)) {
    os = "Linux";
    device = "💻 Linux System";
  }

  // 3. Browser detection
  let browser = "Unknown Browser";
  if (/edg\/|edge\//i.test(ua)) {
    const match = ua.match(/edg(?:e)?\/([0-9.]+)/i);
    browser = match ? `Microsoft Edge ${match[1].split(".")[0]}` : "Microsoft Edge";
  } else if (/opr\/|opera\//i.test(ua)) {
    const match = ua.match(/(?:opr|opera)\/([0-9.]+)/i);
    browser = match ? `Opera ${match[1].split(".")[0]}` : "Opera";
  } else if (/chrome\/|crios\//i.test(ua)) {
    const match = ua.match(/(?:chrome|crios)\/([0-9.]+)/i);
    browser = match ? `Google Chrome ${match[1].split(".")[0]}` : "Google Chrome";
  } else if (/firefox\/|fxios\//i.test(ua)) {
    const match = ua.match(/(?:firefox|fxios)\/([0-9.]+)/i);
    browser = match ? `Firefox ${match[1].split(".")[0]}` : "Firefox";
  } else if (/safari\//i.test(ua) && !/chrome|crios/i.test(ua)) {
    const match = ua.match(/version\/([0-9.]+)/i);
    browser = match ? `Apple Safari ${match[1].split(".")[0]}` : "Apple Safari";
  }

  return {
    os,
    browser,
    device,
    isBot: false
  };
}

export default async function handler(req: any, res: any) {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = (typeof forwarded === "string" ? forwarded.split(",")[0].trim() : Array.isArray(forwarded) ? forwarded[0] : null) || req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
  const userAgent = req.headers["user-agent"] || "unknown";
  const referer = req.headers["referer"] || req.headers["referrer"] || "Direct";
  const target = req.query?.target || req.query?.repo || "GitHub Profile / README";

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl || !webhookUrl.startsWith("https://discord.com/api/webhooks/")) {
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0");
    return res.status(200).send(`<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" viewBox="0 0 1 1"><rect width="1" height="1" fill="none"/></svg>`);
  }

  try {
    const parsedUa = parseUserAgent(String(userAgent));

    // Base Geo structure with Vercel edge headers fallback
    let geo: {
      city: string;
      regionName: string;
      country: string;
      countryCode: string;
      zip?: string;
      lat?: number | null;
      lon?: number | null;
      timezone?: string;
      isp: string;
      org: string;
      as?: string;
      status: string;
    } = {
      city: req.headers["x-vercel-ip-city"] ? decodeURIComponent(req.headers["x-vercel-ip-city"]) : "Unknown",
      regionName: req.headers["x-vercel-ip-country-region"] ? decodeURIComponent(req.headers["x-vercel-ip-country-region"]) : "Unknown",
      country: req.headers["x-vercel-ip-country"] ? String(req.headers["x-vercel-ip-country"]) : "Unknown",
      countryCode: req.headers["x-vercel-ip-country"] ? String(req.headers["x-vercel-ip-country"]) : "",
      zip: "",
      lat: req.headers["x-vercel-ip-latitude"] ? parseFloat(req.headers["x-vercel-ip-latitude"]) : null,
      lon: req.headers["x-vercel-ip-longitude"] ? parseFloat(req.headers["x-vercel-ip-longitude"]) : null,
      timezone: req.headers["x-vercel-ip-timezone"] ? String(req.headers["x-vercel-ip-timezone"]) : "",
      isp: "Unknown",
      org: "Unknown",
      as: "",
      status: "fail"
    };

    const isLocal = !ip || ip === "127.0.0.1" || ip === "::1" || String(ip).startsWith("192.168.") || String(ip).startsWith("10.");
    if (!isLocal) {
      try {
        const geoRes = await fetch(`http://ip-api.com/json/${encodeURIComponent(String(ip))}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`, {
          signal: AbortSignal.timeout(3000)
        });
        if (geoRes.ok) {
          const data = await geoRes.json();
          if (data.status === "success") {
            geo = {
              city: data.city || geo.city,
              regionName: data.regionName || geo.regionName,
              country: data.country || geo.country,
              countryCode: data.countryCode || geo.countryCode,
              zip: data.zip || "",
              lat: typeof data.lat === "number" ? data.lat : geo.lat,
              lon: typeof data.lon === "number" ? data.lon : geo.lon,
              timezone: data.timezone || geo.timezone,
              isp: data.isp || geo.isp,
              org: data.org || geo.org,
              as: data.as || "",
              status: "success"
            };
          }
        }
      } catch (e) {
        console.warn("Geo lookup warning:", e);
      }
    } else {
      geo = {
        city: "Localhost",
        regionName: "Development",
        country: "Local System",
        countryCode: "DEV",
        zip: "000000",
        lat: 0,
        lon: 0,
        timezone: "Asia/Kolkata",
        isp: "Local Loopback",
        org: "Localhost",
        as: "AS0 Localhost",
        status: "success"
      };
    }

    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    // Format location details
    const locParts: string[] = [];
    if (geo.city && geo.city !== "Unknown") locParts.push(geo.city);
    if (geo.regionName && geo.regionName !== "Unknown") locParts.push(geo.regionName);
    if (geo.country && geo.country !== "Unknown") {
      locParts.push(geo.zip ? `${geo.country} (${geo.zip})` : geo.country);
    }
    const locationString = locParts.length > 0 ? locParts.join(", ") : "Location Lookup Unavailable";

    // Google Maps pin link if coordinates are valid
    const hasCoords = typeof geo.lat === "number" && typeof geo.lon === "number" && !isNaN(geo.lat) && !isNaN(geo.lon) && (geo.lat !== 0 || geo.lon !== 0);
    const mapCoordinates = hasCoords
      ? `\`${geo.lat!.toFixed(4)}, ${geo.lon!.toFixed(4)}\` [📍 View on Google Maps](https://www.google.com/maps?q=${geo.lat},${geo.lon})`
      : "Not Available";

    // ISP & Autonomous System details
    const ispString = geo.as
      ? `${geo.isp || geo.org || "Unknown"} (\`${geo.as.split(" ")[0]}\`)`
      : (geo.isp || geo.org || "Unknown ISP");

    // Dynamic embed theme color based on access type
    const embedColor = parsedUa.isBot
      ? 0xF59E0B // Amber for Bot/Camo
      : String(target).toLowerCase().includes("honeypot")
      ? 0xEF4444 // Red for Honeypot
      : String(target).toLowerCase().includes("github")
      ? 0x24292F // GitHub dark
      : 0x5865F2; // Discord Blurple for Portfolio

    const embedPayload = {
      username: "GitHub & Portfolio Radar",
      avatar_url: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      embeds: [
        {
          title: `🎯 ${target} Accessed`,
          color: embedColor,
          fields: [
            {
              name: "🌐 IP Address",
              value: `\`${ip}\``,
              inline: true
            },
            {
              name: "📍 Location",
              value: locationString,
              inline: true
            },
            {
              name: "🗺️ Coordinates",
              value: mapCoordinates,
              inline: false
            },
            {
              name: "💻 OS / Platform",
              value: `\`${parsedUa.os}\``,
              inline: true
            },
            {
              name: "🌐 Browser",
              value: `\`${parsedUa.browser}\``,
              inline: true
            },
            {
              name: "📱 Device Type",
              value: parsedUa.device,
              inline: true
            },
            {
              name: "🏢 Network / ISP",
              value: ispString,
              inline: true
            },
            {
              name: "🔗 Referrer",
              value: referer && referer !== "Direct" ? `\`${referer}\`` : "Direct / GitHub Camo",
              inline: true
            },
            {
              name: "⏰ Time (IST)",
              value: `\`${timestamp}\``,
              inline: true
            },
            {
              name: "📱 Raw User-Agent",
              value: `\`${String(userAgent).substring(0, 200)}\``,
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
    console.error("Discord telemetry error:", err);
  }

  // Return zero-cache transparent 1x1 SVG image
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  
  return res.status(200).send(`<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" viewBox="0 0 1 1"><rect width="1" height="1" fill="none"/></svg>`);
}
