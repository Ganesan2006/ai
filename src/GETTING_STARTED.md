# Getting Started

## 🎯 Quick Start Guide

Welcome to the AI-Powered Learning Mentor Platform! This guide will help you get started quickly.

---

## 👥 For Users

### First Time? Create Your Account

1. **Visit the Platform**
   - Click "Get Started" on the landing page

2. **Sign Up**
   - Enter your email address
   - Create a secure password (minimum 6 characters)
   - Provide your full name
   - Click "Sign Up"

3. **Complete Onboarding** (4 Easy Steps)
   
   **Step 1: Background & Experience**
   - Select your educational/professional background
   - Enter your current role
   - Choose your years of experience
   - Select technologies you already know

   **Step 2: Career Goals**
   - Choose your target career goal
   - Select preferred programming language

   **Step 3: Learning Preferences**
   - Set your learning pace (Relaxed/Moderate/Intensive)
   - Specify hours per week available
   
   **Step 4: Learning Style**
   - Choose your learning style
   - Review your profile
   - Submit

4. **Get Your AI Roadmap**
   - Wait 10-30 seconds for AI to generate your personalized roadmap
   - Your custom learning path is created based on your profile!

5. **Start Learning!**
   - Explore your personalized roadmap
   - Track your progress
   - Use the AI assistant for help anytime

### Already Have an Account?

1. Click "Get Started"
2. Click "Already have an account? Sign in"
3. Enter your email and password
4. Click "Sign In"

---

## 🎓 Platform Features

### 6 Main Tabs

#### 1. 📚 Roadmap
Your personalized learning path with:
- **Phases**: Foundations → Core → Advanced
- **Modules**: Detailed learning topics
- **Progress Tracking**: Mark modules as in-progress or completed
- **Time Estimates**: Know how long each module takes

**How to Use:**
- Browse your roadmap phases
- Click on modules to see details
- Mark modules "In Progress" when starting
- Mark "Completed" when finished
- Track your overall progress

#### 2. 💻 Practice
Hands-on coding challenges:
- **Interactive Code Editor**: Write code in the browser
- **Test Cases**: Validate your solutions
- **Hints**: Get help when stuck
- **Multiple Challenges**: Various difficulty levels

**How to Use:**
- Read the challenge description
- Write your code in the editor
- Click "Run Code" to test
- Use hints if needed
- Submit when tests pass
- Earn XP for completion!

#### 3. 📝 Quiz
Test your knowledge:
- **Module Assessments**: Quiz after each module
- **Multiple Choice**: Clear questions
- **Instant Feedback**: Know immediately if correct
- **Explanations**: Learn from mistakes
- **Score Tracking**: Monitor performance

**How to Use:**
- Start a quiz when ready
- Read each question carefully
- Select your answer
- Get instant feedback
- Review explanations
- See your final score

#### 4. 👥 Community
Connect with learners:
- **Discussion Forum**: Ask questions, share knowledge
- **Study Buddies**: Find learning partners
- **Search & Filter**: Find relevant discussions
- **Engage**: Like and reply to posts

**How to Use:**
- Browse forum discussions
- Search for topics
- Create new posts
- Reply to others
- Find study buddies with similar goals
- Build your learning network

#### 5. 📖 Resources
Curated learning materials:
- **Multiple Formats**: Videos, articles, courses, books
- **Bookmarks**: Save favorites
- **Search & Filter**: Find what you need
- **Recommendations**: AI-suggested resources
- **Ratings**: See what others recommend

**How to Use:**
- Browse recommended resources
- Search by topic or type
- Bookmark useful materials
- Filter by difficulty
- Rate resources you've used

#### 6. 🏆 Achievements
Gamification & motivation:
- **XP System**: Earn points for activities
- **Levels**: Level up as you learn
- **Badges**: Unlock achievements
- **Daily Challenges**: Stay motivated
- **Streaks**: Build consistent habits

**How to Use:**
- Check your current level and XP
- View unlocked achievements
- See available badges
- Complete daily challenges
- Track your learning streak
- Compete with yourself!

---

## 🤖 AI Assistant

### Your 24/7 Learning Helper

**Access:** Click "AI Assistant" button in the top right

**What It Can Do:**
- Answer questions about your learning path
- Explain difficult concepts
- Help debug code
- Recommend resources
- Provide study strategies
- Give career advice

**How to Use:**
1. Click "AI Assistant"
2. Type your question
3. Get personalized help
4. Ask follow-up questions
5. Chat history is saved

**Example Questions:**
- "How should I approach learning Python?"
- "Can you explain what a variable is?"
- "What's the best way to practice data structures?"
- "Help me debug this code..."
- "What skills do I need for my target role?"

