// ===============================
// SIMPLE NODE.JS PROXY SERVER
// ===============================

const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();

app.use(cors());

// ===============================
// MAIN PROXY ENDPOINT
// ===============================

app.get("/proxy", async (req, res) => {
    const target = req.query.url;

    if (!target) {
        return res.status(400).send("Missing ?url=");
    }

    try {
        const response = await fetch(target, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        let body = await response.text();

        // ===============================
        // URL REWRITING
        // ===============================

        const base = new URL(target);

        // Rewrite absolute URLs
        body = body.replace(/https?:\/\/[^"'\s]+/g, (match) => {
            return `/proxy?url=${encodeURIComponent(match)}`;
        });

        // Rewrite relative URLs
        body = body.replace(/(src|href)="([^"]+)"/g, (full, attr, url) => {
            if (url.startsWith("http")) return `${attr}="/proxy?url=${encodeURIComponent(url)}"`;
            if (url.startsWith("//")) return `${attr}="/proxy?url=${encodeURIComponent("https:" + url)}"`;

            const absolute = new URL(url, base).href;
            return `${attr}="/proxy?url=${encodeURIComponent(absolute)}"`;
        });

        res.send(body);

    } catch (err) {
        console.error("Proxy error:", err);
        res.status(500).send("Proxy failed");
    }
});

// ===============================
// START SERVER
// ===============================

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
