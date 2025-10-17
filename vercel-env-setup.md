# Vercel Environment Variables Setup

## Add these environment variables to your Vercel project:

### Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

Add these variables:

```
DATABASE_URL=postgresql://postgres.yvwvajxkcxhwslegmvqq:Aleqo.4080@aws-1-us-east-2.pooler.supabase.com:5432/postgres
DIRECT_URL=postgresql://postgres.yvwvajxkcxhwslegmvqq:Aleqo.4080@aws-1-us-east-2.pooler.supabase.com:5432/postgres
SUPABASE_URL=https://yvwvajxkcxhwslegmvqq.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2d3ZhanhrY3hod3NsZWdtdnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MTQ2ODEsImV4cCI6MjA3NTk5MDY4MX0.cmaFMQjqaYI0CM9RoyOT58xeqRfgzNBUh9JWCOxerrw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2d3ZhanhrY3hod3NsZWdtdnFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMTQ3NDgwMCwiZXhwIjoyMDQ3MDUwODAwfQ.8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q
JWT_SECRET=zoo-wildlife-secret-key-2025
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://widlife-zoo-system.vercel.app
REDIS_URL=https://careful-osprey-22110.upstash.io
REDIS_REST_URL=https://careful-osprey-22110.upstash.io
REDIS_REST_TOKEN=AVZeAAIncDJiZDg4Yzg2NWM3YTc0MTM5OGNiNWFhYzc1NmMxOTdiMXAyMjIxMTA
REDIS_HOST=careful-osprey-22110.upstash.io
REDIS_PORT=6380
REDIS_PASSWORD=AVZeAAIncDJiZDg4Yzg2NWM3YTc0MTM5OGNiNWFhYzc1NmMxOTdiMXAyMjIxMTA
REDIS_USER=default
```

## Steps:
1. Go to your Vercel dashboard
2. Click on your project
3. Go to Settings → Environment Variables
4. Add each variable above
5. Redeploy your project

This will make both frontend and backend work on Vercel!
