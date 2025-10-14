# 🚀 Backend Setup Guide
## Zoo & Wildlife Management System - API

---

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **PostgreSQL** (v14 or higher)
3. **npm** or **yarn**

---

## 🔧 Local PostgreSQL Setup (Windows)

### Option 1: Install PostgreSQL

1. **Download PostgreSQL:**
   - Go to https://www.postgresql.org/download/windows/
   - Download the installer
   - Run the installer
   - Remember the password you set for `postgres` user

2. **Verify Installation:**
   ```bash
   psql --version
   ```

3. **Create Database:**
   ```bash
   # Open PostgreSQL shell (psql)
   psql -U postgres

   # In psql, run:
   CREATE DATABASE zoo_db;
   \q
   ```

### Option 2: Use Docker (Easier)

```bash
# Run PostgreSQL in Docker
docker run --name zoo-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=zoo_db -p 5432:5432 -d postgres:14

# Verify it's running
docker ps
```

---

## 🚀 Backend Setup

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables

Create `backend/.env` file:

```env
# Database (Local PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/zoo_db?schema=public"

# JWT Secret (change this!)
JWT_SECRET=your_super_secret_jwt_key_change_me_in_production

# Server
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000
```

**Important:** Change the `DATABASE_URL` if you used a different username/password!

### Step 3: Generate Prisma Client

```bash
npm run prisma:generate
```

### Step 4: Run Database Migrations

```bash
npm run prisma:migrate
```

This will:
- Create all tables in your database
- Generate the Prisma Client
- Set up the schema

### Step 5: (Optional) Seed Database

