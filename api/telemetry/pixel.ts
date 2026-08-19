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
    let geo = {
      city: "Unknown",
      regionName: "Unknown",
      country: "Unknown",
      countryCode: "",
      isp: "Unknown",
      org: "Unknown",
      status: "fail"
    };

    const isLocal = !ip || ip === "127.0.0.1" || ip === "::1" || String(ip).startsWith("192.168.") || String(ip).startsWith("10.");
    if (!isLocal) {
      try {
        const geoRes = await fetch(`http://ip-api.com/json/${encodeURIComponent(String(ip))}?fields=status,country,countryCode,regionName,city,isp,org,query`, {
          signal: AbortSignal.timeout(3000)
        });
        if (geoRes.ok) {
          geo = await geoRes.json();
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
          title: `🎯 ${target} Accessed`,
          color: 0x5865F2,
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
              name: "🏢 Network / ISP",
              value: geo.isp || geo.org || "Unknown ISP",
              inline: false
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
              name: "📱 User Agent",
              value: `\`${String(userAgent).substring(0, 180)}\``,
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
