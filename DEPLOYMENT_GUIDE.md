# Vercel Deployment Guide

## Required Environment Variables

Add these environment variables in your Vercel dashboard:

### Essential Variables (Required)
```
REACT_APP_SUPABASE_URL=https://yvwvajxkcxhwslegmvqq.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2d3ZhanhrY3hod3NsZWdtdnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MTQ2ODEsImV4cCI6MjA3NTk5MDY4MX0.cmaFMQjqaYI0CM9RoyOT58xeqRfgzNBUh9JWCOxerrw
```

### Optional Variables (Recommended)
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_key_here
REACT_APP_EMAIL_REDIRECT_URL=https://your-domain.vercel.app
```

## Steps to Deploy

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the variables above
5. Redeploy your project

## System Configuration

The system is configured to:
- Use Supabase for database operations
- Automatically detect the current domain for email redirects
- Use environment variables for external API keys
- Fall back to defaults for optional features