Create sample data (we'll add this later):

```bash
npm run prisma:seed
```

### Step 6: Start Development Server

```bash
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server is running on port 5000
📍 Health check: http://localhost:5000/health
🔧 Environment: development
```

---

## 🧪 Test the API

### Health Check

```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "ok",
  "message": "Zoo API is running!"
}
```

### Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

---

## 📁 Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   └── database.ts        # Prisma client
│   ├── controllers/
│   │   ├── authController.ts  # Authentication logic
│   │   ├── animalController.ts
│   │   ├── reviewController.ts
│   │   └── bookingController.ts
│   ├── middleware/
│   │   ├── auth.ts           # JWT authentication
│   │   └── errorHandler.ts   # Error handling
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── animalRoutes.ts
│   │   ├── reviewRoutes.ts
│   │   └── bookingRoutes.ts
│   ├── utils/
│   │   ├── jwt.ts            # JWT utilities
│   │   └── validators.ts     # Input validation
│   ├── app.ts                # Express app config
│   └── server.ts             # Server entry point
├── .env                      # Environment variables
├── .env.example              # Example env file
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |

### Animals

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/animals` | Get all animals | No |
| GET | `/api/animals/:id` | Get animal by ID | No |
| POST | `/api/animals` | Create animal | Yes (Staff/Admin) |
| PUT | `/api/animals/:id` | Update animal | Yes (Staff/Admin) |
| DELETE | `/api/animals/:id` | Delete animal | Yes (Admin) |
| POST | `/api/animals/:id/favorite` | Toggle favorite | Yes |
| GET | `/api/animals/user/favorites` | Get user favorites | Yes |

### Reviews

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/reviews/animal/:animalId` | Get reviews for animal | No |
| POST | `/api/reviews` | Create review | Yes |
| DELETE | `/api/reviews/:id` | Delete review | Yes (Owner/Admin) |
| GET | `/api/reviews/admin/all` | Get all reviews | Yes (Staff/Admin) |
| PATCH | `/api/reviews/:id/status` | Update review status | Yes (Staff/Admin) |
| PATCH | `/api/reviews/:id/sentiment` | Update AI sentiment | Yes |

### Bookings

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/bookings` | Create booking | Yes |
| GET | `/api/bookings/my-bookings` | Get user bookings | Yes |
| GET | `/api/bookings/:id` | Get booking by ID | Yes (Owner/Admin) |
| PATCH | `/api/bookings/:id/cancel` | Cancel booking | Yes (Owner/Admin) |
| GET | `/api/bookings/admin/all` | Get all bookings | Yes (Staff/Admin) |
| PATCH | `/api/bookings/:id/status` | Update booking status | Yes (Staff/Admin) |

---

## 📊 Database Schema

### Users
- id, email, password (hashed), name, role (VISITOR/ADMIN/STAFF)
- Relations: reviews, bookings, favorites

### Animals
- id, name, species, category, habitat, description, imageUrl
- location (JSON), diet, lifespan, status
- Relations: reviews, favorites, healthRecords

### Reviews
- id, rating (1-5), comment, status (PENDING/APPROVED/REJECTED)
- AI fields: sentiment, sentimentScore, toxicity
- Relations: user, animal

### Bookings
- id, visitDate, ticketType, quantity, totalPrice, status
- paymentId, paymentStatus
- Relations: user

### Events
- id, title, description, startDate, endDate, location, imageUrl
- capacity, price, status

### Favorites
- User-Animal many-to-many relationship

### HealthRecords
- For tracking animal health (staff/admin only)

---

## 🛠️ Useful Commands

```bash
# Development
npm run dev                # Start dev server with hot reload

# Database
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Run migrations
npm run prisma:studio      # Open Prisma Studio (DB GUI)
npm run prisma:seed        # Seed database

# Production
npm run build              # Build TypeScript
npm start                  # Start production server

# Database Management
npx prisma studio          # Open database GUI
npx prisma migrate reset   # Reset database (WARNING: deletes all data!)
```

---

## 🔐 Authentication Flow

1. **Register:** User creates account → Password is hashed → JWT token generated
2. **Login:** User provides credentials → Password verified → JWT token returned
3. **Protected Routes:** User includes token in Authorization header:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

Example with token:
```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🌐 Migrating to Supabase (Later)

When ready to deploy:

1. **Create Supabase Project:**
   - Go to https://supabase.com
   - Create new project
   - Get your database URL

2. **Update Environment Variables:**
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```

3. **Run Migrations:**
   ```bash
   npm run prisma:migrate
   ```

That's it! Supabase uses PostgreSQL, so no code changes needed!

---

## 🚀 Deploying to Vercel

1. **Push code to GitHub**

2. **Connect to Vercel:**
   - Go to https://vercel.com
   - Import your repository
   - Add environment variables (DATABASE_URL, JWT_SECRET, etc.)

3. **Configure:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Deploy!**

---

## 🐛 Troubleshooting

### Issue: Can't connect to database
```
Error: Can't reach database server
```
**Solution:**
- Make sure PostgreSQL is running
- Check if database exists: `psql -U postgres -l`
- Verify DATABASE_URL in `.env`

### Issue: Port 5000 already in use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
- Change PORT in `.env` to 5001 or 5002
- Or kill the process using port 5000

### Issue: Prisma Client not generated
```
Error: @prisma/client did not initialize yet
```
**Solution:**
```bash
npm run prisma:generate
```

### Issue: Migration failed
```
Error: P3009: migrate found failed migrations
```
**Solution:**
```bash
npx prisma migrate reset --force
npm run prisma:migrate
```

---

## 📞 Quick Reference

**Start Everything:**
```bash
# Terminal 1: PostgreSQL (if using Docker)
docker start zoo-postgres

# Terminal 2: Backend
cd backend
npm run dev

# Terminal 3: Frontend (later)
cd frontend
npm start
```

**Database Management:**
```bash
# View database in GUI
npm run prisma:studio

# View tables via psql
psql -U postgres -d zoo_db
\dt
```

---

## ✅ Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `zoo_db` created
- [ ] Backend dependencies installed (`npm install`)
- [ ] `.env` file created with correct DATABASE_URL
- [ ] Prisma Client generated (`npm run prisma:generate`)
- [ ] Migrations run (`npm run prisma:migrate`)
- [ ] Server starts successfully (`npm run dev`)
- [ ] Health check responds at http://localhost:5000/health
- [ ] Can register a user
- [ ] Can login
- [ ] Can access protected routes with token

---

## 🎉 You're Ready!

Your backend is now running locally with PostgreSQL!

**Next Steps:**
1. Test all API endpoints
2. Connect frontend to backend
3. Add sample data
4. Implement AI features integration
5. Deploy to Vercel + Supabase when ready!

---

**Need help?** Check the troubleshooting section or create an issue!


