// Main API handler for Vercel
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || 'https://yvwvajxkcxhwslegmvqq.supabase.co',
  process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
);

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    'https://widlife-zoo-system.vercel.app',
    'https://wildlife-zoo-management.vercel.app'
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

// User management endpoints
app.post('/api/users/sync', async (req, res) => {
  try {
    const { userId, email, name, role = 'VISITOR', phone = '' } = req.body;
    
    if (!userId || !email) {
      return res.status(400).json({ error: 'userId and email are required' });
    }

    // Check if user already exists in custom users table
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing user:', fetchError);
      return res.status(500).json({ error: 'Failed to check existing user' });
    }

    if (existingUser) {
      // User exists, update if needed
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          email,
          name,
          role,
          phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating user:', updateError);
        return res.status(500).json({ error: 'Failed to update user' });
      }

      return res.json({ 
        success: true, 
        message: 'User updated successfully',
        user: updatedUser 
      });
    } else {
      // User doesn't exist, create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{
          id: userId,
          email,
          password: 'supabase_auth_user', // Placeholder since Supabase handles auth
          name,
          role,
          phone,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        return res.status(500).json({ error: 'Failed to create user' });
      }

      return res.json({ 
        success: true, 
        message: 'User created successfully',
        user: newUser 
      });
    }
  } catch (error) {
    console.error('Error in user sync:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Review creation endpoint that handles user sync
app.post('/api/reviews', async (req, res) => {
  try {
    const { animalId, rating, comment, userId, userEmail, userName, userRole = 'VISITOR', userPhone = '' } = req.body;
    
    if (!animalId || !rating || !comment || !userId) {
      return res.status(400).json({ error: 'animalId, rating, comment, and userId are required' });
    }

    // First, ensure user exists in custom users table
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (userError && userError.code === 'PGRST116') {
      // User doesn't exist, create them
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{
          id: userId,
          email: userEmail || '',
          password: 'supabase_auth_user',
          name: userName || '',
          role: userRole,
          phone: userPhone,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        return res.status(500).json({ error: 'Failed to create user' });
      }
    } else if (userError) {
      console.error('Error checking user:', userError);
      return res.status(500).json({ error: 'Failed to check user' });
    }

    // Now create the review
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert([{
        user_id: userId,
        animal_id: animalId,
        rating,
        comment,
        status: 'PENDING',
        helpful: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select(`
        *,
        users!reviews_user_id_fkey (
          id,
          name,
          email
        )
      `)
      .single();

    if (reviewError) {
      console.error('Error creating review:', reviewError);
      return res.status(500).json({ error: 'Failed to create review' });
    }

    res.json({ 
      success: true, 
      message: 'Review created successfully',
      review 
    });
  } catch (error) {
    console.error('Error in review creation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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
    REACT_APP_EMAIL_REDIRECT_URL: process.env.REACT_APP_EMAIL_REDIRECT_URL || 'https://wildlife-zoo-management.vercel.app',
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
