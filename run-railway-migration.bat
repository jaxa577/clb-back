@echo off
echo ========================================
echo Railway Migration Runner
echo ========================================
echo.
echo This will run Prisma migrations on Railway.
echo Make sure Railway CLI is logged in!
echo.
pause

echo.
echo Step 1: Logging into Railway...
call railway login

echo.
echo Step 2: Linking to your project...
call railway link

echo.
echo Step 3: Running migrations...
call railway run npx prisma migrate deploy

echo.
echo Step 4: Checking migration status...
call railway run npx prisma migrate status

echo.
echo ========================================
echo Done! Check above for any errors.
echo ========================================
pause
