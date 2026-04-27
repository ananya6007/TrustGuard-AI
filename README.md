# 🛡️ TrustGuard AI

Digital Trust & Integrity Platform for the **Hack2Skill Google Solution Developer Challenge**

## Live Demo

🚀 **Try it now**: https://trust-guard-ai-kappa.vercel.app/login

## Features

- 🔐 **E2EE Encryption** - AES-256 end-to-end encryption for all assets
- 📦 **Asset Library** - Store & manage digital assets (Media, E-commerce, Social Media)
- 🕐 **2FA Security** - Two-factor authentication before downloads
- 🔍 **Platform Monitor** - Scan Instagram, TikTok, YouTube, Facebook, Twitter, Pinterest
- ⚠️ **Violations Detection** - Real-time alerts with confidence scores
- 🚀 **Demo Mode** - Try all features without signup

## Tech Stack

- **Frontend**: Next.js 14, React 18
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Encryption**: CryptoJS (AES-256)

## Getting Started

```bash
# Clone the repo
git clone https://github.com/ananya6007/TrustGuard-AI.git

# Install dependencies
cd TrustGuard-AI
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Credentials

- **Email**: demo@trustguard.ai
- **Password**: demo1234

## Demo Tour

Click "Start Demo" on the login page for a 3-minute interactive tour of all features.

## Project Structure

```
trustguard-ai/
├── app/
│   ├── api/           # API routes
│   ├── login/        # Login page
│   ├── dashboard/    # Dashboard
│   ├── asset-list/   # Asset library
│   ├── upload/      # Upload assets
│   ├── monitor/     # Platform monitor
│   ├── violations/  # Violations list
│   └── settings/    # Settings
├── .env.local       # Supabase config
└── package.json    # Dependencies
```

## API Endpoints

| Endpoint | Method | Description |
|---------|--------|-----------|
| `/api/auth/login` | POST | Login |
| `/api/auth/signup` | POST | Signup |
| `/api/assets` | GET/POST/DELETE | Assets CRUD |
| `/api/violations` | GET/POST/DELETE | Violations |
| `/api/scan` | POST | Scan platforms |

## License

MIT License - Feel free to use for your hackathon project!

---

Built for 🏆 **Hack2Skill Google Solution Developer Challenge**