import { Router } from 'express';

const router = Router();

// Serve frontend environment variables
router.get('/env', (req, res) => {
  // Determine API URL based on environment and request origin
  const isProduction = process.env.NODE_ENV === 'production';
  const requestOrigin = req.get('origin') || req.get('host');
  const isLocalhost = requestOrigin?.includes('localhost');
  
  let apiUrl;
  if (process.env.REACT_APP_API_URL) {
    apiUrl = process.env.REACT_APP_API_URL;
  } else if (isProduction && !isLocalhost) {
    // Production deployment - use relative URL or your actual backend URL
    apiUrl = '/api'; // This will work if backend and frontend are on same domain
  } else {
    // Development or localhost
    apiUrl = 'http://localhost:5000/api';
  }

  const frontendEnv = {
    REACT_APP_API_URL: apiUrl,
    REACT_APP_SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL,
    REACT_APP_SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
    REACT_APP_EMAIL_REDIRECT_URL: process.env.REACT_APP_EMAIL_REDIRECT_URL || 'https://widlife-zoo-system.vercel.app',
    REACT_APP_HUGGINGFACE_API_KEY: process.env.REACT_APP_HUGGINGFACE_API_KEY,
    REACT_APP_ENABLE_SENTIMENT_ANALYSIS: process.env.REACT_APP_ENABLE_SENTIMENT_ANALYSIS === 'true',
    REACT_APP_ENABLE_CONTENT_MODERATION: process.env.REACT_APP_ENABLE_CONTENT_MODERATION === 'true',
    REACT_APP_ENABLE_CHATBOT: process.env.REACT_APP_ENABLE_CHATBOT === 'true',
    REACT_APP_SENTIMENT_THRESHOLD: parseFloat(process.env.REACT_APP_SENTIMENT_THRESHOLD || '0.7'),
    REACT_APP_TOXICITY_THRESHOLD: parseFloat(process.env.REACT_APP_TOXICITY_THRESHOLD || '0.8'),
    REACT_APP_STRIPE_PUBLIC_KEY: process.env.REACT_APP_STRIPE_PUBLIC_KEY,
    REACT_APP_GOOGLE_MAPS_API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    REACT_APP_ADULT_TICKET_PRICE: parseInt(process.env.REACT_APP_ADULT_TICKET_PRICE || '1500'),
    REACT_APP_CHILD_TICKET_PRICE: parseInt(process.env.REACT_APP_CHILD_TICKET_PRICE || '750'),
    REACT_APP_SENIOR_TICKET_PRICE: parseInt(process.env.REACT_APP_SENIOR_TICKET_PRICE || '1000'),
    REACT_APP_CONTACT_PHONE: process.env.REACT_APP_CONTACT_PHONE || '+254720123456',
    REACT_APP_CONTACT_PHONE_DISPLAY: process.env.REACT_APP_CONTACT_PHONE_DISPLAY || '+254 720 123 456',
    REACT_APP_CONTACT_EMAIL: process.env.REACT_APP_CONTACT_EMAIL || 'info@wildlifezoo.co.ke',
  };

  res.json(frontendEnv);
});

export default router;
