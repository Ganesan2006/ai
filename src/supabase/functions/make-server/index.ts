import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.ts";

const app = new Hono();

// Enable CORS for all routes and methods
app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to verify user authentication
async function verifyAuth(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

// Health check endpoint
app.get("/make-server-2ba89cfc/health", (c) => {
  const hasSupabaseUrl = !!Deno.env.get('SUPABASE_URL');
  const hasServiceKey = !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  return c.json({ 
    status: "ok",
    timestamp: new Date().toISOString(),
    env: {
      hasSupabaseUrl,
      hasServiceKey,
      supabaseUrl: hasSupabaseUrl ? 'configured' : 'missing'
    }
  });
});

// Test endpoint to verify backend is working
app.get("/make-server-2ba89cfc/test", (c) => {
  return c.json({ 
    message: "Backend is working!",
    timestamp: new Date().toISOString()
  });
});

// OPTIONS handler for signup (CORS preflight)
app.options("/make-server-2ba89cfc/signup", (c) => {
  return c.text("", 204);
});

// User signup endpoint
app.post("/make-server-2ba89cfc/signup", async (c) => {
  try {
    console.log('Signup endpoint called');
    
    let body;
    try {
      body = await c.req.json();
      console.log('Signup request body:', { email: body.email, name: body.name });
    } catch (parseError) {
      console.log('Failed to parse request body:', parseError);
      return c.json({ error: "Invalid request body" }, 400);
    }

    const { email, password, name } = body;

    if (!email || !password || !name) {
      console.log('Missing required fields');
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    // First, check if user already exists
    console.log('Checking if user exists...');
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (!listError && existingUsers) {
      const existingUser = existingUsers.users.find(u => u.email === email);
      if (existingUser) {
        console.log('User already exists:', existingUser.id);
        
        // Check if the user is confirmed
        if (existingUser.email_confirmed_at) {
          console.log('User is confirmed, suggesting login');
          return c.json({ 
            error: "A user with this email already exists. Please sign in instead.",
            userExists: true,
            needsLogin: true
          }, 400);
        } else {
          console.log('User exists but not confirmed, deleting and recreating...');
          // Delete the unconfirmed user and create a new one
          await supabase.auth.admin.deleteUser(existingUser.id);
        }
      }
    }

    console.log('Creating user with Supabase...');
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true
    });

    if (error) {
      console.log('Supabase signup error:', error);
      
      // Provide more helpful error messages
      if (error.message.includes('already registered')) {
        return c.json({ 
          error: "This email is already registered. Please try signing in instead.",
          userExists: true,
          needsLogin: true
        }, 400);
      }
      
      return c.json({ error: error.message }, 400);
    }

    console.log('User created successfully:', data.user?.id);
    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log('Signup exception:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Password reset endpoint - allows admin to reset a user's password
app.post("/make-server-2ba89cfc/reset-password", async (c) => {
  try {
    console.log('Password reset endpoint called');
    
    const body = await c.req.json();
    const { email, newPassword } = body;

    if (!email || !newPassword) {
      return c.json({ error: "Email and new password are required" }, 400);
    }

    // Find the user by email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.log('Error listing users:', listError);
      return c.json({ error: "Failed to find user" }, 500);
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      return c.json({ error: "No user found with this email address" }, 404);
    }

    // Update the user's password
    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (error) {
      console.log('Password update error:', error);
      return c.json({ error: error.message }, 400);
    }

    console.log('Password reset successful for user:', user.id);
    return c.json({ success: true, message: "Password has been reset successfully" });
  } catch (error) {
    console.log('Password reset exception:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Delete user endpoint - allows removing a user account
app.post("/make-server-2ba89cfc/delete-user", async (c) => {
  try {
    console.log('Delete user endpoint called');
    
    const body = await c.req.json();
    const { email } = body;

    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }

    // Find the user by email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.log('Error listing users:', listError);
      return c.json({ error: "Failed to find user" }, 500);
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      return c.json({ error: "No user found with this email address" }, 404);
    }

    // Delete the user
    const { error } = await supabase.auth.admin.deleteUser(user.id);

    if (error) {
      console.log('User deletion error:', error);
      return c.json({ error: error.message }, 400);
    }

    console.log('User deleted successfully:', user.id);
    return c.json({ success: true, message: "User account has been deleted successfully" });
  } catch (error) {
    console.log('Delete user exception:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Create/Update user profile
app.post("/make-server-2ba89cfc/profile", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const profile = {
      userId: user.id,
      email: user.email,
      name: user.user_metadata.name,
      background: body.background,
      currentRole: body.currentRole,
      yearsOfExperience: body.yearsOfExperience,
      knownSkills: body.knownSkills || [],
      targetGoal: body.targetGoal,
      preferredLanguage: body.preferredLanguage,
      learningPace: body.learningPace,
      hoursPerWeek: body.hoursPerWeek,
      learningStyle: body.learningStyle,
      onboardingComplete: body.onboardingComplete || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`profile:${user.id}`, profile);
    return c.json({ success: true, profile });
  } catch (error) {
    console.log('Profile creation error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get user profile
app.get("/make-server-2ba89cfc/profile", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await kv.get(`profile:${user.id}`);
    if (!profile) {
      return c.json({ 
        profile: {
          userId: user.id,
          email: user.email,
          name: user.user_metadata.name,
          onboardingComplete: false
        }
      });
    }

    return c.json({ profile });
  } catch (error) {
    console.log('Get profile error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Generate personalized roadmap using AI
app.post("/make-server-2ba89cfc/generate-roadmap", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await kv.get(`profile:${user.id}`);
    if (!profile) {
      return c.json({ error: "Profile not found. Please complete onboarding first." }, 400);
    }

    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) {
      console.log('OpenAI API key not configured');
      // Return a template roadmap for demo purposes
      const templateRoadmap = generateTemplateRoadmap(profile);
      await kv.set(`roadmap:${user.id}`, templateRoadmap);
      return c.json({ roadmap: templateRoadmap });
    }

    // Call OpenAI to generate personalized roadmap
    const prompt = `Generate a comprehensive, personalized learning roadmap for a student/professional with the following profile:

Background: ${profile.background}
Current Role: ${profile.currentRole}
Years of Experience: ${profile.yearsOfExperience}
Known Skills: ${profile.knownSkills.join(', ')}
Target Goal: ${profile.targetGoal}
Preferred Programming Language: ${profile.preferredLanguage}
Learning Pace: ${profile.learningPace}
Hours per Week: ${profile.hoursPerWeek}
Learning Style: ${profile.learningStyle}

Create a structured learning roadmap with:
1. Prerequisites (foundational skills needed)
2. Core Concepts (essential skills for the target role)
3. Advanced Topics (specialization areas)
4. Tools & Frameworks (industry-standard tools)
5. Estimated timeline for each module based on ${profile.hoursPerWeek} hours/week

Format the response as JSON with the following structure:
{
  "phases": [
    {
      "id": "phase-1",
      "title": "Phase Title",
      "description": "Phase description",
      "estimatedWeeks": 4,
      "modules": [
        {
          "id": "module-1",
          "title": "Module Title",
          "description": "Module description",
          "topics": ["Topic 1", "Topic 2"],
          "estimatedHours": 20,
          "difficulty": "beginner|intermediate|advanced",
          "resources": [
            { "type": "video|article|course", "title": "Resource title", "url": "" }
          ]
        }
      ]
    }
  ],
  "totalEstimatedWeeks": 24,
  "skillsToMaster": ["Skill 1", "Skill 2"]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert career counselor and learning path designer. Generate structured, personalized learning roadmaps in JSON format.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.log('OpenAI API error:', error);
      const templateRoadmap = generateTemplateRoadmap(profile);
      await kv.set(`roadmap:${user.id}`, templateRoadmap);
      return c.json({ roadmap: templateRoadmap });
    }

    const data = await response.json();
    const roadmapContent = JSON.parse(data.choices[0].message.content);
    
    const roadmap = {
      userId: user.id,
      targetGoal: profile.targetGoal,
      content: roadmapContent,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    await kv.set(`roadmap:${user.id}`, roadmap);
    return c.json({ roadmap });
  } catch (error) {
    console.log('Roadmap generation error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get user's roadmap
app.get("/make-server-2ba89cfc/roadmap", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const roadmap = await kv.get(`roadmap:${user.id}`);
    if (!roadmap) {
      return c.json({ roadmap: null });
    }

    return c.json({ roadmap });
  } catch (error) {
    console.log('Get roadmap error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Update progress for a module
app.post("/make-server-2ba89cfc/progress", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { moduleId, status, timeSpent, performanceScore, notes } = body;

    const progressKey = `progress:${user.id}:${moduleId}`;
    const existingProgress = await kv.get(progressKey) || {};

    const progress = {
      ...existingProgress,
      userId: user.id,
      moduleId,
      status: status || existingProgress.status || 'not-started',
      timeSpent: (existingProgress.timeSpent || 0) + (timeSpent || 0),
      performanceScore: performanceScore || existingProgress.performanceScore,
      notes: notes || existingProgress.notes,
      lastUpdated: new Date().toISOString(),
      completedAt: status === 'completed' ? new Date().toISOString() : existingProgress.completedAt
    };

    await kv.set(progressKey, progress);
    return c.json({ success: true, progress });
  } catch (error) {
    console.log('Progress update error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get all progress for user
app.get("/make-server-2ba89cfc/progress", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const progressItems = await kv.getByPrefix(`progress:${user.id}:`);
    return c.json({ progress: progressItems });
  } catch (error) {
    console.log('Get progress error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// AI Chat Assistant
app.post("/make-server-2ba89cfc/chat", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { message, conversationHistory } = body;

    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) {
      return c.json({ 
        response: "The AI chat assistant requires an OpenAI API key to be configured. Please add your OpenAI API key to use this feature.",
        requiresSetup: true
      });
    }

    // Get user profile and roadmap for context
    const profile = await kv.get(`profile:${user.id}`);
    const roadmap = await kv.get(`roadmap:${user.id}`);

    const systemPrompt = `You are an AI learning mentor helping a student achieve their career goal. 

Student Profile:
- Target Goal: ${profile?.targetGoal || 'Not specified'}
- Background: ${profile?.background || 'Not specified'}
- Current Role: ${profile?.currentRole || 'Not specified'}
- Known Skills: ${profile?.knownSkills?.join(', ') || 'None listed'}
- Learning Pace: ${profile?.learningPace || 'Not specified'}

Provide helpful, encouraging guidance. Answer questions about concepts, provide code examples when relevant, suggest resources, and help them stay motivated. Keep responses concise but informative.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.log('Chat API error:', error);
      return c.json({ error: 'Failed to get response from AI assistant' }, 500);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Save chat history
    const chatHistory = await kv.get(`chat:${user.id}`) || [];
    chatHistory.push(
      { role: 'user', content: message, timestamp: new Date().toISOString() },
      { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() }
    );
    
    // Keep only last 50 messages
    if (chatHistory.length > 50) {
      chatHistory.splice(0, chatHistory.length - 50);
    }
    
    await kv.set(`chat:${user.id}`, chatHistory);

    return c.json({ response: aiResponse });
  } catch (error) {
    console.log('Chat error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get chat history
app.get("/make-server-2ba89cfc/chat/history", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const chatHistory = await kv.get(`chat:${user.id}`) || [];
    return c.json({ history: chatHistory });
  } catch (error) {
    console.log('Get chat history error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Save assessment result
app.post("/make-server-2ba89cfc/assessment", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { moduleId, score, results } = body;

    const assessment = {
      userId: user.id,
      moduleId,
      score,
      results,
      completedAt: new Date().toISOString()
    };

    await kv.set(`assessment:${user.id}:${moduleId}:${Date.now()}`, assessment);
    return c.json({ success: true, assessment });
  } catch (error) {
    console.log('Assessment save error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Save challenge completion
app.post("/make-server-2ba89cfc/challenge", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { challengeId, code } = body;

    const challenge = {
      userId: user.id,
      challengeId,
      code,
      completedAt: new Date().toISOString()
    };

    await kv.set(`challenge:${user.id}:${challengeId}`, challenge);
    return c.json({ success: true, challenge });
  } catch (error) {
    console.log('Challenge save error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get user achievements
app.get("/make-server-2ba89cfc/achievements", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const achievements = await kv.get(`achievements:${user.id}`) || {
      unlocked: [],
      xp: 0,
      level: 1,
      streak: 0
    };

    return c.json({ achievements });
  } catch (error) {
    console.log('Get achievements error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Update achievement
app.post("/make-server-2ba89cfc/achievements", async (c) => {
  try {
    const user = await verifyAuth(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { achievementId, xp } = body;

    const achievements = await kv.get(`achievements:${user.id}`) || {
      unlocked: [],
      xp: 0,
      level: 1,
      streak: 0
    };

    if (!achievements.unlocked.includes(achievementId)) {
      achievements.unlocked.push(achievementId);
      achievements.xp += xp;
      achievements.level = Math.floor(achievements.xp / 1000) + 1;
    }

    await kv.set(`achievements:${user.id}`, achievements);
    return c.json({ success: true, achievements });
  } catch (error) {
    console.log('Update achievement error:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Helper function to generate template roadmap
function generateTemplateRoadmap(profile: any) {
  const goal = profile.targetGoal || 'Full-Stack Developer';
  const language = profile.preferredLanguage || 'JavaScript';
  
  // Template roadmaps for common career goals
  const templates: Record<string, any> = {
    'Data Scientist': {
      phases: [
        {
          id: 'phase-1',
          title: 'Foundations',
          description: 'Build a strong foundation in programming, mathematics, and statistics',
          estimatedWeeks: 8,
          modules: [
            {
              id: 'module-1-1',
              title: 'Python Programming Basics',
              description: 'Master Python syntax, data structures, and basic programming concepts',
              topics: ['Variables & Data Types', 'Control Flow', 'Functions', 'OOP Basics', 'File I/O'],
              estimatedHours: 40,
              difficulty: 'beginner',
              resources: []
            },
            {
              id: 'module-1-2',
              title: 'Statistics & Probability',
              description: 'Understand statistical concepts essential for data science',
              topics: ['Descriptive Statistics', 'Probability Distributions', 'Hypothesis Testing', 'Correlation'],
              estimatedHours: 35,
              difficulty: 'beginner',
              resources: []
            },
            {
              id: 'module-1-3',
              title: 'Linear Algebra & Calculus',
              description: 'Learn mathematical foundations for machine learning',
              topics: ['Vectors & Matrices', 'Matrix Operations', 'Derivatives', 'Gradients'],
              estimatedHours: 30,
              difficulty: 'intermediate',
              resources: []
            }
          ]
        },
        {
          id: 'phase-2',
          title: 'Data Analysis & Visualization',
          description: 'Learn to manipulate, analyze, and visualize data',
          estimatedWeeks: 6,
          modules: [
            {
              id: 'module-2-1',
              title: 'NumPy & Pandas',
              description: 'Master data manipulation with NumPy and Pandas',
              topics: ['NumPy Arrays', 'Pandas DataFrames', 'Data Cleaning', 'Data Transformation'],
              estimatedHours: 30,
              difficulty: 'intermediate',
              resources: []
            },
            {
              id: 'module-2-2',
              title: 'Data Visualization',
              description: 'Create compelling visualizations with Matplotlib and Seaborn',
              topics: ['Matplotlib Basics', 'Seaborn', 'Statistical Plots', 'Interactive Visualizations'],
              estimatedHours: 25,
              difficulty: 'intermediate',
              resources: []
            }
          ]
        },
        {
          id: 'phase-3',
          title: 'Machine Learning',
          description: 'Build and deploy machine learning models',
          estimatedWeeks: 10,
          modules: [
            {
              id: 'module-3-1',
              title: 'Supervised Learning',
              description: 'Learn regression and classification algorithms',
              topics: ['Linear Regression', 'Logistic Regression', 'Decision Trees', 'Random Forests', 'SVM'],
              estimatedHours: 45,
              difficulty: 'advanced',
              resources: []
            },
            {
              id: 'module-3-2',
              title: 'Unsupervised Learning',
              description: 'Explore clustering and dimensionality reduction',
              topics: ['K-Means Clustering', 'Hierarchical Clustering', 'PCA', 't-SNE'],
              estimatedHours: 35,
              difficulty: 'advanced',
              resources: []
            },
            {
              id: 'module-3-3',
              title: 'Model Evaluation & Deployment',
              description: 'Evaluate models and deploy to production',
              topics: ['Cross-Validation', 'Hyperparameter Tuning', 'Model Metrics', 'Flask API', 'Docker'],
              estimatedHours: 30,
              difficulty: 'advanced',
              resources: []
            }
          ]
        }
      ],
      totalEstimatedWeeks: 24,
      skillsToMaster: ['Python', 'Statistics', 'Machine Learning', 'Data Visualization', 'SQL']
    },
    'Full-Stack Developer': {
      phases: [
        {
          id: 'phase-1',
          title: 'Frontend Fundamentals',
          description: 'Master the building blocks of web development',
          estimatedWeeks: 6,
          modules: [
            {
              id: 'module-1-1',
              title: 'HTML & CSS',
              description: 'Learn to structure and style web pages',
              topics: ['HTML5 Semantics', 'CSS Flexbox', 'CSS Grid', 'Responsive Design', 'CSS Animations'],
              estimatedHours: 30,
              difficulty: 'beginner',
              resources: []
            },
            {
              id: 'module-1-2',
              title: 'JavaScript Fundamentals',
              description: 'Master modern JavaScript',
              topics: ['ES6+ Syntax', 'DOM Manipulation', 'Async/Await', 'Promises', 'Fetch API'],
              estimatedHours: 40,
              difficulty: 'beginner',
              resources: []
            }
          ]
        },
        {
          id: 'phase-2',
          title: 'Modern Frontend',
          description: 'Build interactive UIs with React',
          estimatedWeeks: 8,
          modules: [
            {
              id: 'module-2-1',
              title: 'React Fundamentals',
              description: 'Learn component-based development',
              topics: ['Components', 'Props & State', 'Hooks', 'Context API', 'React Router'],
              estimatedHours: 45,
              difficulty: 'intermediate',
              resources: []
            },
            {
              id: 'module-2-2',
              title: 'State Management',
              description: 'Manage complex application state',
              topics: ['Redux', 'Redux Toolkit', 'Context Patterns', 'TanStack Query'],
              estimatedHours: 30,
              difficulty: 'intermediate',
              resources: []
            }
          ]
        },
        {
          id: 'phase-3',
          title: 'Backend Development',
          description: 'Build robust server-side applications',
          estimatedWeeks: 10,
          modules: [
            {
              id: 'module-3-1',
              title: 'Node.js & Express',
              description: 'Create RESTful APIs',
              topics: ['Express Setup', 'Routing', 'Middleware', 'Error Handling', 'Authentication'],
              estimatedHours: 40,
              difficulty: 'intermediate',
              resources: []
            },
            {
              id: 'module-3-2',
              title: 'Databases',
              description: 'Work with SQL and NoSQL databases',
              topics: ['PostgreSQL', 'MongoDB', 'ORMs', 'Database Design', 'Transactions'],
              estimatedHours: 35,
              difficulty: 'advanced',
              resources: []
            },
            {
              id: 'module-3-3',
              title: 'Deployment & DevOps',
              description: 'Deploy applications to production',
              topics: ['Docker', 'CI/CD', 'AWS/Vercel', 'Monitoring', 'Testing'],
              estimatedHours: 30,
              difficulty: 'advanced',
              resources: []
            }
          ]
        }
      ],
      totalEstimatedWeeks: 24,
      skillsToMaster: ['React', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS']
    }
  };

  const templateKey = Object.keys(templates).find(key => goal.includes(key)) || 'Full-Stack Developer';
  const template = templates[templateKey];

  return {
    userId: profile.userId,
    targetGoal: goal,
    content: template,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    isTemplate: true
  };
}

Deno.serve(app.fetch);
