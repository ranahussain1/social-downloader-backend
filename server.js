import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

// ----------------------------
// 🔵 TEST ROUTES
// ----------------------------
app.get("/", (req, res) => {
    res.send("Social Downloader Backend Running");
});

app.get("/facebook/test", (req, res) => {
    res.send("Facebook endpoint working!");
});

// ----------------------------
// 🔵 FACEBOOK DOWNLOADER ROUTE
// ----------------------------
app.post("/facebook", async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.json({ error: "No URL provided" });

        // --------------------------------------------
        // 🔥🔥 PASTE YOUR RAPIDAPI KEY HERE 🔥🔥
        // --------------------------------------------
        const options = {
            method: 'POST',
            url: 'https://facebook-reel-and-video-downloader.p.rapidapi.com/app/main.php',

            headers: {
                'content-type': 'application/json',

                // ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐
                // REPLACE THIS VALUE WITH YOUR KEY
                // ---------------------------------------
                'x-rapidapi-key: 6cfb9a7eb3msh906cf55d2b7ca0bp1daee7jsnf941610d259b',
                // ⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐

                'X-RapidAPI-Host': 'facebook-reel-and-video-downloader.p.rapidapi.com'
            },

            data: { url: url }
        };

        const apiResponse = await axios.request(options);

        if (!apiResponse.data || !apiResponse.data.link) {
            return res.json({ error: "Video not found" });
        }

        return res.json({
            success: true,
            download: apiResponse.data.link
        });

    } catch (error) {
        console.error("Downloader error:", error);
        return res.json({ error: "Server error fetching video" });
    }
});

// ----------------------------
// 🔵 START SERVER FOR RAILWAY
// ----------------------------
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Backend running on port ${port}`));
