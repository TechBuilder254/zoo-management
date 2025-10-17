# Email Redirect Configuration Guide

## The Problem
When Supabase sends verification emails, the links contain `localhost:3000` which doesn't work when users click them because:
1. Users don't have your local development server running
2. Localhost is only accessible from your computer

## The Solution
You need to set the `REACT_APP_EMAIL_REDIRECT_URL` environment variable to point to a publicly accessible URL.

## Configuration Options

### Option 1: Use Your Deployed Site (Recommended for Production)
If you have deployed your site somewhere:

```env
REACT_APP_EMAIL_REDIRECT_URL=https://your-actual-domain.com
```

### Option 2: Use ngrok for Development/Testing
If you want to test email verification locally:

1. **Install ngrok:**
   ```bash
   npm install -g ngrok
   # or download from https://ngrok.com/
   ```

2. **Start your frontend:**
   ```bash
   cd frontend
   npm start
   ```

3. **In another terminal, expose your local server:**
   ```bash
   ngrok http 3000
   ```

4. **Copy the ngrok URL and set it in your .env file:**
   ```env
   REACT_APP_EMAIL_REDIRECT_URL=https://abc123.ngrok.io
   ```

### Option 3: Use a Development Domain Service
Services like:
- **Vercel** (free tier available)
- **Netlify** (free tier available)
- **Railway** (free tier available)
- **Render** (free tier available)

Deploy your frontend and use the provided URL.

## Setup Instructions

### 1. Create/Update Your .env File
In your `frontend` folder, create or update `.env`:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email Redirect URL (IMPORTANT!)
REACT_APP_EMAIL_REDIRECT_URL=https://your-public-url.com

# Other configurations
REACT_APP_API_URL=http://localhost:5000/api
```

### 2. Update Supabase Dashboard
In your Supabase project dashboard:

1. Go to **Authentication > Settings**
2. Set **Site URL** to your public URL (same as REACT_APP_EMAIL_REDIRECT_URL)
3. Set **Redirect URLs** to include your verification page:
   - `https://your-public-url.com/verify-email`
   - `https://your-public-url.com/reset-password`

### 3. Restart Your Application
After updating the .env file:
```bash
cd frontend
npm start
```

## Quick Testing with ngrok

If you want to test immediately:

1. **Install ngrok:**
   ```bash
   # Download from https://ngrok.com/download
   # or use npm: npm install -g ngrok
   ```

2. **Start your app:**
   ```bash
   cd frontend
   npm start
   ```

3. **In another terminal:**
   ```bash
   ngrok http 3000
   ```

4. **Copy the ngrok URL** (e.g., `https://abc123.ngrok.io`) and add it to your `.env`:
   ```env
   REACT_APP_EMAIL_REDIRECT_URL=https://abc123.ngrok.io
   ```

5. **Restart your app:**
   ```bash
   # Stop and restart npm start
   ```

6. **Test registration** - the email links will now work!

## Production Deployment

For production, make sure to:

1. **Set the environment variable** in your hosting platform:
   ```env
   REACT_APP_EMAIL_REDIRECT_URL=https://your-production-domain.com
   ```

2. **Update Supabase settings** to use your production domain

3. **Test the complete flow** with a real email address

## Troubleshooting

### Email links still show localhost?
- Make sure you restarted your app after updating .env
- Check that `REACT_APP_EMAIL_REDIRECT_URL` is set correctly
- Verify the environment variable is being loaded (check browser dev tools)

### ngrok URL changes every time?
- Use a paid ngrok account for static URLs
- Or update your .env file each time you restart ngrok

### Still having issues?
- Check Supabase dashboard settings
- Verify the redirect URL is added to Supabase allowed redirects
- Make sure your public URL is accessible

## Example .env File

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key

# Email Redirect URL (for email verification links)
REACT_APP_EMAIL_REDIRECT_URL=https://your-domain.com

# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Optional: Google Maps and Stripe
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-key
REACT_APP_STRIPE_PUBLIC_KEY=your-stripe-public-key
```

This will ensure that email verification links work correctly! 🎉

