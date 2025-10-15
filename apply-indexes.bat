@echo off
echo ================================================
echo   Database Index Setup - Zoo Management System
echo ================================================
echo.
echo This script will guide you through applying
echo performance indexes to your database.
echo.
echo Choose your method:
echo.
echo 1. Open Supabase SQL Editor (Recommended)
echo 2. Show database connection instructions
echo 3. Exit
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" goto supabase
if "%choice%"=="2" goto instructions
if "%choice%"=="3" goto end

:supabase
echo.
echo ================================================
echo   SUPABASE SQL EDITOR METHOD
echo ================================================
echo.
echo Follow these steps:
echo.
echo 1. Go to https://supabase.com/dashboard
echo 2. Select your project
echo 3. Click on "SQL Editor" in the left sidebar
echo 4. Open the file: backend\database-indexes.sql
echo 5. Copy all the SQL code (Ctrl+A, Ctrl+C)
echo 6. Paste it into the SQL Editor
echo 7. Click "Run" button (bottom right)
echo 8. Wait for success message
echo.
echo Opening the SQL file now...
start notepad backend\database-indexes.sql
echo.
echo After applying indexes:
echo - Read DATABASE_INDEXING_GUIDE.md for verification
echo - Test your application performance
echo.
pause
goto end

:instructions
echo.
echo ================================================
echo   DATABASE CONNECTION METHOD
echo ================================================
echo.
echo If you have psql installed, run:
echo.
echo psql "your-connection-string" ^< backend\database-indexes.sql
echo.
echo OR use any PostgreSQL client:
echo 1. Connect to your database
echo 2. Open backend\database-indexes.sql
echo 3. Execute the SQL commands
echo.
pause
goto end

:end
echo.
echo ================================================
echo   Next Steps
echo ================================================
echo.
echo 1. Read DATABASE_INDEXING_GUIDE.md for details
echo 2. Verify indexes were created
echo 3. Test your application - it should be MUCH faster!
echo.
echo Documentation:
echo - DATABASE_INDEXING_GUIDE.md - Complete guide
echo - PERFORMANCE_OPTIMIZATIONS.md - Frontend integration
echo - OPTIMIZATION_SUMMARY.md - Overall summary
echo.
pause

