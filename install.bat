@echo off
echo =========================================
echo    BluprintMania Installer / Updater
echo =========================================
echo.

cd /d "%~dp0"

echo [1/2] Checking and installing dependencies...
call npm install

echo [2/2] Updating existing dependencies...
call npm update

echo.
echo =========================================
echo    Installation/Update Complete!
echo    You can now double-click start_server.bat
echo =========================================
pause
