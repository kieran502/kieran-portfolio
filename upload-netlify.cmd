@echo off
rem Builds a review copy and uploads it to Netlify (settings in .env.deploy)
cd /d "%~dp0"
set "PORTABLE=%LOCALAPPDATA%\Programs\nodejs-portable\node-v24.22.3-win-x64"
where node >nul 2>nul || set "PATH=%PORTABLE%;%PATH%"
call npm run deploy:netlify
pause
