@echo off
rem Starts the site locally with live reload. Leave this window open while you work.
rem Uses Node.js from PATH if installed, otherwise the portable copy in your user profile.
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 set "PATH=%LOCALAPPDATA%\Programs\nodejs-portable\node-v24.22.3-win-x64;%PATH%"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install it from https://nodejs.org and run this again.
  pause
  exit /b 1
)
if not exist node_modules call npm install
call npm run dev -- --open
pause
