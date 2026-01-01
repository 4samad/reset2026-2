# RESET 2026 - Quick Start

## 🚀 Get Running in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Google OAuth

Edit `.env.local`:
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000
```

Get credentials:
1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Secret

Generate secret:
```bash
openssl rand -base64 32
```

### 3. Run
```bash
npm run dev
```

Open http://localhost:3000

## 📱 Test the Flow

1. **Sign in** with Google
2. **Choose username** (or pick a suggestion)
3. **Set preferences** (WhatsApp opt-in)
4. **Complete profile** (optional fields)
5. **View dashboard** - your 30-day journey starts

## 🔑 Access Admin Panel

In browser console:
```javascript
localStorage.setItem('isAdmin', 'true')
```

Then visit: http://localhost:3000/admin

## 🏗️ Build for Production

```bash
npm run build
npm start
```

## 📦 Deploy

### Vercel (1-click)
```bash
vercel
```

### Other Platforms
1. Push to GitHub
2. Connect to Vercel/Netlify/Railway
3. Add environment variables
4. Deploy

## ⚙️ Current Setup

- ✅ Google authentication
- ✅ Anonymous usernames
- ✅ 30-day progress tracking
- ✅ Daily check-ins
- ✅ Reading resources
- ✅ Admin dashboard
- ⚠️ Using localStorage (temporary)

## 🔧 Before Production

Replace localStorage with database:
1. Set up PostgreSQL/MongoDB
2. Create users & check_ins tables
3. Replace localStorage calls in:
   - `/app/dashboard/page.tsx`
   - `/app/onboarding/page.tsx`
   - `/app/settings/page.tsx`
   - `/app/admin/page.tsx`

Search codebase for: `// TODO:`

## 📚 Documentation

- Full setup: `SETUP.md`
- Project overview: `PROJECT_SUMMARY.md`
- Type definitions: `types/index.ts`
- Mock data: `lib/mockData.ts`

---

**Need help?**
- Email: support@detoxmind.org
- Web: detoxmind.org
