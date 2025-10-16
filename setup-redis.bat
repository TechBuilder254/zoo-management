@echo off
echo 🚀 Setting up Redis for Zoo & Wildlife System Performance Optimization
echo.

echo 📋 Checking if Redis is already installed...
redis-server --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Redis is already installed!
    goto :start_redis
)

echo ❌ Redis is not installed. Installing Redis...
echo.

echo 📥 Downloading Redis for Windows...
echo Please download Redis from: https://github.com/microsoftarchive/redis/releases
echo Or install using Chocolatey: choco install redis-64
echo Or install using WSL: wsl --install -d Ubuntu
echo.

echo 🔧 Alternative: Using Redis in Docker
echo docker run -d --name redis -p 6379:6379 redis:alpine
echo.

echo ⚠️  Please install Redis manually and then run this script again.
pause
exit /b 1

:start_redis
echo.
echo 🔄 Starting Redis server...
echo.

REM Try to start Redis server
redis-server --daemonize yes >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Redis server started successfully!
) else (
    echo ⚠️  Could not start Redis as daemon. Trying to start in foreground...
    echo 📝 Redis server will start in a new window. Please keep it running.
    start "Redis Server" redis-server
    timeout /t 3 >nul
)

echo.
echo 🧪 Testing Redis connection...
redis-cli ping >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Redis is running and responding!
) else (
    echo ❌ Redis is not responding. Please check if it's running.
    echo.
    echo 🔧 Troubleshooting:
    echo 1. Make sure Redis is installed
    echo 2. Check if port 6379 is available
    echo 3. Try starting Redis manually: redis-server
    pause
    exit /b 1
)

echo.
echo 🎉 Redis setup completed successfully!
echo.
echo 📊 Redis Configuration:
echo    - Host: localhost
echo    - Port: 6379
echo    - URL: redis://localhost:6379
echo.
echo 🚀 You can now start your backend server with Redis caching enabled!
echo.
pause
