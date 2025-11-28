// server.js
import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

// Helpful logger for requests (small)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Simple health/test endpoints
app.get("/", (req, res) => {
  res.send("Social Downloader Backend Running");
});

app.get("/facebook/test", (req, res) => {
  res.send("Facebook endpoint working!");
});

// POST /facebook
// Expects JSON body: { "url": "https://www.facebook.com/..." }
app.post("/facebook", async (req, res) => {
  try {
    const { url } = req.body || {};
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "No URL provided" });
    }

    // Example API (snapinsta) — adjust if you use another API
    const apiUrl = `https://api.snapinsta.app/api/facebook?url=${encodeURIComponent(
      url
    )}`;

    // axios with timeout + basic headers to avoid being blocked
    const response = await axios.get(apiUrl, {
      timeout: 15000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115.0 Safari/537.36",
        Accept: "application/json",
      },
    });

    // check structure safely
    const data = response?.data || null;
    if (!data || !data.media || !data.media[0] || !data.media[0].url) {
      console.warn("facebook: unexpected API response", data);
      return res.status(404).json({ error: "Video not found or blocked" });
    }

    return res.json({
      success: true,
      download: data.media[0].url,
      meta: data.media[0].meta || null,
    });
  } catch (err) {
    console.error("Error in /facebook:", err?.message || err);
    // If axios error with status, include useful info
    if (err?.response) {
      console.error("Upstream status:", err.response.status, err.response.data);
    }
    return res.status(502).json({ error: "Server error fetching video" });
  }
});

// Fallback 404 for clarity
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Start server using Railway-provided PORT or 3000 locally
const PORT = parseInt(process.env.PORT, 10) || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
