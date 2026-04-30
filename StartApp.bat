@echo off
cd /d "%~dp0"
echo Compiling TypeScript...
call npx tsc *.ts

echo Starting server...
start "Inventory Server" cmd /k node Server.js

echo Waiting 3 seconds for server to start...
timeout /t 3 /nobreak

echo Opening app in browser...
start http://localhost:8080/index.html

echo Done! Your app should open shortly.
echo.

endlocal
pause
