@echo off
echo Starting Zoo Wildlife System with Supabase...
echo.

REM Start Backend
start cmd /k "cd backend && npm run dev"

REM Wait 3 seconds
timeout /t 3 /nobreak >nul

REM Start Frontend
start cmd /k "cd frontend && npm start"

echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Both servers are starting...

