@echo off
echo ========================================================
echo   Starting DevPilot AI (Autonomous Command Center)
echo ========================================================
echo.

echo [1/2] Starting Backend (FastAPI) on http://localhost:8000 ...
start "DevPilot AI - Backend" cmd /k "cd backend && venv\Scripts\python.exe main.py"

echo [2/2] Starting Frontend (Next.js) on http://localhost:3000 ...
start "DevPilot AI - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers have been launched in separate terminal windows!
echo - Frontend UI:     http://localhost:3000
echo - Backend API:     http://localhost:8000
echo - Swagger Docs:    http://localhost:8000/docs
echo ========================================================
