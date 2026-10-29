@echo off
title Neural CV
cd /d "%~dp0"

echo.
echo  ╔══════════════════════════════════╗
echo  ║       Neural CV - Iniciando      ║
echo  ╚══════════════════════════════════╝
echo.

:: Verificar si node esta instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo  ERROR: Node.js no esta instalado.
    echo  Descargalo desde https://nodejs.org
    echo.
    pause
    exit /b 1
)

:: Matar proceso previo en puerto 4173 si existe
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":4173 "') do (
    taskkill /f /pid %%a >nul 2>nul
)

echo  Iniciando servidor...

:: Iniciar servidor Node (sin dependencias extra)
start "" /b cmd /c "node server.mjs"

:: Esperar a que el servidor arranque
timeout /t 2 /nobreak >nul

:: Abrir navegador
echo  Abriendo http://localhost:4173
start "" "http://localhost:4173"

echo.
echo  Neural CV esta corriendo en http://localhost:4173
echo  Manten esta ventana abierta mientras usas la app.
echo  Presiona cualquier tecla para cerrar el servidor.
echo.
pause >nul

:: Al cerrar, matar el proceso del servidor
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":4173 "') do (
    taskkill /f /pid %%a >nul 2>nul
)
echo  Servidor cerrado.
