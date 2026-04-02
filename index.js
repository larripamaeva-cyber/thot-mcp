import express from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const APIKEY = process.env.THOT_API_KEY;

app.get("/", (req, res) => {
  res.json({ ok: true });
});

app.post("/mcp", async (req, res) => {
  try {
    const { query, urlactuelle } = req.body;

    const response = await fetch("https://api.thot-seo.fr/maillage_interne_suggest_api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query,
        urlactuelle,
        apikey: APIKEY
      })
    });

    const data = await response.json();

    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log("server running"));
