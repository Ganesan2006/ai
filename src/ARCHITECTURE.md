# System Architecture

## 🏗️ Overview

The AI-Powered Learning Mentor Platform is built using a modern, scalable architecture with clear separation of concerns and optimal performance.

---

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│                     (React + TypeScript)                         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Landing    │  │     Auth     │  │  Onboarding  │         │
│  │     Page     │  │     Page     │  │     Flow     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                           │                                      │
│                           ▼                                      │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Enhanced Dashboard (Main App)                 │ │
│  │  ┌────────┬────────┬────────┬────────┬────────┬────────┐ │ │
│  │  │Roadmap │Practice│  Quiz  │Community│Resource│Achieve│ │ │
│  │  └────────┴────────┴────────┴────────┴────────┴────────┘ │ │
│  │                  AI Chat Assistant                        │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
┌───────────────────────────┐  ┌──────────────────────┐
│     API LAYER             │  │   AUTH LAYER         │
│  (Deno Edge Functions)    │  │  (Supabase Auth)     │
│                           │  │                      │
│  • User Management        │  │  • JWT Tokens        │
│  • Profile CRUD           │  │  • Session Mgmt      │
│  • Roadmap Generation     │  │  • Password Hash     │
│  • Progress Tracking      │  │  • User Admin        │
│  • Chat Interface         │  └──────────────────────┘
│  • Community Features     │
│  • Resource Management    │
│  • Achievement System     │
└───────────────────────────┘
            │
            ▼
┌───────────────────────────┐
│    DATA LAYER             │
│  (Supabase KV Store)      │
│                           │
│  Key-Value Storage:       │
│  • profile:{userId}       │
│  • roadmap:{userId}       │
│  • progress:{userId}      │
│  • chat:{userId}          │
│  • achievements:{userId}  │
│  • community:{forumId}    │
│  • resources:{resourceId} │
└───────────────────────────┘
            │
            ▼
┌───────────────────────────┐
│    AI LAYER               │
│  (OpenAI GPT-4o-mini)     │
│                           │
│  • Roadmap Generation     │
│  • Chat Responses         │
│  • Context Analysis       │
│  • Personalization        │
└───────────────────────────┘
```

---

## 🔄 Data Flow

### 1. User Registration Flow

```
User Input (Email, Password, Name)
        ↓
Frontend Validation
        ↓
POST /make-server-2ba89cfc/signup
        ↓
Supabase Auth (Create User)
        ↓
JWT Token Generated
        ↓
Auto Sign-In
        ↓
Redirect to Onboarding
```

### 2. Onboarding & Roadmap Generation Flow

```
User Completes 4-Step Form
        ↓
Profile Data Collected
        ↓
POST /make-server-2ba89cfc/profile/create
        ↓
Store in KV Store (profile:{userId})
        ↓
POST /make-server-2ba89cfc/generate-roadmap
        ↓
OpenAI API Call (GPT-4o-mini)
        ↓
Personalized Roadmap Generated
        ↓
Store in KV Store (roadmap:{userId})
        ↓
Return to Frontend
        ↓
Redirect to Dashboard
```

### 3. Learning Session Flow

```
User Selects Module
        ↓
POST /make-server-2ba89cfc/progress/update
        ↓
Status: "in-progress"
        ↓
User Studies/Practices
        ↓
User Completes Module
        ↓
POST /make-server-2ba89cfc/progress/update
        ↓
Status: "completed"
        ↓
XP Awarded
        ↓
Achievement Check
        ↓
Dashboard Updated
```

### 4. AI Chat Flow

```
User Sends Message
        ↓
Frontend: Add to Local State
        ↓
POST /make-server-2ba89cfc/chat
        ↓
Load User Profile & Roadmap
        ↓
Build Context
        ↓
OpenAI API Call (GPT-4o-mini)
        ↓
Stream Response
        ↓
Save to Chat History (chat:{userId})
        ↓
Return Response to Frontend
        ↓
