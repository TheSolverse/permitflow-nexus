@echo off
title PermitFlow Nexus - Full Stack Launcher
color 0A

echo =======================================================================
echo               PERMITFLOW NEXUS - 1-CLICK LAUNCHER
echo =======================================================================
echo.
echo [1/3] Checking environment...
cd /d "%~dp0"

echo [2/3] Starting Backend Server (Port 5000) & Frontend (Port 5173)...
start /b cmd /c "npm run server"
start /b cmd /c "npm run dev"

echo [3/3] Waiting for servers to initialize...
timeout /t 3 /nobreak >nul

echo.
echo Opening PermitFlow Nexus in default browser...
start http://localhost:5173/

echo.
echo =======================================================================
echo   Website is running!
echo   Frontend: http://localhost:5173/
echo   Backend:  http://localhost:5000/
echo   Press Ctrl+C or close this window to stop the servers.
echo =======================================================================
echo.

pause
