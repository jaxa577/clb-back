@echo off
echo ========================================
echo Force Nixpacks Deployment on Railway
echo ========================================
echo.
echo This will redeploy your backend using Nixpacks builder.
echo.
pause

echo.
echo Step 1: Logging into Railway...
call railway login

echo.
echo Step 2: Linking to your project...
call railway link

echo.
echo Step 3: Deploying with Nixpacks...
echo Note: Railway should auto-detect Nixpacks from railway.toml
call railway up

echo.
echo Step 4: Monitoring deployment...
call railway logs

echo.
echo ========================================
echo Deployment triggered!
echo Check Railway dashboard for progress.
echo ========================================
pause
