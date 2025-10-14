# Zoo & Wildlife Management System - Backend API

A robust REST API built with Express, TypeScript, and PostgreSQL.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database URL

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed database with sample data
npm run prisma:seed

# Start development server
npm run dev
```

Server runs at: http://localhost:5000

## 📚 Documentation

- **[Complete Setup Guide](../BACKEND_SETUP.md)** - Detailed setup instructions
- **[Quick Start](../BACKEND_QUICK_START.txt)** - Get started in 5 minutes

## 🔧 Tech Stack

- **Node.js** + **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - Modern ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
src/
├── controllers/      # Business logic
├── routes/           # API endpoints
├── middleware/       # Auth & error handling
├── config/           # Database & config
├── utils/            # Helper functions
├── app.ts            # Express app
└── server.ts         # Entry point
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get profile

### Animals
- `GET /api/animals` - List all animals
- `GET /api/animals/:id` - Get animal details
- `POST /api/animals` - Create animal (admin)
- `PUT /api/animals/:id` - Update animal (admin)
- `DELETE /api/animals/:id` - Delete animal (admin)

### Reviews
- `GET /api/reviews/animal/:id` - Get animal reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/admin/all` - All reviews (admin)
- `PATCH /api/reviews/:id/status` - Update status (admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - User bookings
- `GET /api/bookings/admin/all` - All bookings (admin)

## 🗄️ Database Schema

See `prisma/schema.prisma` for complete schema.

Main models:
- **User** - Authentication & user data
- **Animal** - Animal information
- **Review** - User reviews with AI sentiment
- **Booking** - Ticket bookings
- **Event** - Zoo events
- **Favorite** - User's favorite animals
- **HealthRecord** - Animal health tracking

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start with hot reload

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Database GUI
npm run prisma:seed      # Add sample data

# Production
npm run build            # Build TypeScript
npm start                # Start production server
```

## 🔐 Authentication

Protected routes require JWT token in header:
```
Authorization: Bearer <your_token>
```

## 🌐 Deployment

### Vercel + Supabase

1. Push to GitHub
2. Create Supabase project
3. Connect Vercel to your repo
4. Add environment variables
5. Deploy!

See [BACKEND_SETUP.md](../BACKEND_SETUP.md) for detailed deployment instructions.

## 📊 Sample Data

Run `npm run prisma:seed` to create:
- Admin user: `admin@zoo.com` / `admin123`
- Visitor: `visitor@example.com` / `password123`
- 8 sample animals
- Sample reviews and events

## 🧪 Testing

```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"John Doe"}'
```

## 📝 License

All rights reserved.


