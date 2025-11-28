import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// --------------------- FACEBOOK DOWNLOADER ---------------------
app.post("/facebook", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) return res.json({ error: "URL missing" });

    const api = `https://api.savetube.su/info?url=${encodeURIComponent(url)}`;

    const response = await axios.get(api);
    const data = response.data;

    if (!data || !data.url) {
      return res.json({ error: "Video not found" });
    }

    return res.json({
      success: true,
      download: data.url
    });
  } catch (err) {
    console.error(err);
    res.json({ error: "Server Error" });
  }
});

// ---------------------------------------------------------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
