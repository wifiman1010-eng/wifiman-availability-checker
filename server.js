const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8787;

app.use(cors());
app.use(express.json());

// Simple health check endpoint
app.get("/healthz", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Placeholder address check endpoint
app.post("/check", (req, res) => {
  const { address } = req.body;
  res.json({
    address,
    providers: [
      { name: "NBN", status: "Available" },
      { name: "Starlink", status: "Available" },
      { name: "Optus 5G", status: "Limited" },
      { name: "Telstra 5G", status: "Available" }
    ]
  });
});

app.listen(PORT, () => console.log(WiFiman Checker running on port ${PORT}));
