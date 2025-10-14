# AI Features Quick Reference
## Cheat Sheet for Development

---

## 🔑 API Keys (Keep This Handy!)

```bash
# In frontend/.env.local
REACT_APP_HUGGINGFACE_API_KEY=hf_...
REACT_APP_GOOGLE_GEMINI_API_KEY=AIza...
REACT_APP_PERSPECTIVE_API_KEY=...
REACT_APP_CLARIFAI_API_KEY=...
REACT_APP_COHERE_API_KEY=...
```

---

## 📦 Dependencies

```bash
npm install @google/generative-ai @huggingface/inference ml-distance react-markdown framer-motion
```

---

## 🎯 Quick API Examples

### 1. Sentiment Analysis (Hugging Face)

```typescript
const analyzeSentiment = async (text: string) => {
  const response = await fetch(
    'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: text }),
    }
  );
  
  const result = await response.json();
  // Returns: [{ label: "POSITIVE", score: 0.9998 }]
  return result[0];
};
```

### 2. Chatbot (Google Gemini)

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const chat = async (message: string) => {
  const genAI = new GoogleGenerativeAI(
    process.env.REACT_APP_GOOGLE_GEMINI_API_KEY!
  );
  
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash' 
  });
  
  const prompt = `You are a helpful zoo assistant. 
User: ${message}
Assistant:`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
};
```

### 3. Content Moderation (Perspective API)

```typescript
const checkToxicity = async (text: string) => {
  const response = await fetch(
    `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${process.env.REACT_APP_PERSPECTIVE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        comment: { text },
        languages: ['en'],
        requestedAttributes: {
          TOXICITY: {},
          SEVERE_TOXICITY: {},
          INSULT: {},
          PROFANITY: {},
        },
      }),
    }
  );
  
  const result = await response.json();
  // Returns: { attributeScores: { TOXICITY: { summaryScore: { value: 0.12 } } } }
  return result.attributeScores.TOXICITY.summaryScore.value;
};
```

### 4. Image Recognition (Clarifai)

```typescript
const identifyAnimal = async (base64Image: string) => {
  const response = await fetch(
    'https://api.clarifai.com/v2/models/general-image-recognition/outputs',
    {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.REACT_APP_CLARIFAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: [{
          data: {
            image: { base64: base64Image },
          },
        }],
      }),
    }
  );
  
  const result = await response.json();
  // Returns concepts with confidence scores
  return result.outputs[0].data.concepts;
};
```

### 5. Semantic Search (Cohere)

```typescript
const getEmbedding = async (text: string) => {
  const response = await fetch(
    'https://api.cohere.ai/v1/embed',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texts: [text],
        model: 'embed-english-light-v3.0',
      }),
    }
  );
  
  const result = await response.json();
  // Returns: { embeddings: [[0.123, 0.456, ...]] }
  return result.embeddings[0];
};

// Calculate similarity
import { cosine } from 'ml-distance';

const similarity = cosine(embedding1, embedding2);
```

---

## 🏗️ Common Patterns

### Service Pattern

```typescript
// services/sentimentService.ts
class SentimentService {
  private apiKey: string;
  
  constructor() {
    this.apiKey = process.env.REACT_APP_HUGGINGFACE_API_KEY!;
  }
  
  async analyze(text: string): Promise<SentimentResult> {
    try {
      // API call here
      return result;
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
      // Return fallback
      return { label: 'NEUTRAL', score: 0.5, error: true };
    }
  }
}

export default new SentimentService();
```

### Custom Hook Pattern

```typescript
// hooks/useSentimentAnalysis.ts
export const useSentimentAnalysis = (text: string) => {
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const analyze = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await sentimentService.analyze(text);
        setSentiment(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    
    if (text) {
      analyze();
    }
  }, [text]);
  
  return { sentiment, loading, error };
};
```

### Component Pattern

```typescript
// components/reviews/SentimentBadge.tsx
interface Props {
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  score: number;
}

export const SentimentBadge: React.FC<Props> = ({ sentiment, score }) => {
  const config = {
    POSITIVE: { emoji: '😊', color: 'bg-green-100 text-green-800', text: 'Positive' },
    NEGATIVE: { emoji: '😞', color: 'bg-red-100 text-red-800', text: 'Negative' },
    NEUTRAL: { emoji: '😐', color: 'bg-gray-100 text-gray-800', text: 'Neutral' },
  };
  
  const { emoji, color, text } = config[sentiment];
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      <span className="mr-1">{emoji}</span>
      {text} ({(score * 100).toFixed(0)}%)
    </span>
  );
};
```

---

## 🎨 TypeScript Types

```typescript
// types/ai.ts

export interface SentimentResult {
  label: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  score: number;
  error?: boolean;
}

export interface ToxicityResult {
  toxicity: number;
  severeToxicity: number;
  insult: number;
  profanity: number;
  isToxic: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface RecognitionResult {
  name: string;
  confidence: number;
}

export interface Recommendation {
  animalId: string;
  score: number;
  reason: string;
}
```

---

## 🛠️ Utility Functions

### Debounce (for search)

```typescript
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Usage
const debouncedSearch = debounce(searchAnimals, 500);
```

### Retry Logic

```typescript
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (maxRetries === 0) throw error;
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithBackoff(fn, maxRetries - 1, delay * 2);
  }
};
```

### Cache Implementation

```typescript
class SimpleCache<T> {
  private cache = new Map<string, { data: T; timestamp: number }>();
  private ttl: number;
  
  constructor(ttlMinutes = 5) {
    this.ttl = ttlMinutes * 60 * 1000;
  }
  
  set(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
  
  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
}

// Usage
const sentimentCache = new SimpleCache<SentimentResult>(10);
```

---

## 🎯 Error Handling

### Graceful Fallback Pattern

```typescript
const analyzeWithFallback = async (text: string) => {
  try {
    // Try AI service
    return await sentimentService.analyze(text);
  } catch (error) {
    console.error('AI service failed, using fallback:', error);
    
    // Simple fallback: keyword matching
    const positive = ['great', 'amazing', 'love', 'excellent'];
    const negative = ['bad', 'terrible', 'hate', 'awful'];
    
    const lowerText = text.toLowerCase();
    const hasPositive = positive.some(word => lowerText.includes(word));
    const hasNegative = negative.some(word => lowerText.includes(word));
    
    if (hasPositive && !hasNegative) {
      return { label: 'POSITIVE', score: 0.7, fallback: true };
    } else if (hasNegative && !hasPositive) {
      return { label: 'NEGATIVE', score: 0.7, fallback: true };
    } else {
      return { label: 'NEUTRAL', score: 0.5, fallback: true };
    }
  }
};
```

### Error Boundary Component

```typescript
class AIErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error) {
    console.error('AI Component Error:', error);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-yellow-50 rounded">
          <p>AI feature temporarily unavailable. Using fallback mode.</p>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

---

## 📊 Testing Examples

### Unit Test

```typescript
describe('SentimentService', () => {
  it('should analyze positive sentiment correctly', async () => {
    const result = await sentimentService.analyze('This zoo is amazing!');
    
    expect(result.label).toBe('POSITIVE');
    expect(result.score).toBeGreaterThan(0.8);
  });
  
  it('should handle errors gracefully', async () => {
    // Mock API failure
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('API Error'));
    
    const result = await sentimentService.analyze('test');
    
    expect(result.error).toBe(true);
    expect(result.label).toBe('NEUTRAL'); // Fallback
  });
});
```

### Integration Test

```typescript
describe('Review submission with AI', () => {
  it('should analyze sentiment and check moderation', async () => {
    // Submit review
    const review = 'This zoo is great!';
    
    // Check moderation
    const toxicity = await moderationService.check(review);
    expect(toxicity).toBeLessThan(0.5);
    
    // Analyze sentiment
    const sentiment = await sentimentService.analyze(review);
    expect(sentiment.label).toBe('POSITIVE');
    
    // Save review with metadata
    const saved = await reviewService.save({
      text: review,
      sentiment: sentiment.label,
      toxicity,
    });
    
    expect(saved.id).toBeDefined();
  });
});
```

---

## 🎨 UI Components Snippets

### Loading Spinner

```tsx
export const AILoadingSpinner = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
    <span className="text-sm text-gray-600">AI is thinking...</span>
  </div>
);
```

### Toast Notifications

```tsx
import toast from 'react-hot-toast';

