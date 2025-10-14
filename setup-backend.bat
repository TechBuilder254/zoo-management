@echo off
echo ================================================
echo   BACKEND SETUP
echo ================================================
echo.

echo Creating .env file...
(
echo # Database (PostgreSQL Local^)
echo DATABASE_URL="postgresql://postgres:postgres@localhost:5432/zoo_db?schema=public"
echo.
echo # JWT Secret
echo JWT_SECRET=super_secret_jwt_key_change_this_in_production_please
echo.
echo # Server
echo PORT=5000
echo NODE_ENV=development
echo.
echo # CORS
echo FRONTEND_URL=http://localhost:3000
) > backend\.env

echo ✓ Created backend\.env

echo.
echo ================================================
echo   IMPORTANT: Edit backend\.env file
echo ================================================
echo.
echo Update DATABASE_URL with your PostgreSQL credentials:
echo   - Default username: postgres
echo   - Default password: postgres (change if different)
echo   - Database name: zoo_db
echo.
echo Example:
echo DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/zoo_db?schema=public"
echo.
echo ================================================
echo   NEXT STEPS:
echo ================================================
echo.
echo 1. Make sure PostgreSQL is installed and running
echo 2. Create database: 
echo    psql -U postgres -c "CREATE DATABASE zoo_db;"
echo.
echo 3. Run migrations:
echo    cd backend
echo    npm run prisma:generate
echo    npm run prisma:migrate
echo.
echo 4. (Optional) Add sample data:
echo    npm run prisma:seed
echo.
echo 5. Start server:
echo    npm run dev
echo.
pause

