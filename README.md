# WiFiman — Check best connection for your address (Prototype)

A tiny, fast service that takes a street address and checks six providers
(NBN, Pentanet, Telstra, Optus, Vodafone, Starlink). Results are normalised,
prioritised, and returned to your WordPress page.

## What you get
- `frontend/snippet.html` — drop-in HTML+JS for a WordPress Custom HTML block.
- `backend/` — Node.js Express server with Playwright checker skeletons.
- `MOCK` mode — returns realistic fake data for instant testing.
- Dockerfile — deploy easily on Render or Fly.io.

---

## Step 1 — Add a "tab" on your homepage
In WordPress (Block themes):
1. Go to **Appearance → Editor**.
2. Open your **Homepage** template.
3. Add a **Group** block where you want the section.
4. Insert a **Custom HTML** block inside and paste the contents of `frontend/snippet.html`.
5. Update the `WIFIMAN_API` URL inside the snippet to your deployed backend endpoint.
6. Save.

Add a menu item that jumps to the section:
- Go to **Appearance → Menus** (or the Navigation block if using the Site Editor).
- Add a new item labelled **Check best connection for your address**.
- Set the URL to `#check-connection` and save. Clicking it will scroll to the section.

## Step 2 — Deploy the backend (Render)
1. Create a new GitHub repo and push the `backend/` folder (or the whole project).
2. In Render: **New → Web Service**.
3. Choose your repo, **Root Directory** = `backend`.
4. **Environment**: Node 18+.
5. **Build Command**: `npm ci` (base image already contains Playwright in Dockerfile build; if using native, prefer the Dockerfile service).
6. **Start Command**: `npm start`.
7. **Environment Variables**:
   - `PORT` = `8787` (Render will inject one if left blank; we respect both).
   - `MOCK` = `1` (for initial testing).
   - Optional: `ALLOW_ORIGIN` = `https://wifiman.com.au` (when live).
8. Deploy. Note the service URL, e.g., `https://wifiman-checker.onrender.com`.
9. In your WordPress snippet, set `WIFIMAN_API` to `https://your-service/check-availability`.

**Using Docker on Render (recommended for Playwright):**
- Choose **Docker** as environment when creating the service so it uses the provided `Dockerfile`.
- Build command is not needed; Render builds from Dockerfile.

## Step 3 — Test with MOCK mode
- Visit your homepage, scroll to **Check best connection for your address**.
- Type an address and submit. You should see instant mocked results.

## Step 4 — Implement real checkers
Files: `backend/checkers/*.js`
Each exports a function `checkX(ctx, address)` and should return an object:
```js
{
  provider: "NBN" | "Pentanet" | "Telstra" | "Optus" | "Vodafone" | "Starlink",
  technology: "FTTP" | "HFC" | "FTTC" | "FWA" | "4G" | "5G" | "Satellite" | "Fixed Wireless" | "DSL",
  plan_examples: [{ name, down_mbps, up_mbps, monthly_aud }],
  install_fee_aud,
  lead_time_days,
  confidence: 0..1,
  raw
}
```

Suggested structure inside a checker:
```js
export async function checkNbn(ctx, address) {
  if (ctx.mockMode) return /* ... */;

  // Example Playwright outline:
  // const browser = await chromium.launch();
  // const page = await browser.newPage();
  // await page.goto("https://www.nbnco.com.au/");
  // await page.fill("input[placeholder='Enter address']", address);
  // await page.waitForSelector("text=Technology");
  // const text = await page.textContent("selector-of-result");
  // Parse `text` → { technology: "FTTP", confidence: 0.9, ... }
  // await browser.close();
  // return normalized;
}
```

**Important:** Some sites rate-limit or block automation. If blocked, set a low `confidence`
(e.g. `0.2`) and return a minimal object so your UI can show a “we’ll confirm” note.

## Step 5 — Speed & reliability
- Caching: built-in in-memory cache keyed by normalized address (TTL defaults to 24h).
- Timeouts: add per-checker timeouts so one slow site doesn’t block the whole response.
- Streaming (optional): switch to Server-Sent Events to push results as they complete.

## Step 6 — Lock it down for production
- Set `MOCK=0` to enable real checkers.
- Set `ALLOW_ORIGIN=https://wifiman.com.au` to restrict CORS.
- Put the service behind a CDN (Render already fronts with TLS).
- Add a lightweight rate-limit (e.g., via a reverse-proxy or a small middleware).

## Step 7 — WordPress polish
- Update the CTA phone number and booking link inside `snippet.html`.
- Optional: Add Google Places Autocomplete to the address field for better data quality.
- Optional: Add floating CTA banner when high-priority tech (FTTP/HFC) is detected.

---

## Local dev
```bash
cd backend
cp .env.example .env  # keep MOCK=1 while developing
npm ci
npm start
# → http://localhost:8787/healthz
```

Then open `frontend/snippet.html` in a temporary static server and point `WIFIMAN_API`
at `http://localhost:8787/check-availability`.

---

## Notes
- Playwright is listed as a dependency and the Dockerfile uses the official image for reliability.
- If deploying to platforms without Docker, you may need `npx playwright install --with-deps` as a build step.
- To scale beyond in-memory cache, add Redis and replace the `cache` Map with a Redis client.

— Built for Crashman • 2025-10-05T10:19:16.629889
