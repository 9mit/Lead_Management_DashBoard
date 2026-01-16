@echo off
echo ================================
echo Lead Management Dashboard Setup
echo ================================
echo.

echo Checking for Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not running!
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

echo [1/4] Starting MongoDB and Backend with Docker...
docker-compose up -d

echo.
echo [2/4] Waiting for services to start (30 seconds)...
timeout /t 30 /nobreak >nul

echo.
echo [3/4] Seeding database with 750 dummy leads...
docker-compose exec -T backend npm run seed

echo.
echo [4/4] Installing frontend dependencies...
cd frontend
call npm install

echo.
echo ================================
echo Setup Complete!
echo ================================
echo.
echo To start the frontend:
echo   cd frontend
echo   npm run dev
echo.
echo Then visit: http://localhost:5173
echo Login with: admin / admin123
echo.
echo To stop services:
echo   docker-compose down
echo.
pause
