#!/bin/bash
cd "$(dirname "$0")"
clear
echo "================================================================"
echo "  📚 MÁS QUE LIBROS · ESCÁNER DE INVENTARIO PARA MAC"
echo "================================================================"
echo ""
node scripts/scanner.js
read -p "Presiona Enter para cerrar esta ventana..."