Display in Chat UI
```

---

## 🗂️ Component Architecture

### Frontend Components Hierarchy

```
App.tsx (Root)
│
├── AuthProvider (Context)
│
├── LandingPage
│   ├── Header
│   ├── Hero Section
│   ├── Features Grid
│   ├── How It Works
│   ├── CTA Section
│   └── Footer
│
├── AuthPage
│   ├── Login Form
│   ├── Signup Form
│   └── Password Reset
│
├── OnboardingFlow
│   ├── Step 1: Background & Experience
│   ├── Step 2: Learning Goals
│   ├── Step 3: Preferences
│   └── Step 4: Review
│
└── EnhancedDashboard
    │
    ├── Header
    │   ├── Logo
    │   ├── User Info
    │   ├── AI Assistant Button
    │   └── Sign Out
    │
    ├── Quick Stats (4 Cards)
    │   ├── Overall Progress
    │   ├── Modules Completed
    │   ├── Time Invested
    │   └── Target Goal
    │
    └── Tabs
        │
        ├── Tab 1: Roadmap
        │   └── Dashboard Component
        │       ├── Roadmap Overview
        │       ├── Phase Cards
        │       ├── Module Lists
        │       └── Progress Tracking
        │
        ├── Tab 2: Practice
        │   └── CodeEditor Component
        │       ├── Challenge Description
        │       ├── Code Input Area
        │       ├── Test Cases
        │       ├── Hints System
        │       └── Results Display
        │
        ├── Tab 3: Quiz
        │   └── AssessmentQuiz Component
        │       ├── Question Display
        │       ├── Options
        │       ├── Submit Button
        │       ├── Feedback
        │       └── Score Summary
        │
        ├── Tab 4: Community
        │   └── CommunityForum Component
        │       ├── Forum Posts
        │       ├── Create Post
        │       ├── Search/Filter
        │       └── Study Buddy Matcher
        │
        ├── Tab 5: Resources
        │   └── ResourceLibrary Component
        │       ├── Resource Grid
        │       ├── Search/Filter
        │       ├── Bookmarks
        │       └── Recommendations
        │
        └── Tab 6: Achievements
            └── AchievementSystem Component
                ├── XP Progress Bar
                ├── Achievement Badges
                ├── Daily Challenges
                └── Streak Tracker
```

---

## 🔧 Backend Architecture

### Edge Functions Structure

```
/supabase/functions/make-server/
│
├── index.ts (Main Router)
│   ├── CORS Middleware
│   ├── Logger Middleware
│   ├── Auth Verification
│   └── Route Handlers
│
├── kv_store.ts (Database Utils)
│   ├── get(key)
│   ├── set(key, value)
│   ├── delete(key)
│   ├── list(prefix)
│   └── Helper Functions
│
└── Routes
    ├── /health - Health check
    ├── /test - API test
    │
    ├── Authentication
    │   └── POST /signup
    │
    ├── Profile Management
    │   ├── POST /profile/create
    │   └── GET /profile
    │
    ├── Roadmap
    │   ├── POST /generate-roadmap
    │   └── GET /roadmap
    │
    ├── Progress Tracking
    │   ├── POST /progress/update
    │   └── GET /progress
    │
    └── AI Features
        └── POST /chat
