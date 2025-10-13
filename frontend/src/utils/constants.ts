export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
export const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY || '';

export const TICKET_PRICES = {
  adult: 25.00,
  child: 12.00,
  senior: 18.00,
};

export const ANIMAL_TYPES = [
  'Mammal',
  'Bird',
  'Reptile',
  'Amphibian',
  'Fish',
  'Invertebrate',
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
} as const;




