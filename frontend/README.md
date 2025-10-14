# Wildlife Zoo Frontend

This is the frontend application for the Wildlife Zoo Management System built with React, TypeScript, and TailwindCSS.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the environment variables in `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

### Running the Application

Start the development server:
```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

### Building for Production

Create a production build:
```bash
npm run build
```

### Running Tests

```bash
npm test
```

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── common/      # Common components (Button, Input, Card, etc.)
│   ├── animals/     # Animal-related components
│   ├── booking/     # Booking system components
│   ├── reviews/     # Review and rating components
│   ├── events/      # Event components
│   └── admin/       # Admin dashboard components
├── pages/           # Page components
├── context/         # React Context providers
├── hooks/           # Custom React hooks
├── services/        # API service functions
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
├── App.tsx          # Main App component with routing
└── index.tsx        # Application entry point
```

## 🎨 Features

- **Modern UI**: Built with TailwindCSS for a beautiful, responsive design
- **Dark Mode**: Full dark mode support with theme persistence
- **Type-Safe**: Written in TypeScript for better developer experience
- **Responsive**: Mobile-first design that works on all devices
- **Accessible**: WCAG compliant with keyboard navigation support
- **Performance**: Optimized with React best practices

## 🔧 Technologies Used

- React 18
- TypeScript
- TailwindCSS
- React Router v6
- React Hook Form
- Axios
- date-fns
- Lucide React (icons)
- React Hot Toast (notifications)
- QR Code React
- Zustand (state management)

## 📄 License

All rights reserved.