```

### Database Schema (KV Store)

```typescript
// User Profile
Key: "profile:{userId}"
Value: {
  userId: string;
  email: string;
  name: string;
  background: string;
  currentRole: string;
  experience: string;
  skills: string[];
  targetGoal: string;
  learningPace: string;
  hoursPerWeek: number;
  learningStyle: string;
  onboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Learning Roadmap
Key: "roadmap:{userId}"
Value: {
  userId: string;
  content: {
    targetRole: string;
    phases: Phase[];
    skillsToMaster: string[];
    estimatedTimeline: string;
  };
  generatedAt: Date;
  lastUpdated: Date;
}

// Progress Tracking
Key: "progress:{userId}:{moduleId}"
Value: {
  userId: string;
  moduleId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  timeSpent: number;
  notes?: string;
  completedAt?: Date;
  lastUpdated: Date;
}

// Chat History
Key: "chat:{userId}"
Value: {
  userId: string;
  messages: Message[];
  lastUpdated: Date;
}

// Achievements
Key: "achievements:{userId}"
Value: {
  userId: string;
  totalXP: number;
  level: number;
  unlockedBadges: string[];
  currentStreak: number;
  lastActivityDate: Date;
}
```

---

## 🔐 Security Architecture

### Authentication Flow

```
1. User Submits Credentials
        ↓
2. Frontend Validation
        ↓
3. POST to /signup or /signin
        ↓
4. Backend: Supabase Auth
        ↓
5. JWT Token Generated
        ↓
6. Token Stored in Session
        ↓
7. Auto-attached to API Calls
        ↓
8. Backend: Verify JWT
        ↓
9. Access Granted/Denied
```

### Authorization Layers

```
┌─────────────────────────────────────┐
│     Frontend (Public)               │
│  • Landing Page (No Auth)           │
│  • Auth Page (No Auth)              │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│     Protected Routes                │
│  • Onboarding (Auth Required)       │
│  • Dashboard (Auth Required)        │
│  • All Features (Auth Required)     │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│     API Layer                       │
│  • JWT Verification                 │
│  • User ID Extraction               │
│  • Data Isolation                   │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│     Data Layer                      │
│  • User-specific Keys               │
│  • No Cross-user Access             │
│  • Service Role Protection          │
└─────────────────────────────────────┘
```

---

## ⚡ Performance Optimization

### Frontend Optimizations

```
1. Code Splitting
   • Lazy load heavy components
   • Route-based splitting
   • Dynamic imports

2. State Management
   • Minimal re-renders
   • Efficient context usage
   • Local state when possible

3. Asset Optimization
   • Optimized images
   • Lazy loading
   • CDN delivery

4. Caching
   • Browser caching
   • Service workers (future)
   • Local storage for user data
```

### Backend Optimizations

```
1. Edge Functions
   • Global deployment
   • Low latency
   • Auto-scaling

2. Database
   • Efficient key design
   • Prefix-based queries
   • Minimal data transfer

3. AI Integration
   • Request caching
   • Token optimization
   • Streaming responses

4. API Design
   • Batch operations
   • Pagination
   • Response compression
```

---

## 🚀 Scalability Strategy

### Horizontal Scaling

```
Frontend (Auto-scales with CDN)
    ↓
Edge Functions (Auto-scales)
    ↓
Supabase (Auto-scales)
    ↓
OpenAI (Rate-limited)
```

### Vertical Scaling

```
Database Connection Pooling
    ↓
Increased Edge Function Memory
    ↓
Supabase Plan Upgrade
    ↓
OpenAI Rate Limit Increase
```

### Caching Strategy

```
Level 1: Browser Cache (Static Assets)
    ↓
Level 2: CDN Cache (Global Edge)
    ↓
Level 3: Application Cache (User Data)
    ↓
Level 4: Database Cache (Frequent Queries)
```

---

## 📈 Monitoring & Observability

### Key Metrics

```
Frontend Metrics:
• Page load time
• Time to interactive
• First contentful paint
• Largest contentful paint
• Cumulative layout shift

Backend Metrics:
• API response time
• Request rate
• Error rate
• Function invocations
• Database queries

Business Metrics:
• User signups
• Onboarding completion
• Roadmap generation success
• Module completion rate
• Daily active users
```

### Logging Strategy

```
Development:
• Console logs for debugging
• Detailed error messages
• Performance tracking

Production:
• Error tracking (Sentry)
• Performance monitoring
• User analytics (PostHog)
• Security events
• API usage
```

---

## 🔄 Deployment Pipeline

### CI/CD Flow

```
Code Push to GitHub
        ↓
    Run Tests
        ↓
    Build Frontend
        ↓
Deploy to Vercel (Frontend)
        ↓
Deploy Edge Functions (Backend)
        ↓
    Smoke Tests
        ↓
    Production Live
```

---

## 🎯 Future Architecture Enhancements

### Phase 2
- Real-time collaboration (WebSockets)
- Video integration (HLS streaming)
- Advanced caching (Redis)
- Search optimization (Elasticsearch)

### Phase 3
- Mobile app (React Native)
- GraphQL API
- Microservices architecture
- Event-driven system

### Phase 4
- Multi-region deployment
- Advanced analytics pipeline
- Machine learning recommendations
- Custom AI models

---

**Modern Architecture | Built for Scale | Production-Ready**

*Designed with React, TypeScript, Supabase, and OpenAI*
