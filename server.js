import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
    res.send("Social Downloader Backend Running");
});

app.get("/facebook/test", (req, res) => {
    res.send("Facebook endpoint working!");
});

// FACEBOOK DOWNLOADER ROUTE
app.post("/facebook", async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.json({ error: "No URL provided" });

        const options = {
            method: 'POST',
            url: 'https://facebook-reel-and-video-downloader.p.rapidapi.com/app/main.php',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': 'YOUR_RAPID_API_KEY',
                'X-RapidAPI-Host': 'facebook-reel-and-video-downloader.p.rapidapi.com'
            },
            data: { url: url }
        };

        const response = await axios.request(options);

        if (!response.data || !response.data.download_url) {
            return res.json({ error: "Video not found" });
        }

        return res.json({
            success: true,
            download: response.data.download_url
        });

    } catch (error) {
        console.error(error);
        res.json({ error: "Server error fetching video" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
