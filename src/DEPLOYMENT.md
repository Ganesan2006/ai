# Production Deployment Guide

## 🚀 Overview

This guide covers deploying the AI-Powered Learning Mentor Platform to production with optimal performance, security, and scalability.

---

## 📋 Prerequisites

### Required Services
1. **Supabase Account** (Free tier available)
   - PostgreSQL database
   - Authentication service
   - Edge Functions hosting

2. **OpenAI Account** (API access required)
   - GPT-4o-mini API access
   - API key with credits

3. **Frontend Hosting** (Choose one)
   - Vercel (Recommended)
   - Netlify
   - AWS Amplify
   - Cloudflare Pages

---

## 🔧 Environment Setup

### 1. Supabase Configuration

#### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note your project details:
   - Project URL: `https://[PROJECT_ID].supabase.co`
   - Anon Key: `eyJ...` (public, safe for frontend)
   - Service Role Key: `eyJ...` (secret, backend only)

#### Configure Authentication
```bash
# In Supabase Dashboard → Authentication → Settings

# Email Auth Settings
- Email confirmations: Disabled (or configure email provider)
- Email templates: Customize welcome emails

# Security Settings
- JWT expiry: 3600 (1 hour)
- Refresh token rotation: Enabled
- Session timeout: 604800 (1 week)
```

#### Set Environment Variables
```bash
# In Supabase Dashboard → Project Settings → Edge Functions

SUPABASE_URL=https://[PROJECT_ID].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
OPENAI_API_KEY=[your-openai-api-key]
```

### 2. Deploy Edge Functions

#### Install Supabase CLI
```bash
npm install -g supabase
```

#### Login and Link Project
```bash
supabase login
supabase link --project-ref [PROJECT_ID]
```

#### Deploy Functions
```bash
# Deploy the main API server
supabase functions deploy make-server --no-verify-jwt

# Or deploy all functions
supabase functions deploy
```

#### Verify Deployment
```bash
# Test health endpoint
curl https://[PROJECT_ID].supabase.co/functions/v1/make-server-2ba89cfc/health

# Expected response:
# {"status":"ok","timestamp":"2025-10-25T...","env":{...}}
```

### 3. Frontend Configuration

#### Update Supabase Info
Edit `/utils/supabase/info.tsx`:
```typescript
export const projectId = '[YOUR_PROJECT_ID]';
export const publicAnonKey = '[YOUR_ANON_KEY]';
```

#### Environment Variables (Optional)
Create `.env.local`:
```bash
VITE_SUPABASE_URL=https://[PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]
```

---

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)

#### Steps
1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Configure project:
   - Framework: React
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. Set environment variables in Vercel dashboard

#### Production Domain
```
https://your-app.vercel.app
```

### Option 2: Netlify

#### Steps
1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

3. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Option 3: Manual Build

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Output is in /dist folder
# Upload to any static hosting service
```

---

## 🔒 Security Checklist

### Essential Security Measures

- [ ] **Environment Variables**
  - Service role key NEVER in frontend code
  - API keys stored in Edge Function environment
  - No secrets committed to git

- [ ] **Authentication**
  - JWT tokens properly validated
  - Session expiry configured
  - Password minimum length enforced (6 chars)

- [ ] **CORS Configuration**
  - Production domain whitelisted
  - Proper headers configured
  - Credentials enabled only for trusted origins

- [ ] **API Rate Limiting** (Recommended)
  - Implement rate limiting on Edge Functions
  - Prevent abuse and DDoS
  - Use Supabase rate limiting features

- [ ] **Database Security**
  - Row Level Security (RLS) policies enabled
  - User data isolated by userId
  - Proper indexes for performance

### Production Hardening

#### Update CORS for Production
Edit `/supabase/functions/make-server/index.ts`:
```typescript
app.use(
  "*",
  cors({
    origin: ["https://your-production-domain.com", "https://www.your-domain.com"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);
```

#### Add Rate Limiting (Recommended)
```typescript
import { rateLimiter } from "npm:hono-rate-limiter";

app.use(
  "*",
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
  })
);
```

---

## 📊 Performance Optimization

### Frontend Optimizations

#### 1. Code Splitting
```typescript
// Lazy load heavy components
const CodeEditor = lazy(() => import('./components/CodeEditor'));
const ChatAssistant = lazy(() => import('./components/ChatAssistant'));
```

#### 2. Image Optimization
- Use WebP format for images
- Implement lazy loading
- Optimize image sizes

#### 3. Bundle Size
```bash
# Analyze bundle
npm run build -- --analyze

# Remove unused dependencies
npm prune
```

### Backend Optimizations

#### 1. Caching Strategy
```typescript
// Cache roadmaps for 1 hour
const ROADMAP_CACHE_TTL = 3600;

// Cache user profiles
const PROFILE_CACHE_TTL = 1800;
```

#### 2. Database Indexing
```sql
-- Add indexes for frequent queries
CREATE INDEX idx_user_profiles ON profiles(userId);
CREATE INDEX idx_roadmaps ON roadmaps(userId);
CREATE INDEX idx_progress ON progress(userId, moduleId);
```

#### 3. OpenAI Optimization
- Use GPT-4o-mini (faster, cheaper)
- Implement request caching
- Set max_tokens limits
- Stream responses for chat

---

## 📈 Scalability Configuration

### Database Scaling

#### Connection Pooling
```typescript
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  db: {
    poolSize: 10,
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
```

#### Read Replicas (Enterprise)
- Configure read replicas for heavy queries
- Separate read/write connections
- Use connection pooler (PgBouncer)

### Edge Function Scaling

#### Auto-scaling
- Supabase Edge Functions auto-scale
- No manual configuration needed
- Handles 1000s of concurrent requests

#### Monitor Performance
```bash
# View function logs
supabase functions logs make-server

# Monitor in dashboard
https://app.supabase.com/project/[PROJECT_ID]/functions
```

### CDN Configuration

#### Vercel Edge Network
- Automatic global CDN
- Edge caching
- DDoS protection

#### Custom CDN (Optional)
- Cloudflare in front of app
- Cache static assets
- Optimize images

---

## 🎯 Monitoring & Analytics

### Essential Monitoring

#### 1. Error Tracking
Integrate Sentry (Recommended):
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
  tracesSampleRate: 1.0,
});
```

#### 2. Performance Monitoring
```typescript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

#### 3. User Analytics
Integrate PostHog or Google Analytics:
```typescript
// Track key events
analytics.track('user_signed_up');
analytics.track('roadmap_generated');
analytics.track('module_completed');
```

### Supabase Monitoring

#### Dashboard Metrics
- API requests per second
- Database connections
- Function invocations
- Error rates
- Response times

#### Set Up Alerts
- Database CPU > 80%
- Function errors > 10/min
- Authentication failures > 50/hr

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy Edge Functions
        run: |
          npm install -g supabase
          supabase functions deploy --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
```

---

## 🧪 Testing Before Launch

### Pre-Launch Checklist

- [ ] **Authentication Flow**
  - Sign up with new account
  - Sign in with existing account
  - Password reset works
  - Session persists on refresh

- [ ] **Core Features**
  - Onboarding completes successfully
  - AI roadmap generates (or falls back to template)
  - Progress tracking saves
  - All 6 tabs load correctly

- [ ] **Performance**
  - Page load < 3 seconds
  - Lighthouse score > 90
  - No console errors
  - Mobile responsive

- [ ] **Security**
  - No API keys in frontend
  - HTTPS enabled
  - CORS configured
  - Auth tokens secure

### Load Testing

```bash
# Install k6
brew install k6

# Run load test
k6 run load-test.js
```

Example load test:
```javascript
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '3m', target: 100 },
    { duration: '1m', target: 0 },
  ],
};

export default function () {
  const res = http.get('https://your-app.com');
  check(res, { 'status is 200': (r) => r.status === 200 });
}
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Edge Function 403 Error
**Solution:**
```bash
# Redeploy with proper permissions
supabase functions deploy make-server --no-verify-jwt
```

#### 2. CORS Errors
**Solution:** Update CORS origin in Edge Function

#### 3. Authentication Fails
**Check:**
- Anon key is correct
- Service role key is in Edge Function env
- Supabase URL is correct

#### 4. Slow Performance
**Optimize:**
- Enable caching
- Add database indexes
- Optimize images
- Use CDN

---

## 📚 Additional Resources

### Documentation
- [Supabase Docs](https://supabase.com/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Vercel Docs](https://vercel.com/docs)

### Monitoring Tools
- [Sentry](https://sentry.io) - Error tracking
- [PostHog](https://posthog.com) - Product analytics
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance

### Support
- Supabase Discord: [discord.supabase.com](https://discord.supabase.com)
- OpenAI Forum: [community.openai.com](https://community.openai.com)

---

## ✅ Production Ready Checklist

### Final Checks

- [ ] All environment variables configured
- [ ] Edge Functions deployed and tested
- [ ] Frontend deployed to production domain
- [ ] HTTPS enabled (automatic with Vercel/Netlify)
- [ ] CORS configured for production domain
- [ ] Error tracking integrated
- [ ] Analytics configured
- [ ] Performance optimized (Lighthouse > 90)
- [ ] Mobile responsive tested
- [ ] All features tested in production
- [ ] Monitoring and alerts set up
- [ ] Backup strategy in place
- [ ] Documentation updated

---

## 🎉 Launch!

Once all checks are complete:

1. **Announce Launch** 🚀
2. **Monitor First 24 Hours** 👀
3. **Gather User Feedback** 💬
4. **Iterate and Improve** 🔄

---

**Production-Ready Platform | Scalable Architecture | Built for Growth**

*Deployed with React, TypeScript, Tailwind CSS, Supabase, and OpenAI*