// Success
toast.success('AI analysis complete!', {
  icon: '🤖',
  duration: 3000,
});

// Error
toast.error('AI service unavailable. Using fallback.', {
  icon: '⚠️',
  duration: 4000,
});

// Loading
const toastId = toast.loading('Analyzing with AI...');
// Later:
toast.success('Done!', { id: toastId });
```

---

## 📈 Performance Tips

1. **Debounce user inputs** (search, typing)
2. **Cache API responses** (5-10 minutes)
3. **Lazy load AI components** (code splitting)
4. **Precompute embeddings** (for search)
5. **Use optimistic UI updates** (show loading states)
6. **Batch API calls** when possible
7. **Implement rate limiting** on client side
8. **Monitor API usage** with dashboard

---

## 🔐 Security Checklist

- [ ] Never commit `.env.local` to Git
- [ ] Add `.env.local` to `.gitignore`
- [ ] Never expose API keys in client code
- [ ] Validate all user inputs before sending to AI
- [ ] Sanitize AI outputs before displaying
- [ ] Implement rate limiting
- [ ] Set up API key rotation
- [ ] Monitor for unusual usage patterns
- [ ] Use HTTPS for all API calls
- [ ] Implement CORS properly

---

## 🐛 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| `API key not found` | Env var not loaded | Restart dev server |
| `CORS error` | Browser security | Use backend proxy |
| `Rate limit exceeded` | Too many requests | Add caching + debounce |
| `Slow responses` | API latency | Show loading states |
| `Inaccurate results` | Wrong model/prompt | Adjust parameters |
| `High costs` | Too many API calls | Implement caching |

---

## 📞 Quick Links

- [Full Documentation](./AI_ML_DOCUMENTATION.md)
- [Setup Guide](./AI_SETUP_GUIDE.md)
- [Implementation Roadmap](./AI_IMPLEMENTATION_ROADMAP.md)
- [Hugging Face Docs](https://huggingface.co/docs/api-inference/index)
- [Gemini Docs](https://ai.google.dev/docs)
- [Perspective API Docs](https://developers.perspectiveapi.com/)
- [Clarifai Docs](https://docs.clarifai.com/)
- [Cohere Docs](https://docs.cohere.com/)

---

## ✅ Daily Development Checklist

Morning:
- [ ] Check API usage dashboards
- [ ] Review error logs
- [ ] Test AI features
- [ ] Check API key status

During Development:
- [ ] Write tests for new features
- [ ] Handle errors gracefully
- [ ] Add loading states
- [ ] Implement caching
- [ ] Update documentation

Before Committing:
- [ ] Remove console.logs
- [ ] Test edge cases
- [ ] Check performance
- [ ] Update tests
- [ ] Run linter

---

**Print this out and keep it next to your computer! 📋**


