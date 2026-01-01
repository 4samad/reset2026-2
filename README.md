# RESET 2026 - 30 Days Digital Detox

A privacy-first, mobile-first web application for a 30-day digital detox program by [Detox Mind](https://detoxmind.org).

## ✨ Features

- 🔐 **Google OAuth** authentication with anonymous usernames
- 📱 **Mobile-first** responsive design
- 🎨 **Calm UI** - low-dopamine, trauma-informed interface
- 📊 **Progress Tracking** - visual 30-day grid
- 💬 **Daily Check-ins** - relapse-friendly with supportive feedback
- 📚 **Reading Resources** - filterable by tags
- 👥 **Community Testimonials** - anonymous peer stories
- ⚙️ **WhatsApp Integration** - optional daily reminders & mentor check-ins
- 🔒 **Privacy-first** - no real names, minimal data storage
- 👨‍💼 **Admin Dashboard** - anonymous user analytics

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure Google OAuth (see SETUP.md)
# Edit .env.local with your credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get running in 3 steps
- **[SETUP.md](SETUP.md)** - Detailed setup instructions
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete feature overview

## 🏗️ Tech Stack

- **Framework:** Next.js 16.1.1 (App Router)
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **Auth:** NextAuth.js v5
- **Storage:** localStorage (temporary - needs database)

## 📁 Project Structure

```
reset2026/
├── app/                    # Next.js pages
│   ├── admin/             # Admin dashboard
│   ├── auth/signin/       # Login page
│   ├── dashboard/         # Main user dashboard
│   ├── onboarding/        # 3-step onboarding
│   └── settings/          # User settings
├── components/            # Reusable React components
├── lib/                   # Utilities & mock data
├── types/                 # TypeScript definitions
├── auth.ts               # NextAuth config
└── proxy.ts              # Route protection
```

## 🎯 Design Principles

- Mobile-first responsive design
- Calm, low-dopamine UI
- Non-judgmental copy
- Explicit relapse support
- No streak shaming
- Privacy-first approach
- Anonymous by default

## ⚠️ Before Production

**Current Setup:** Uses browser localStorage (temporary)

**TODO:** Replace with real database
- Set up PostgreSQL/MongoDB
- Create API routes
- Update all `// TODO:` comments in the code

Search for: `// TODO:` to find all integration points

## 🚢 Deploy

### Vercel (Recommended)
```bash
npm run build
vercel
```

### Other Platforms
- Netlify
- Railway
- AWS Amplify
- Any Node.js hosting

Add environment variables in your platform's dashboard.

## 📝 License

Copyright © 2026 Detox Mind. All rights reserved.

## 🤝 Support

- Website: [detoxmind.org](https://detoxmind.org)
- Email: support@detoxmind.org

---

Built with care for Kerala youth struggling with digital addiction.
