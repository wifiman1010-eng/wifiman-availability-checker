const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8787;

app.use(cors());
app.use(express.json());

// Health check
app.get("/healthz", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Placeholder endpoint (you can rename to /check-availability later)
app.post("/check", (req, res) => {
  const { address } = req.body || {};
  res.json({
    address: address || null,
    providers: [
      { name: "NBN", status: "Available" },
      { name: "Starlink", status: "Available" },
      { name: "Optus 5G", status: "Limited" },
      { name: "Telstra 5G", status: "Available" }
    ]
  });
});

// ✅ Correct listen line
app.listen(PORT, () => {
  console.log(WiFiman Checker running on port ${PORT});
});
