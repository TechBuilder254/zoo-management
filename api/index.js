// Main API handler for Vercel
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    'https://widlife-zoo-system.vercel.app'
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Zoo API is running!',
    timestamp: new Date().toISOString()
  });
});

// Basic API routes
app.get('/api/animals', (req, res) => {
  res.json({
    message: 'Animals endpoint - backend functionality will be added here',
    data: []
  });
});

app.get('/api/events', (req, res) => {
  res.json({
    message: 'Events endpoint - backend functionality will be added here',
    data: []
  });
});

app.get('/api/tickets', (req, res) => {
  res.json({
    message: 'Tickets endpoint - backend functionality will be added here',
    data: []
  });
});

// Config endpoint for frontend
app.get('/api/config/env', (req, res) => {
  const config = {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL || '/api',
    REACT_APP_SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL || 'https://yvwvajxkcxhwslegmvqq.supabase.co',
    REACT_APP_SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2d3ZhanhrY3hod3NsZWdtdnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MTQ2ODEsImV4cCI6MjA3NTk5MDY4MX0.cmaFMQjqaYI0CM9RoyOT58xeqRfgzNBUh9JWCOxerrw',
    REACT_APP_EMAIL_REDIRECT_URL: process.env.REACT_APP_EMAIL_REDIRECT_URL || 'https://widlife-zoo-system.vercel.app',
    REACT_APP_ENABLE_SENTIMENT_ANALYSIS: process.env.REACT_APP_ENABLE_SENTIMENT_ANALYSIS === 'true',
    REACT_APP_ENABLE_CONTENT_MODERATION: process.env.REACT_APP_ENABLE_CONTENT_MODERATION === 'true',
    REACT_APP_ENABLE_CHATBOT: process.env.REACT_APP_ENABLE_CHATBOT === 'true',
    REACT_APP_SENTIMENT_THRESHOLD: parseFloat(process.env.REACT_APP_SENTIMENT_THRESHOLD || '0.7'),
    REACT_APP_TOXICITY_THRESHOLD: parseFloat(process.env.REACT_APP_TOXICITY_THRESHOLD || '0.8'),
    REACT_APP_ADULT_TICKET_PRICE: parseInt(process.env.REACT_APP_ADULT_TICKET_PRICE || '1500'),
    REACT_APP_CHILD_TICKET_PRICE: parseInt(process.env.REACT_APP_CHILD_TICKET_PRICE || '750'),
    REACT_APP_SENIOR_TICKET_PRICE: parseInt(process.env.REACT_APP_SENIOR_TICKET_PRICE || '1000'),
    REACT_APP_CONTACT_PHONE: process.env.REACT_APP_CONTACT_PHONE || '+254720123456',
    REACT_APP_CONTACT_PHONE_DISPLAY: process.env.REACT_APP_CONTACT_PHONE_DISPLAY || '+254 720 123 456',
    REACT_APP_CONTACT_EMAIL: process.env.REACT_APP_CONTACT_EMAIL || 'info@wildlifezoo.co.ke',
  };
  
  res.json(config);
});

// Error handling
app.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

module.exports = app;
