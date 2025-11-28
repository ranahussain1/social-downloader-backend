import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/download", async (req, res) => {
    const { platform, url } = req.body;

    if (!platform || !url) {
        return res.json({ error: "Missing platform or URL" });
    }

    try {
        let apiURL = "";

        if (platform === "instagram") {
            apiURL = `https://api.savetok.cc/instagram?url=${encodeURIComponent(url)}`;
        }

        if (platform === "facebook") {
            apiURL = `https://api.savetok.cc/facebook?url=${encodeURIComponent(url)}`;
        }

        if (platform === "youtube") {
            apiURL = `https://api.savetok.cc/youtube?url=${encodeURIComponent(url)}`;
        }

        const response = await axios.get(apiURL);

        if (!response.data || !response.data.download_url) {
            return res.json({ error: "Video not found" });
        }

        res.json({
            success: true,
            download: response.data.download_url
        });

    } catch (err) {
        res.json({ error: "Unable to fetch video" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
