import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

// =========================
// TEST ROUTES
// =========================
app.get("/", (req, res) => {
    res.send("Social Downloader Backend Running");
});

app.get("/facebook/test", (req, res) => {
    res.send("Facebook endpoint working!");
});

// =========================
// FACEBOOK DOWNLOADER
// =========================
app.post("/facebook", async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.json({ error: "No URL provided" });

        const api = `https://fbdownloader-api.vercel.app/api?url=${encodeURIComponent(url)}`;

        const response = await axios.get(api, {
            headers: { "User-Agent": "Mozilla/5.0" }
        });

        if (!response.data || !response.data.download) {
            return res.json({ error: "Video not found" });
        }

        return res.json({
            success: true,
            download: response.data.download[0].url
        });

    } catch (error) {
        console.error("Facebook fetch error:", error.message);
        res.json({ error: "Server error fetching video" });
    }
});

// =========================
// INSTAGRAM DOWNLOADER
// =========================
app.post("/instagram", async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.json({ error: "No URL provided" });

        const api = `https://instagram-downloader-api.vercel.app/api?url=${encodeURIComponent(url)}`;

        const response = await axios.get(api, {
            headers: { "User-Agent": "Mozilla/5.0" }
        });

        if (!response.data || !response.data.url) {
            return res.json({ error: "Video not found" });
        }

        return res.json({
            success: true,
            download: response.data.url
        });

    } catch (error) {
        console.error("Instagram fetch error:", error.message);
        res.json({ error: "Server error fetching video" });
    }
});

// =========================
// TIKTOK DOWNLOADER
// =========================
app.post("/tiktok", async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.json({ error: "No URL provided" });

        const api = `https://tiktok-download-api.vercel.app/?url=${encodeURIComponent(url)}`;

        const response = await axios.get(api, {
            headers: { "User-Agent": "Mozilla/5.0" }
        });

        if (!response.data || !response.data.video) {
            return res.json({ error: "Video not found" });
        }

        return res.json({
            success: true,
            download: response.data.video.noWatermark
        });

    } catch (error) {
        console.error("TikTok fetch error:", error.message);
        res.json({ error: "Server error fetching video" });
    }
});

// =========================
// SERVER START
// =========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
