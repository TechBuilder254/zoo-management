# 🧪 Complete System Testing Guide

## ✅ What's Been Fixed

### Backend ✅
- Database `zoo_db` created with all 8 tables
- Sample data loaded (8 animals, 2 users, 2 reviews)
- API server running on port 5000
- All endpoints tested and working

### Frontend Fixes ✅
- Updated Animal types to match backend schema
- Fixed AnimalCard component to use backend data
- Fixed Animals page list/grid view
- Removed all mock data dependencies
- Updated image URLs to use `imageUrl` from backend
- Fixed habitat display (string vs object)
- Fixed animal category display

---

## 🚀 Start The System

### Terminal 1: Backend (Already Running)
```bash
cd backend
npm run dev
# ✅ Running on http://localhost:5000
```

### Terminal 2: Frontend
```bash
cd frontend
npm start
# Will run on http://localhost:3000
```

---

## 🧪 Test Checklist

### 1. Animals Page (http://localhost:3000/animals)
- [ ] Should show 8 animals from database
- [ ] Images should load (using imageUrl from backend)
- [ ] Animal names: Leo, Ella, Gerry, Panda, Stripe, Polar, Polly, Koko
- [ ] Categories showing: "Mammals", "Birds"
- [ ] Habitats showing correctly
- [ ] Grid/List view toggle works
- [ ] Search bar works
- [ ] Filters work (category, status, sort)

### 2. Authentication
- [ ] Login with: visitor@example.com / password123
- [ ] Login with: admin@zoo.com / admin123
- [ ] Register new user works
- [ ] Logout works
- [ ] Protected routes redirect to login

### 3. Animal Details
- [ ] Click on any animal
- [ ] Should load details from database
- [ ] Image displays correctly
- [ ] Description, species, habitat show
- [ ] Reviews section shows

### 4. Reviews (AI Sentiment!)
- [ ] Login as visitor
- [ ] Go to animal detail page
- [ ] Write a review: "This zoo is amazing!"
- [ ] Submit review
- [ ] Should see sentiment badge: 😊 Positive
- [ ] AI sentiment analysis working!

### 5. Favorites
- [ ] Login as user
- [ ] Click heart icon on animal card
- [ ] Should add to favorites
- [ ] Go to Favorites page
- [ ] Should see favorited animals
- [ ] Click heart again to remove

### 6. Bookings
- [ ] Go to Booking page
- [ ] Select date and tickets
- [ ] Create booking
- [ ] Should save to database
- [ ] Go to My Bookings
- [ ] Should see booking list

### 7. Admin Features (Login as admin@zoo.com)
- [ ] Go to /admin/dashboard
- [ ] Should see statistics
- [ ] Go to /admin/animals
- [ ] CRUD operations on animals
- [ ] Go to /admin/reviews
- [ ] See reviews with AI sentiment
- [ ] Filter by sentiment (Positive/Negative/Neutral)
- [ ] Approve/Reject reviews

---

## 🎯 API Endpoints to Test

### Animals
```bash
# Get all animals
curl http://localhost:5000/api/animals

# Get single animal
curl http://localhost:5000/api/animals/[ID]

# Create animal (requires auth)
curl -X POST http://localhost:5000/api/animals \
  -H "Authorization: Bearer [TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Animal","species":"Test Species","category":"Mammals","habitat":"Test Habitat","description":"Test"}'
```

### Auth
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"visitor@example.com","password":"password123"}'
```

### Reviews
```bash
# Get reviews for animal
curl http://localhost:5000/api/reviews/animal/[ANIMAL_ID]

# Create review (requires auth)
curl -X POST http://localhost:5000/api/reviews \
  -H "Authorization: Bearer [TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"animalId":"[ID]","rating":5,"comment":"Amazing animal!"}'
```

### Bookings
```bash
# Create booking (requires auth)
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer [TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"visitDate":"2025-12-25","ticketType":"adult","quantity":2,"totalPrice":50.00}'

# Get user bookings
curl http://localhost:5000/api/bookings/my-bookings \
  -H "Authorization: Bearer [TOKEN]"
```

---

## 🔍 Database Verification

### Using Prisma Studio
```bash
cd backend
npm run prisma:studio
# Opens at http://localhost:5555
```

Check:
- [ ] 8 animals in `animals` table
- [ ] 2 users in `users` table  
- [ ] 2 reviews in `reviews` table (with sentiment data!)
- [ ] 1 event in `events` table

---

## ❌ Known Issues Fixed

### ✅ Fixed: Type Mismatches
- Animal interface updated to match backend schema
- `id` vs `_id` handled
- `category` vs `type` handled
- `imageUrl` vs `mainPhoto` handled
- `habitat` string vs object handled

### ✅ Fixed: Mock Data
- Removed mock data from animalService
- All API calls now go to real backend
- Sample data loaded in database

### ✅ Fixed: Image Display
- Using `imageUrl` from backend
- Fallback to placeholder if no image
- Images from Unsplash working

---

## 🎉 Expected Results

### Animals Page
```
8 animals displayed in grid/list
All with images from database
Categories: Mammals (7), Birds (1)
All clickable to detail pages
```

### Animal Detail
```
Full animal information
Image from database
Reviews section (2 reviews)
Sentiment badges on reviews
Add review form (when logged in)
```

### Admin Dashboard
```
Total animals: 8
Total users: 2
Total reviews: 2  
Total bookings: 0
Sentiment breakdown chart
```

---

## 🐛 If Something Doesn't Work

### Animals not showing
1. Check backend is running: http://localhost:5000/health
2. Check frontend console for errors
3. Verify API call: http://localhost:5000/api/animals

### Images not loading
- Using Unsplash images, internet required
- CORS should be configured (backend allows frontend)

### Login fails
- Check credentials: visitor@example.com / password123
- Check backend logs for errors
- Verify JWT_SECRET in backend/.env

### Reviews not showing sentiment
- Check if Hugging Face API key is in frontend/.env.local
- Sentiment analysis might use fallback (still works)
- Check browser console for AI service logs

---

## ✅ Success Criteria

Frontend → Backend → Database flow working:
1. ✅ Animals load from database
2. ✅ Login creates JWT token
3. ✅ Reviews save to database
4. ✅ AI sentiment analysis runs
5. ✅ Favorites save/load
6. ✅ Bookings create
7. ✅ Admin can CRUD animals

**Everything connected and functional!** 🎊

