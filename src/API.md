# API Documentation

## 📋 Overview

Complete API reference for the AI-Powered Learning Mentor Platform backend.

**Base URL:** `https://[PROJECT_ID].supabase.co/functions/v1/make-server-2ba89cfc`

**Authentication:** All protected endpoints require Bearer token in Authorization header.

---

## 🔐 Authentication

### Headers Required

```http
Content-Type: application/json
Authorization: Bearer {access_token}
```

---

## 📡 Endpoints

### 1. Health Check

Check if the backend is running.

```http
GET /health
```

#### Response

```json
{
  "status": "ok",
  "timestamp": "2025-10-25T12:00:00.000Z",
  "env": {
    "hasSupabaseUrl": true,
    "hasServiceKey": true,
    "supabaseUrl": "configured"
  }
}
```

---

### 2. User Signup

Create a new user account.

```http
POST /signup
```

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

#### Success Response (201)

```json
{
  "success": true,
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "email_confirmed_at": "2025-10-25T12:00:00Z",
    "user_metadata": {
      "name": "John Doe"
    }
  }
}
```

#### Error Responses

**400 - Missing Fields**
```json
{
  "error": "Email, password, and name are required"
}
```

**409 - User Exists**
```json
{
  "error": "User already registered",
  "suggestion": "Please use the sign-in page to log in"
}
```

---

### 3. Create Profile

Create or update user profile after onboarding.

```http
POST /profile/create
Authorization: Bearer {access_token}
```

#### Request Body

```json
{
  "name": "John Doe",
  "background": "Computer Science",
  "currentRole": "Software Engineer",
  "yearsOfExperience": "2-5 years",
  "knownSkills": ["JavaScript", "Python", "React"],
  "targetGoal": "Data Scientist",
  "preferredLanguage": "Python",
  "learningPace": "Moderate",
  "hoursPerWeek": "10-15 hours",
  "learningStyle": "Visual",
  "onboardingComplete": true
}
```

#### Success Response (200)

```json
{
  "success": true,
  "profile": {
    "userId": "uuid-here",
    "name": "John Doe",
    "background": "Computer Science",
    // ... all profile fields
    "createdAt": "2025-10-25T12:00:00.000Z",
    "updatedAt": "2025-10-25T12:00:00.000Z"
  }
}
```

#### Error Responses

**401 - Unauthorized**
```json
{
  "error": "Unauthorized"
}
```

**400 - Missing Fields**
```json
{
  "error": "Name and targetGoal are required"
}
```

---

### 4. Get Profile

Retrieve user profile.

```http
GET /profile
Authorization: Bearer {access_token}
```

#### Success Response (200)

```json
{
  "success": true,
  "profile": {
    "userId": "uuid-here",
    "name": "John Doe",
    "email": "user@example.com",
    "background": "Computer Science",
    "targetGoal": "Data Scientist",
    "onboardingComplete": true,
    // ... other fields
  }
}
```

#### Error Responses

**401 - Unauthorized**
```json
{
  "error": "Unauthorized"
}
```

**404 - Not Found**
```json
{
  "error": "Profile not found"
}
```

---

### 5. Generate Roadmap

Generate AI-powered personalized learning roadmap.

```http
POST /generate-roadmap
Authorization: Bearer {access_token}
```

#### Request Body

```json
{
  "profile": {
    "targetGoal": "Data Scientist",
    "background": "Computer Science",
    "knownSkills": ["Python", "Statistics"],
    "hoursPerWeek": "10-15 hours"
  }
}
```

#### Success Response (200)

```json
{
  "success": true,
  "roadmap": {
    "userId": "uuid-here",
    "content": {
      "targetRole": "Data Scientist",
      "phases": [
        {
          "phase": 1,
          "title": "Foundations",
          "description": "Build core fundamentals",
          "duration": "4-6 weeks",
          "modules": [
            {
              "id": "module-1",
              "title": "Python Programming Basics",
              "description": "Master Python fundamentals",
              "difficulty": "beginner",
              "estimatedHours": 20,
              "topics": [
                "Variables and data types",
                "Control structures",
                "Functions and modules"
              ]
            }
          ]
        }
      ],
      "skillsToMaster": [
        "Python",
        "Statistics",
        "Machine Learning",
        "Data Visualization"
      ],
      "estimatedTimeline": "16-20 weeks"
    },
    "generatedAt": "2025-10-25T12:00:00.000Z"
  }
}
```

#### Error Responses

**401 - Unauthorized**
```json
{
  "error": "Unauthorized"
}
```

**503 - AI Service Unavailable**
```json
{
  "error": "Failed to generate roadmap",
  "fallback": "Using template roadmap"
}
```

---

### 6. Get Roadmap

Retrieve user's learning roadmap.

```http
GET /roadmap
Authorization: Bearer {access_token}
```

#### Success Response (200)

```json
{
  "success": true,
  "roadmap": {
    "userId": "uuid-here",
    "content": {
      "targetRole": "Data Scientist",
      "phases": [...],
      "skillsToMaster": [...],
      "estimatedTimeline": "16-20 weeks"
    },
    "generatedAt": "2025-10-25T12:00:00.000Z",
    "lastUpdated": "2025-10-25T12:00:00.000Z"
  }
}
```

---

### 7. Update Progress

Update learning progress for a module.

```http
POST /progress/update
Authorization: Bearer {access_token}
```

#### Request Body

```json
{
  "moduleId": "module-1",
  "status": "completed",
  "timeSpent": 25,
  "notes": "Completed all exercises"
}
```

**Status Options:**
- `not-started`
- `in-progress`
- `completed`

#### Success Response (200)

