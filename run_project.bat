@echo off
title Ecoversee Launcher
echo ==========================================================
echo               ECOVERSEE LAUNCHER SERVICES                
echo ==========================================================
echo.

echo [1/4] Terminating any existing processes on ports 8080 and 5173...
:: Kill processes occupying port 8080 (Backend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080') do (
    echo Killing process %%a on port 8080...
    taskkill /F /PID %%a 2>nul
)
:: Kill processes occupying port 5173 (Frontend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do (
    echo Killing process %%a on port 5173...
    taskkill /F /PID %%a 2>nul
)
echo Done.
echo.

echo [2/4] Starting Spring Boot Backend in a new window...
start "Ecoversee Backend Server" cmd /k "cd backend && mvnw.cmd spring-boot:run"
echo.

echo [3/4] Starting React Frontend in a new window...
start "Ecoversee React Client" cmd /k "cd frontend && npm run dev"
echo.

echo [4/4] Opening browser to Ecoversee...
echo Waiting 6 seconds for servers to initialize...
timeout /t 6 >nul
start http://localhost:5173

echo.
echo ==========================================================
echo Ecoversee is loading! 
echo Keep the two newly opened command windows running.
echo ==========================================================
echo.
pause
