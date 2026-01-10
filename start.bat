@echo off
echo Starting SNG LoadBoard Backend...
echo.
echo Checking Docker containers...
docker-compose up -d
timeout /t 3 /nobreak >nul

echo.
echo Starting NestJS server in development mode...
echo Backend will be available at http://localhost:3001
echo Swagger docs at http://localhost:3001/api/docs
echo.
call npm run start:dev