---

## 📊 Progress Tracking

### Track Your Journey

**What's Tracked:**
- Modules completed
- Time spent learning
- Assessment scores
- Coding challenges completed
- XP and level
- Learning streak

**View Progress:**
- Dashboard stats at the top
- Overall completion percentage
- Modules completed vs total
- Time invested
- Achievements unlocked

**Stay Motivated:**
- Set weekly learning goals
- Complete daily challenges
- Maintain your streak
- Unlock new achievements
- Level up your profile

---

## 💡 Tips for Success

### Learning Best Practices

1. **Set a Schedule**
   - Block dedicated learning time
   - Stick to your hours per week commitment
   - Consistency > Intensity

2. **Follow Your Roadmap**
   - Complete phases in order
   - Don't skip foundational modules
   - Practice before moving on

3. **Use All Features**
   - Watch videos AND do challenges
   - Take quizzes to validate knowledge
   - Join community discussions
   - Chat with AI when stuck

4. **Track Progress**
   - Mark modules completed
   - Log time spent
   - Review achievements
   - Celebrate milestones

5. **Stay Engaged**
   - Complete daily challenges
   - Help others in the community
   - Share your progress
   - Connect with study buddies

6. **Ask for Help**
   - Use the AI assistant
   - Post in the community
   - Don't struggle alone
   - Learning is collaborative!

---

## 🚀 For Developers

### Quick Setup

#### Prerequisites
- Node.js 16+ installed
- Supabase account
- OpenAI API key

#### Installation

```bash
# Clone the repository
git clone [repository-url]
cd learning-mentor-platform

# Install dependencies
npm install

# Set up environment variables
# See DEPLOYMENT.md for details

# Run development server
npm run dev
```

#### Environment Setup

Create `/utils/supabase/info.tsx`:
```typescript
export const projectId = 'YOUR_PROJECT_ID';
export const publicAnonKey = 'YOUR_ANON_KEY';
```

Set Supabase Edge Function environment variables:
```
SUPABASE_URL=https://[PROJECT_ID].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[your-service-key]
OPENAI_API_KEY=[your-openai-key]
```

#### Deploy Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref [PROJECT_ID]

# Deploy
supabase functions deploy make-server --no-verify-jwt
```

### Key Documentation

📚 **Essential Reading:**
- `/README.md` - Technical overview
- `/DEPLOYMENT.md` - Production deployment
- `/ARCHITECTURE.md` - System design
- `/API.md` - API reference
- `/FEATURES.md` - Feature details

### Tech Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS v4
- ShadCN UI components

**Backend:**
- Supabase (Auth + Database)
- Deno Edge Functions
- Hono framework

**AI:**
- OpenAI GPT-4o-mini

### Project Structure

```
/components     - React components
/hooks          - Custom hooks
/utils          - Utilities & API
/styles         - Global CSS
/supabase       - Edge Functions
```

### Development Commands

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check

# Lint
npm run lint

# Deploy Edge Functions
supabase functions deploy
```

---

## ❓ FAQ

### Common Questions

**Q: Is the platform free?**
A: Yes! The core platform is free to use.

**Q: Do I need to know coding to start?**
A: No! We have roadmaps for complete beginners.

**Q: How long does it take to complete a roadmap?**
A: Typically 12-24 weeks depending on your pace and hours per week.

**Q: Can I change my career goal later?**
A: Not currently, but you can create a new account with a different goal.

**Q: Is my data secure?**
A: Yes! We use industry-standard encryption and security practices.

**Q: Can I download my progress?**
A: Export features are coming in a future update.

**Q: Does the AI assistant really understand me?**
A: Yes! It has context about your profile and learning path.

**Q: Can I learn multiple career paths?**
A: Currently one path per account, but you can finish one and start another.

---

## 🆘 Need Help?

### Support Resources

1. **AI Assistant** - Click the button in the dashboard
2. **Community Forum** - Ask other learners
3. **Documentation** - Check `/README.md`
4. **API Docs** - See `/API.md` for technical details

---

## 🎉 Welcome Aboard!

You're now ready to start your learning journey. Remember:

✅ **Be Consistent** - Regular practice beats intensive cramming  
✅ **Stay Curious** - Ask questions, explore, experiment  
✅ **Join the Community** - Learn together, grow together  
✅ **Track Progress** - Celebrate small wins  
✅ **Have Fun** - Enjoy the journey!

---

**Ready to transform your career?** 

Click "Get Started" and begin your AI-powered learning journey today! 🚀

---

**Platform Status:** Production-Ready ✅  
**Support:** Community Forums + AI Assistant  
**Updates:** Regular feature additions

*Empowering learners worldwide with AI-driven education*
