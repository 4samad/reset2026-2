# RESET 2026 - Setup Guide

## Overview

RESET 2026 is a privacy-first, mobile-first web application for a 30-day digital detox program by Detox Mind.

## Tech Stack

- Next.js 16.1.1 (App Router)
- Tailwind CSS 4
- TypeScript
- NextAuth.js (v5 beta) for Google authentication
- Client-side localStorage (temporary storage)

## Prerequisites

- Node.js 20+
- npm or yarn
- Google OAuth credentials

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create a new project or select an existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials (Web application)
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)
   - Copy Client ID and Client Secret

3. **Configure environment variables:**

   Update `.env.local` with your credentials:
   ```env
   GOOGLE_CLIENT_ID=your_actual_google_client_id
   GOOGLE_CLIENT_SECRET=your_actual_google_client_secret
   NEXTAUTH_SECRET=your_random_secret_key_here
   NEXTAUTH_URL=http://localhost:3000
   ```

   Generate a secure NEXTAUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

## Project Structure

```
reset2026/
├── app/
│   ├── admin/              # Admin dashboard
│   ├── api/auth/           # NextAuth API routes
│   ├── auth/signin/        # Sign-in page
│   ├── dashboard/          # Main user dashboard
│   ├── onboarding/         # User onboarding flow
│   ├── settings/           # User settings
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home (redirect logic)
│   └── globals.css         # Global styles
├── components/
│   ├── DailyCheckInCard.tsx
│   ├── DailyFocusCard.tsx
│   ├── DayCounter.tsx
│   ├── Header.tsx
│   ├── ProgressTracker.tsx
│   ├── Providers.tsx
│   ├── ReadingResourcesSection.tsx
│   └── TestimonialCard.tsx
├── lib/
│   ├── mockData.ts         # Mock data & placeholder functions
│   └── utils.ts            # Utility functions
├── types/
│   └── index.ts            # TypeScript type definitions
├── auth.ts                 # NextAuth configuration
└── .env.local              # Environment variables
```

## Key Features

### Authentication
- Google OAuth login
- Anonymous username generation
- No real names allowed
- Privacy notice displayed

### Onboarding
- Three-step process:
  1. Username selection (with suggestions)
  2. WhatsApp opt-in preferences
  3. Optional profile information (age, issue, goal)

### Dashboard
- Day counter (current day of 30)
- Daily focus message
- Daily check-in with three options:
  - Felt strong today
  - Struggled but held on
  - Relapsed today
- Visual progress tracker
- Rotating testimonials
- Reading resources with tag filtering

### Settings
- Update WhatsApp preferences
- Toggle mentor check-in
- Sign out

### Admin
- View all users (anonymous data only)
- See WhatsApp opt-in status
- Monitor mentor check-in enrollment
- No Google identity data displayed

## Data Storage

**Current Implementation:**
- Uses browser localStorage (client-side only)
- Data persists per browser
- No backend database

**TODO for Production:**
Replace localStorage with a real database:
- Users table
- CheckIns table
- Add proper API routes
- Implement server-side data fetching
- Search for `// TODO:` comments in the codebase

## Admin Access

To access the admin panel:
1. Open browser console
2. Run: `localStorage.setItem('isAdmin', 'true')`
3. Navigate to `/admin`

**TODO for Production:**
- Implement proper role-based access control
- Use database to store admin roles
- Add middleware protection

## Development Notes

### Mock Data Locations
- `lib/mockData.ts` - Reading resources, testimonials, daily focuses
- All database calls are marked with `// TODO: Replace with actual database call`

### Username Generation
- Auto-generates anonymous usernames
- Format: `{adjective}-{noun}`
- Examples: quiet-river, blue-panda, steady-mountain

### Check-In System
- Three states: strong, struggled, relapsed
- No punishment for relapse
- Supportive messages for all states
- Visual progress grid (30 days)

### Privacy Design
- No Google data stored
- Anonymous usernames enforced
- WhatsApp number only if opted-in
- Admin view shows no PII

## Deployment

### Vercel (Recommended)
```bash
npm run build
```

Deploy to Vercel:
1. Connect your Git repository
2. Add environment variables in Vercel dashboard
3. Deploy

Update NEXTAUTH_URL to your production domain.

### Other Platforms
- Netlify
- AWS Amplify
- Railway
- Render

## Next Steps (Production Checklist)

- [ ] Replace localStorage with database (PostgreSQL, MongoDB, etc.)
- [ ] Implement proper API routes for CRUD operations
- [ ] Add server-side data fetching
- [ ] Implement proper admin authentication
- [ ] Add rate limiting
- [ ] Set up monitoring and analytics
- [ ] Implement WhatsApp integration (daily messages, mentor check-ins)
- [ ] Add email notifications as backup
- [ ] Create database migration scripts
- [ ] Add error logging (Sentry, LogRocket, etc.)
- [ ] Implement data backup strategy
- [ ] Add GDPR compliance features (data export, deletion)
- [ ] Set up CI/CD pipeline
- [ ] Add unit and integration tests
- [ ] Optimize images and performance
- [ ] Add PWA support for offline access
- [ ] Implement security headers
- [ ] Add CSRF protection
- [ ] Set up SSL/TLS certificates

## Support

For issues or questions:
- Email: support@detoxmind.org
- Website: https://detoxmind.org

## License

Copyright © 2026 Detox Mind. All rights reserved.
