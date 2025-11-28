import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

// Test Route
app.get("/facebook/test", (req, res) => {
    res.send("Facebook endpoint working!");
});

// Root Route
app.get("/", (req, res) => {
    res.send("Social Downloader Backend Running");
});

// Facebook Downloader Route
app.post("/facebook", async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.json({ error: "No URL provided" });

        const api = `https://api.snapinsta.app/api/facebook?url=${encodeURIComponent(url)}`;
        const response = await axios.get(api);

        if (!response.data || !response.data.media || response.data.media.length === 0) {
            return res.json({ error: "Video not found" });
        }

        return res.json({
            success: true,
            download: response.data.media[0].url,
        });

    } catch (error) {
        console.error(error);
        res.json({ error: "Server error fetching video" });
    }
});

// Railway PORT (Important)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Backend running on port " + PORT);
});
