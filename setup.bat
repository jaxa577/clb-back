@echo off
echo ========================================
echo SNG LoadBoard Backend Setup
echo ========================================
echo.

echo [1/6] Starting PostgreSQL with Docker...
docker-compose up -d
timeout /t 10 /nobreak >nul

echo.
echo [2/6] Installing dependencies...
call npm install

echo.
echo [3/6] Generating Prisma Client...
call npx prisma generate

echo.
echo [4/6] Running database migrations...
call npx prisma db push

echo.
echo [5/6] Seeding database with demo data...
call npm run seed

echo.
echo [6/6] Setup complete!
echo.
echo ========================================
echo Backend Setup Complete!
echo ========================================
echo.
echo Demo Accounts:
echo - Admin:    admin@sngloadboard.com / password123
echo - Shipper:  shipper1@example.com / password123
echo - Broker:   broker1@example.com / password123
echo - Driver:   driver1@example.com / password123
echo.
echo Start the backend:  npm run start:dev
echo API will run on:    http://localhost:3001
echo Swagger docs at:    http://localhost:3001/api/docs
echo.
pause