```json
{
  "success": true,
  "progress": {
    "userId": "uuid-here",
    "moduleId": "module-1",
    "status": "completed",
    "timeSpent": 25,
    "notes": "Completed all exercises",
    "completedAt": "2025-10-25T12:00:00.000Z",
    "lastUpdated": "2025-10-25T12:00:00.000Z"
  }
}
```

---

### 8. Get Progress

Retrieve all learning progress.

```http
GET /progress
Authorization: Bearer {access_token}
```

#### Success Response (200)

```json
{
  "success": true,
  "progress": [
    {
      "moduleId": "module-1",
      "status": "completed",
      "timeSpent": 25,
      "completedAt": "2025-10-25T12:00:00.000Z"
    },
    {
      "moduleId": "module-2",
      "status": "in-progress",
      "timeSpent": 10
    }
  ]
}
```

---

### 9. AI Chat

Send message to AI assistant.

```http
POST /chat
Authorization: Bearer {access_token}
```

#### Request Body

```json
{
  "message": "How do I learn Python?",
  "conversationHistory": [
    {
      "role": "user",
      "content": "I'm new to programming"
    },
    {
      "role": "assistant",
      "content": "Welcome! I'd be happy to help you get started."
    }
  ]
}
```

#### Success Response (200)

```json
{
  "success": true,
  "response": "To learn Python, I recommend starting with...",
  "conversationHistory": [
    // Updated history with new messages
  ]
}
```

#### Error Responses

**401 - Unauthorized**
```json
{
  "error": "Unauthorized"
}
```

**503 - AI Service Unavailable**
```json
{
  "error": "AI service temporarily unavailable. Please try again later."
}
```

---

## 🔄 Common Patterns

### Pagination

For endpoints returning lists, use query parameters:

```http
GET /resources?page=1&limit=20
```

### Filtering

```http
GET /progress?status=completed
```

### Sorting

```http
GET /resources?sortBy=createdAt&order=desc
```

---

## ⚠️ Error Handling

### Standard Error Response

```json
{
  "error": "Error message here",
  "code": "ERROR_CODE",
  "details": {
    // Additional error context
  }
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error
- `503` - Service Unavailable

---

## 🔒 Rate Limiting

### Current Limits

- **Authentication endpoints:** 10 requests/minute
- **API endpoints:** 100 requests/minute per user
- **AI endpoints:** 20 requests/minute per user

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1635000000
```

### Rate Limit Exceeded Response

```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```

---

## 📊 Data Models

### User Profile

```typescript
interface UserProfile {
  userId: string;
  email: string;
  name: string;
  background: string;
  currentRole: string;
  yearsOfExperience: string;
  knownSkills: string[];
  targetGoal: string;
  preferredLanguage: string;
  learningPace: string;
  hoursPerWeek: string;
  learningStyle: string;
  onboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Learning Roadmap

```typescript
interface Roadmap {
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

interface Phase {
  phase: number;
  title: string;
  description: string;
  duration: string;
  modules: Module[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  topics: string[];
}
```

### Progress

```typescript
interface Progress {
  userId: string;
  moduleId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  timeSpent: number;
  notes?: string;
  completedAt?: Date;
  lastUpdated: Date;
}
```

### Chat Message

```typescript
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}
```

---

## 🧪 Testing

### Example with cURL

```bash
# Health check
curl https://[PROJECT_ID].supabase.co/functions/v1/make-server-2ba89cfc/health

# Signup
curl -X POST \
  https://[PROJECT_ID].supabase.co/functions/v1/make-server-2ba89cfc/signup \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'

# Get profile (authenticated)
curl https://[PROJECT_ID].supabase.co/functions/v1/make-server-2ba89cfc/profile \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

### Example with JavaScript

```javascript
// Using fetch
const response = await fetch(
  'https://[PROJECT_ID].supabase.co/functions/v1/make-server-2ba89cfc/profile',
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  }
);

const data = await response.json();
```

### Example with the API Client

```typescript
import { api } from './utils/api';

// Get profile
const { profile } = await api.getProfile(accessToken);

// Update progress
await api.updateProgress(
  {
    moduleId: 'module-1',
    status: 'completed',
    timeSpent: 25
  },
  accessToken
);
```

---

## 📝 Best Practices

### 1. Always Include Authorization

```javascript
headers: {
  'Authorization': `Bearer ${accessToken}`
}
```

### 2. Handle Errors Gracefully

```javascript
try {
  const response = await api.getProfile(accessToken);
} catch (error) {
  if (error.status === 401) {
    // Redirect to login
  } else {
    // Show error message
  }
}
```

### 3. Use TypeScript Types

```typescript
import type { UserProfile, Roadmap, Progress } from './types';
```

### 4. Implement Retry Logic

```javascript
const fetchWithRetry = async (url, options, retries = 3) => {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (retries > 0) {
      await sleep(1000);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
};
```

### 5. Cache Responses

```javascript
// Cache user profile for 5 minutes
const cacheTime = 5 * 60 * 1000;
let cachedProfile = null;
let cacheTimestamp = 0;

async function getProfile() {
  const now = Date.now();
  if (cachedProfile && now - cacheTimestamp < cacheTime) {
    return cachedProfile;
  }
  
  cachedProfile = await api.getProfile(accessToken);
  cacheTimestamp = now;
  return cachedProfile;
}
```

---

## 🔄 Webhooks (Future)

### Coming Soon

- Progress update notifications
- Achievement unlocked events
- Community activity alerts
- Learning streak reminders

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [API Testing with Postman](https://www.postman.com)

---

**RESTful API | Secure | Scalable | Well-Documented**

*Built with Deno, Hono, and Supabase*
