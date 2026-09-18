# 🚀 Instagram Comment-to-DM Automation

[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/tekno_buddy)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)

**Turn every comment into a conversation. Automatically. 💬✨**

Reply to comments and send DMs instantly — powered by Meta's official Instagram API. No bots, no scraping, no account risk.

[🎯 Features](#-features) • [⚙️ How It Works](#%EF%B8%8F-how-it-works) • [🛠️ Setup](#%EF%B8%8F-setup) • [🚀 Deploy](#-deployment) • [🔧 Configuration](#-configuration) • [❓ Troubleshooting](#-troubleshooting)

---

## 🎯 Features

✨ **Smart Automation**
- 🔍 Multiple trigger keywords per reel — any one word fires the automation
- 💌 Instant DM to the commenter
- 💬 Public reply posted on the comment
- ⏱️ Custom delay before sending — so it doesn't feel robotic
- 👤 Optional **"Follow me" button** right inside the DM

🆕 **Reply to ALL Comments Mode**
- 🔁 Toggle on and every single comment triggers a DM + reply — no keyword needed
- 🎯 Perfect for giveaways, engagement campaigns, and launch posts
- ✅ Reuses your existing DM message and comment reply — no duplicate setup

🎨 **Beautiful Dashboard**
- 📊 Live stats — total reels, configured, and actively running
- 🖼️ Visual reel grid with thumbnails
- ⚡ Quick on/off toggle directly on each reel card
- 🌙 Light/dark theme toggle, remembered per browser
- 🔢 Live character counter on DM field (warns before Instagram's 1,000-char limit)

🔒 **Secure & Reliable**
- 🔐 Meta's official Instagram Graph API — not a third-party bot
- 🔄 Automatic token refresh every 4 days — never manually regenerate again
- 💾 Persistent volume storage — settings survive every deploy and restart
- 🆕 New reels default to **inactive** — nothing fires until you turn it on

---

## ⚙️ How It Works

1. 👤 Someone comments on your Instagram reel
2. ⚡ Instagram sends an instant webhook to your backend
3. 🔍 Backend checks: is **Reply to ALL** on?
   - **Yes →** fires DM + reply to every commenter, no keyword needed
   - **No →** checks if comment contains your trigger keyword
4. 💌 Sends a private DM to the commenter
5. 💬 Posts a public reply on their comment
6. 🎉 Done — all within seconds

---

## 🛠️ Setup

### What you'll need

- Instagram Business or Creator account
- Facebook account (to access Meta Developer tools)
- GitHub account — [github.com](https://github.com)
- Railway account — [railway.com](https://railway.com)
- Vercel account — [vercel.com](https://vercel.com)

### 🔑 Credentials you'll generate

| Credential | Where to get it |
|---|---|
| `VERIFY_TOKEN` | Make up any string yourself |
| `INSTAGRAM_ACCESS_TOKEN` | Meta app → API setup with Instagram login → Generate token |
| `IG_BUSINESS_ACCOUNT_ID` | Meta app → API setup page (long number) |

### Required Instagram permissions

Make sure to add the `instagram_business_` versions — the older ones without that prefix won't work:

- `instagram_business_basic`
- `instagram_business_manage_comments`
- `instagram_business_manage_messages`

---

## 🚀 Deployment

### Step 1 — Fork this repo

Click **Fork** (top right) to get your own copy. You'll make all edits in your fork.

### Step 2 — Deploy backend to Railway

1. Go to [railway.com](https://railway.com) and sign up with GitHub
2. New Project → Deploy from GitHub repo → select your fork
3. Set **Root Directory** to `/backend` under Settings
4. Add 3 environment variables under the Variables tab:

```
VERIFY_TOKEN=any_phrase_you_choose
INSTAGRAM_ACCESS_TOKEN=your_token_from_meta
IG_BUSINESS_ACCOUNT_ID=your_instagram_business_id
```

5. **Attach a persistent volume** — on the project canvas click **+ Add → Volume**, select your backend service, mount path: `/data`, then click Deploy
   > ⚠️ Do not skip this. Without it, all your reel settings reset on every deploy.

6. Go to Settings → Networking and copy your public Railway URL

### Step 3 — Deploy frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. New Project → import your fork
3. Set **Root Directory** to `frontend`
4. Add one environment variable:

```
NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app
```

   > ⚠️ No trailing slash. Set this in the Vercel dashboard UI — not inside `vercel.json`.

5. Deploy and copy your Vercel URL

### Step 4 — Connect the webhook

1. Go to your Meta app → Use cases → API setup → Configure webhooks
2. **Callback URL:** `https://your-railway-url.up.railway.app/webhook`
3. **Verify token:** same phrase you used for `VERIFY_TOKEN`
4. Click Verify and Save → subscribe to the **comments** field

### Step 5 — Add legal pages

Meta requires these before you can publish. Both are already built into this repo:

- Privacy Policy → `https://your-vercel-url.vercel.app/privacy`
- Data Deletion → `https://your-vercel-url.vercel.app/data-deletion`

Add them in Meta app → App Settings → Basic.

### Step 6 — Publish your Meta app

> ⚠️ This step is required. Meta's webhook test button works on unpublished apps — but real Instagram comments won't trigger anything until you publish.

Meta app → Publish page → click **Publish**.

### Step 7 — Test it 🎉

1. Open your Vercel dashboard URL
2. Click a reel → set a trigger keyword, DM message, comment reply
3. Enable the reel → Save
4. Comment the trigger word from a second account
5. Watch the DM and public reply fire automatically

---

## 🔧 Configuration

### Per-reel settings

| Setting | What it does |
|---|---|
| Trigger keywords | Any comment containing one of these words fires the automation |
| DM message | Private message sent to the commenter |
| Comment reply | Public reply posted under their comment |
| Delay (seconds) | How long to wait before sending — 0 = instant |
| Follow button | Adds a "Follow me" button inside the DM |
| Enable automation | Master on/off for this reel |
| Reply to ALL comments | When ON — bypasses keywords, fires on every comment |

### 🆕 Reply to ALL Comments

When this toggle is ON for a reel:
- Every comment triggers the automation — no keyword match needed
- Uses the same **DM message** and **Comment reply** fields you've already filled in
- Ideal for giveaways, high-engagement posts, or launch campaigns
- Turn it back OFF anytime to return to keyword-only mode

---

## 🗂️ Tech Stack

| Technology | Purpose |
|---|---|
| 🐍 **FastAPI** | Python backend |
| ⚛️ **Next.js + TypeScript** | Frontend dashboard |
| 💅 **Inline React styles** | UI styling (no Tailwind) |
| 📦 **JSON on Railway volume** | Storage — no database needed |
| 🚂 **Railway** | Backend hosting |
| ▲ **Vercel** | Frontend hosting |
| 📸 **Meta Graph API** | Official Instagram connection |

---

## ❓ Troubleshooting

**Nothing happens when I comment the trigger word**
→ App is probably not published. Go to Meta app → Publish page → Publish. The test button works on unpublished apps but real comments don't fire until it's live.

**Dashboard shows 0 reels**
→ `NEXT_PUBLIC_API_URL` on Vercel doesn't match your Railway URL exactly. Check for typos and remove any trailing slash.

**Settings reset after every code deploy**
→ No persistent volume attached, or not mounted at `/data`. Redo Step 2 above.

**Reply to ALL is ON but nothing fires**
→ Check that "Enable automation for this reel" is also ON. Both need to be active.

**Reply to ALL fires but DM or reply is blank**
→ The DM message and comment reply fields in that reel's settings are empty. Fill them in — reply-to-all reuses those same fields.

**Railway deploy failed**
→ Click the failed deployment → Deploy Logs → scroll to the bottom. Python errors name the exact file and line number.

---

## 💰 Cost

| Service | Cost |
|---|---|
| Railway (Hobby plan) | $5 USD / month |
| Vercel | Free |
| GitHub | Free |

Railway's actual usage for this app runs $0.30–$0.50/month. You pay the flat $5 plan minimum.

If Railway lapses: service stops, volume data kept 30 days then deleted. Your code on GitHub is safe forever.

---

## 📄 License

MIT — free to use for personal or commercial projects.

---

## 💖 Credits

Built and extended by **[@tekno_buddy](https://instagram.com/tekno_buddy)**

Originally forked from [TejasAdhiya/CommentDMAutomation](https://github.com/TejasAdhiya/CommentDMAutomation) — extended with multiple keywords, reply-to-all mode, auto token refresh, persistent volume storage, follow button, character counter, theme toggle, and more.

---

⭐ **Star this repo if it helped you!**

By [@tekno_buddy](https://instagram.com/tekno_buddy)
