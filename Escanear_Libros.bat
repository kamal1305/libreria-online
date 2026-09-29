@echo off
chcp 65001 > nul
title Escáner de Libros · Más que libros
color 0B
cd /d "%~dp0"

echo ==============================================================
echo    Iniciando Lector de Codigo de Barras Mas que Libros...
echo ==============================================================
echo.

node scripts/scanner.js

echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause > nul
