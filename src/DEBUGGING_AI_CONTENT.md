# Debugging AI Content Generation

## Quick Checklist

If AI-generated content is not appearing, follow these steps:

### 1. Check OpenAI API Key

**In Supabase Dashboard:**
1. Go to your Supabase project
2. Navigate to Project Settings → Edge Functions → Secrets
3. Verify that `OPENAI_API_KEY` exists
4. If not, add it: `OPENAI_API_KEY = sk-your-key-here`
5. Redeploy the edge function

**Test in console:**
```bash
# In Supabase Edge Function logs
# You should see: "OpenAI API key: configured"
```

### 2. Check Browser Console

Open browser DevTools (F12) and look for:

```
Topic clicked: { topicIndex: 0, topic: "...", moduleId: "..." }
Checking for cached content...
Cached data response: { content: null }
Generating new content with AI...
Request data: { moduleId, moduleTitle, topic, difficulty, targetGoal }
```

**Common Errors:**

**Error: "OpenAI API key not configured"**
- Solution: Add OPENAI_API_KEY to Supabase secrets

**Error: "Unauthorized"**
- Solution: User session expired, refresh page and login again

**Error: "Failed to load topic content"**
- Check backend logs in Supabase dashboard
- Check network tab in DevTools for failed requests

### 3. Check Backend Logs

**In Supabase Dashboard:**
1. Go to Edge Functions
2. Select your function
3. View logs

**Expected logs when generating content:**
```
Generate topic content endpoint called
Generate content request: { moduleId, topic, ... }
Calling OpenAI API to generate content...
OpenAI response received
Content parsed successfully
Content cached successfully at: topic-content:user-id:module-id:topic
```

**Common Backend Errors:**

**"OpenAI API error: 401"**
- Invalid OpenAI API key
- Solution: Verify your OpenAI API key is correct

**"OpenAI API error: 429"**
- Rate limit exceeded
- Solution: Wait a few minutes or upgrade OpenAI plan

**"OpenAI API error: 500"**
- OpenAI service issue
- Solution: Try again later

### 4. Test the Flow Step-by-Step

#### Step 1: Verify Module Has Topics
In browser console:
```javascript
console.log('Module:', module);
console.log('Topics:', module.topics);
```

If `module.topics` is undefined or empty:
- The roadmap wasn't generated properly
- Regenerate roadmap from dashboard

#### Step 2: Verify Authentication
In browser console:
```javascript
console.log('Access Token:', accessToken);
```

If token is empty or undefined:
- Login again
- Check session storage

#### Step 3: Test API Manually
In browser console:
```javascript
const testTopic = {
  moduleId: 'module-1-1',
  moduleTitle: 'Test Module',
  topic: 'Test Topic',
  difficulty: 'beginner',
  targetGoal: 'Full-Stack Developer'
};

api.generateTopicContent(testTopic, accessToken)
  .then(data => console.log('Success:', data))
  .catch(err => console.error('Error:', err));
```

### 5. Verify Supabase Edge Function Deployment

1. Check if the function is deployed:
   ```bash
   supabase functions list
   ```

2. Check function status in Supabase dashboard
3. Redeploy if needed:
   ```bash
   supabase functions deploy make-server-2ba89cfc
   ```

### 6. Check Network Tab

In Browser DevTools → Network tab:

1. Click a topic
2. Look for these requests:
   - `GET /topic-content/...` (checking cache)
   - `POST /generate-topic-content` (generating new)

3. Check response:
   - Status should be 200
   - Response should have `content` object

**Common Issues:**

**404 Not Found**
- Edge function not deployed
- Wrong endpoint URL
- Solution: Redeploy function

**500 Internal Server Error**
- Check backend logs
- Usually OpenAI API key issue

**CORS Error**
- Function CORS settings incorrect
- Should be handled by backend

## Manual Testing Script

Add this to browser console on course page:

```javascript
// Test topic content generation
async function testTopicGeneration() {
  try {
    console.log('=== Testing Topic Content Generation ===');
    
    // 1. Check module
    console.log('1. Module:', {
      id: module.id,
      title: module.title,
      topics: module.topics
    });
    
    if (!module.topics || module.topics.length === 0) {
      console.error('❌ Module has no topics!');
      return;
    }
    
    // 2. Check auth
    console.log('2. Access Token:', accessToken ? 'Present' : 'Missing');
    if (!accessToken) {
      console.error('❌ No access token!');
      return;
    }
    
    // 3. Check profile
    console.log('3. Profile:', profile);
    if (!profile) {
      console.error('⚠️  No profile (will use default)');
    }
    
    // 4. Try to generate content
    const testData = {
      moduleId: module.id,
      moduleTitle: module.title,
      topic: module.topics[0],
      difficulty: module.difficulty || 'intermediate',
      targetGoal: profile?.targetGoal || 'Technology Professional'
    };
    
    console.log('4. Generating content with:', testData);
    
    const result = await api.generateTopicContent(testData, accessToken);
    
    console.log('✅ Success! Generated content:', result);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testTopicGeneration();
```

## Quick Fixes

### Fix 1: Regenerate Roadmap
If topics are missing:
1. Go to dashboard
2. Click "Generate New Roadmap" (if available)
3. Or contact support to reset roadmap

### Fix 2: Clear Cache and Reload
1. Open DevTools
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"
4. Login again

### Fix 3: Check OpenAI API Key
1. Get a new API key from https://platform.openai.com/api-keys
2. Add to Supabase: Project Settings → Edge Functions → Secrets
3. Add as `OPENAI_API_KEY`
4. Redeploy edge function

### Fix 4: Use Template Roadmap
If OpenAI isn't working, the system should fall back to templates.
Check backend logs to see if template is being used.

## Success Indicators

When everything is working, you should see:

✅ Topics listed in Overview tab  
✅ Click topic → Loading spinner appears  
✅ After 5-10 seconds → Content displays  
✅ Content sections visible:
   - Detailed Explanation
   - Key Learning Points
   - YouTube Videos (3-5 cards)
   - Real-World Applications
   - Common Pitfalls
   - Practice Suggestions

## Still Not Working?

### Check these files:

1. `/supabase/functions/server/index.tsx` - Backend endpoints
2. `/components/CoursePageEnhanced.tsx` - Frontend component
3. `/utils/api.ts` - API client methods

### Verify environment:

- Supabase project is running
- Edge function is deployed
- OpenAI API key has credits
- User is authenticated

### Contact Information

If issue persists, provide:
1. Browser console logs
2. Supabase edge function logs
3. Network tab screenshot
4. Module/topic that failed
5. Error messages

## Common Solutions Summary

| Problem | Solution |
|---------|----------|
| No OpenAI key | Add to Supabase secrets |
| Content not generating | Check browser console for errors |
| Unauthorized error | Login again, check token |
| Module has no topics | Regenerate roadmap |
| 500 error | Check backend logs |
| CORS error | Redeploy edge function |
| Content blank | Check if response has data |
| YouTube links broken | Expected - uses search, not embeds |

## Testing Checklist

- [ ] OpenAI API key added to Supabase
- [ ] Edge function deployed
- [ ] User logged in
- [ ] Roadmap generated
- [ ] Module has topics
- [ ] Click topic shows loading
- [ ] Content appears after loading
- [ ] YouTube videos show
- [ ] All content sections visible
- [ ] Can mark topic complete
- [ ] Progress saves

If all checked, system is working correctly!
