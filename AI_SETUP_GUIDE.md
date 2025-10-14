# AI Features Setup Guide
## Quick Start Guide for Getting API Keys

This is a quick reference guide to get you started with the AI features. For complete documentation, see [AI_ML_DOCUMENTATION.md](./AI_ML_DOCUMENTATION.md).

---

## 🚀 Quick Setup (15 minutes)

### Step 1: Get API Keys (Free)

#### 1. Hugging Face - Sentiment Analysis ⭐ START HERE
**Time: 2 minutes**

1. Go to https://huggingface.co/join
2. Sign up with email or GitHub
3. Verify your email
4. Go to https://huggingface.co/settings/tokens
5. Click "New token"
6. Name it: "zoo-sentiment-analysis"
7. Role: Select "read"
8. Click "Generate token"
9. **Copy the token** (starts with `hf_...`)

✅ You now have: `REACT_APP_HUGGINGFACE_API_KEY`

---

#### 2. Google Gemini - AI Chatbot ⭐ IMPORTANT
**Time: 3 minutes**

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Select "Create API key in new project" (or choose existing project)
5. **Copy the API key** (starts with `AIza...`)

✅ You now have: `REACT_APP_GOOGLE_GEMINI_API_KEY`

**Free Tier:** 60 requests per minute (very generous!)

---

#### 3. Perspective API - Content Moderation ⭐ IMPORTANT
**Time: 3 minutes**

1. Go to https://perspectiveapi.com/
2. Click "Get Started" or "Request API Access"
3. Fill out the form:
   - Name: Your name
   - Email: Your email
   - Project: Wildlife Zoo Management System
   - Use case: Content moderation for user reviews
   - Expected volume: Low (< 1000 requests/day)
4. Submit and wait for approval (usually instant to 24 hours)
5. Once approved, go to https://console.cloud.google.com/apis/credentials
6. Click "Create Credentials" → "API Key"
7. **Copy the API key**

✅ You now have: `REACT_APP_PERSPECTIVE_API_KEY`

**Alternative:** If waiting for approval, you can skip this for now and implement later.

---

#### 4. Clarifai - Image Recognition
**Time: 3 minutes**

1. Go to https://www.clarifai.com/
2. Click "Sign Up" (top right)
3. Sign up with email or Google
4. After logging in, go to https://portal.clarifai.com/settings/security
5. Under "Personal Access Tokens", copy your default token
   - Or click "Create Personal Access Token" if no default exists
6. **Copy the token**

✅ You now have: `REACT_APP_CLARIFAI_API_KEY`

**Free Tier:** 1,000 operations per month

---

#### 5. Cohere - Smart Search & Recommendations
**Time: 2 minutes**

1. Go to https://dashboard.cohere.com/welcome/register
2. Sign up with email or Google
3. After logging in, you'll see your API key on the dashboard
4. Or go to https://dashboard.cohere.com/api-keys
5. **Copy the Production key**

✅ You now have: `REACT_APP_COHERE_API_KEY`

**Free Tier:** 100 API calls per minute

---

### Step 2: Create Environment File

Create a file: `frontend/.env.local`

```env
# AI/ML API Keys
REACT_APP_HUGGINGFACE_API_KEY=hf_your_key_here
REACT_APP_GOOGLE_GEMINI_API_KEY=AIza_your_key_here
REACT_APP_PERSPECTIVE_API_KEY=your_key_here
REACT_APP_CLARIFAI_API_KEY=your_key_here
REACT_APP_COHERE_API_KEY=your_key_here

# AI Feature Flags (enable/disable features)
REACT_APP_ENABLE_SENTIMENT_ANALYSIS=true
REACT_APP_ENABLE_CONTENT_MODERATION=true
REACT_APP_ENABLE_CHATBOT=true
REACT_APP_ENABLE_IMAGE_RECOGNITION=true
REACT_APP_ENABLE_RECOMMENDATIONS=true
REACT_APP_ENABLE_SMART_SEARCH=true
REACT_APP_ENABLE_VOICE_FEATURES=true

# AI Configuration
REACT_APP_SENTIMENT_THRESHOLD=0.7
REACT_APP_TOXICITY_THRESHOLD=0.8
REACT_APP_CHATBOT_MAX_TOKENS=500
REACT_APP_IMAGE_RECOGNITION_CONFIDENCE=0.6
```

### Step 3: Install Dependencies

```bash
cd frontend
npm install @google/generative-ai @huggingface/inference ml-distance react-markdown framer-motion
```

### Step 4: Verify Setup

Create a test file: `frontend/src/test-ai-setup.ts`

