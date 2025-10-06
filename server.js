const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8787;
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || "*";

app.use(
  cors({
    origin: ALLOW_ORIGIN === "*" ? true : ALLOW_ORIGIN,
  })
);
app.use(express.json());

// Health check
app.get("/healthz", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Demo endpoint (we'll wire your real checkers later)
app.post("/check-availability", (req, res) => {
  const address = (req.body && req.body.address) || "";
  res.json({
    address,
    results: [
      {
        provider: "NBN",
        technology: "FTTP",
        plan_examples: [{ name: "Home Fast", down_mbps: 100, up_mbps: 20, monthly_aud: 99 }],
        install_fee_aud: 0,
        lead_time_days: 5,
        confidence: 0.9,
      },
      {
        provider: "Optus",
        technology: "5G",
        plan_examples: [{ name: "Unlimited 5G", down_mbps: 200, up_mbps: 20, monthly_aud: 89 }],
        install_fee_aud: 0,
        lead_time_days: 2,
        confidence: 0.7,
      },
      {
        provider: "Starlink",
        technology: "Satellite",
        plan_examples: [{ name: "Residential", down_mbps: 150, up_mbps: 15, monthly_aud: 139 }],
        install_fee_aud: 199,
        lead_time_days: 7,
        confidence: 0.8,
      },
    ],
  });
});

// Error handler (keeps responses clean)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal error" });
});

app.get('/', (req, res) => {
  res.send('✅ WiFiman Availability Checker API is running successfully.');
});

app.listen(PORT, () => {
  console.log('WiFiman Checker running on port ' + PORT);
});
