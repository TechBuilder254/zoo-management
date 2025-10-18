import configService from '../services/configService';

// Initialize config service
configService.loadConfig();

// Get configuration with fallbacks
const getConfigValue = (key: string, fallback: any) => {
  return configService.get(key) || process.env[key] || fallback;
};

// API_URL removed - now using Supabase directly
export const GOOGLE_MAPS_API_KEY = getConfigValue('REACT_APP_GOOGLE_MAPS_API_KEY', '');
export const STRIPE_PUBLIC_KEY = getConfigValue('REACT_APP_STRIPE_PUBLIC_KEY', '');

export const TICKET_PRICES = {
  adult: 1500, // KSh - managed through admin panel
  child: 750,  // KSh - managed through admin panel
  senior: 1000, // KSh - managed through admin panel
};

export const ANIMAL_TYPES = [
  'Mammals',
  'Birds',
  'Reptiles',
  'Amphibians',
  'Fish',
  'Invertebrates',
] as const;

export const CONSERVATION_STATUSES = [
  'Extinct',
  'Endangered',
  'Vulnerable',
  'Near Threatened',
  'Least Concern',
] as const;

export const EVENT_CATEGORIES = [
  'Feeding',
  'Educational',
  'Special Event',
  'Workshop',
] as const;

export const ITEMS_PER_PAGE = 12;

export const ROUTES = {
  HOME: '/',
  ANIMALS: '/animals',
  ANIMAL_DETAIL: '/animals/:id',
  BOOKING: '/booking',
  MY_BOOKINGS: '/my-bookings',
  FAVORITES: '/favorites',
  EVENTS: '/events',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  ABOUT: '/about',
  CONTACT: '/contact',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_ANIMALS: '/admin/animals',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_REVIEWS: '/admin/reviews',
  ADMIN_TICKET_PRICING: '/admin/ticket-pricing',
  ADMIN_PROMO_CODES: '/admin/promo-codes',
} as const;