```typescript
// Test if API keys are loaded correctly
const config = {
  huggingface: process.env.REACT_APP_HUGGINGFACE_API_KEY,
  gemini: process.env.REACT_APP_GOOGLE_GEMINI_API_KEY,
  perspective: process.env.REACT_APP_PERSPECTIVE_API_KEY,
  clarifai: process.env.REACT_APP_CLARIFAI_API_KEY,
  cohere: process.env.REACT_APP_COHERE_API_KEY,
};

console.log('API Keys Status:');
Object.entries(config).forEach(([name, key]) => {
  console.log(`${name}: ${key ? '✅ Set' : '❌ Missing'}`);
});
```

Run your app and check the console:
```bash
npm start
```

---

## 📋 Quick Reference

### What Each Service Does

| Service | Purpose | When It's Used | Priority |
|---------|---------|---------------|----------|
| **Hugging Face** | Analyze review sentiment | When user submits a review | ⭐⭐⭐ High |
| **Gemini** | Power the AI chatbot | When user asks a question | ⭐⭐⭐ High |
| **Perspective** | Detect toxic content | When user submits a review | ⭐⭐⭐ High |
| **Clarifai** | Identify animals in photos | When user uploads a photo | ⭐⭐ Medium |
| **Cohere** | Smart search & recommendations | When user searches animals | ⭐⭐ Medium |
| **Web Speech** | Voice features | When user uses voice search | ⭐ Low |

### Start with These 3 (Minimum Viable AI)

If you're short on time, get these first:
1. ✅ Hugging Face (Sentiment Analysis) - Takes 2 minutes
2. ✅ Google Gemini (Chatbot) - Takes 3 minutes  
3. ✅ Perspective API (Moderation) - Takes 3 minutes (may need approval)

Total setup time: **~10 minutes**

---

## 🔒 Security Notes

### ⚠️ IMPORTANT: Never commit .env.local to Git!

Add to `.gitignore`:
```
# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### ✅ Best Practices

1. **Keep API keys secret** - Never share them publicly
2. **Use environment variables** - Never hardcode keys in code
3. **Rotate keys regularly** - Change keys every few months
4. **Monitor usage** - Check API dashboards for unusual activity
5. **Set up rate limiting** - Implement client-side rate limiting

---

## 🧪 Testing Your Setup

### Test 1: Sentiment Analysis

```typescript
// Test in browser console after app starts
fetch('https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_HF_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ inputs: "This zoo is amazing!" })
})
.then(res => res.json())
.then(data => console.log('Sentiment:', data));

// Expected: [{ label: "POSITIVE", score: 0.9998 }]
```

### Test 2: Google Gemini Chatbot

```typescript
// Test in Node.js or React component
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const result = await model.generateContent('What animals are in a zoo?');
console.log(result.response.text());

// Expected: A detailed response about zoo animals
```

### Test 3: Perspective API

```typescript
// Test moderation
fetch(`https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=YOUR_API_KEY`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    comment: { text: 'This is a nice zoo' },
    requestedAttributes: { TOXICITY: {} }
  })
})
.then(res => res.json())
.then(data => console.log('Toxicity:', data));

// Expected: Low toxicity score
```

---

## ❓ Troubleshooting

### Issue: "API key not found"
**Solution:** 
- Make sure `.env.local` is in the `frontend/` folder
- Restart your development server (`npm start`)
- Check that variable names match exactly (including `REACT_APP_` prefix)

### Issue: "CORS error"
**Solution:**
- This is normal for some APIs
- We'll use a proxy or backend to make API calls
- Don't worry about it for now

### Issue: "Rate limit exceeded"
**Solution:**
- Wait a few minutes
- Implement caching (we'll do this in implementation)
- Consider upgrading to paid tier if needed

### Issue: "Invalid API key"
**Solution:**
- Double-check you copied the full key
- Make sure there are no extra spaces
- Regenerate the key if needed

### Issue: Perspective API not approved yet
**Solution:**
- Continue with other features
- Implement a fallback moderation system
- Add Perspective API later when approved

---

## 📞 Need Help?

1. Check [AI_ML_DOCUMENTATION.md](./AI_ML_DOCUMENTATION.md) for detailed info
2. Check the API documentation links below
3. Create an issue in the repository

### API Documentation Links

- [Hugging Face Docs](https://huggingface.co/docs/api-inference/index)
- [Google Gemini Docs](https://ai.google.dev/docs)
- [Perspective API Docs](https://developers.perspectiveapi.com/)
- [Clarifai Docs](https://docs.clarifai.com/)
- [Cohere Docs](https://docs.cohere.com/)

---

## ✅ Next Steps

Once you have your API keys set up:

1. ✅ Install dependencies
2. ✅ Test API connections
3. 🚀 Start implementing features (follow AI_ML_DOCUMENTATION.md)
4. 🎉 Enjoy your AI-powered zoo system!

---

**Ready to implement?** Let's start with Phase 1! 🚀


