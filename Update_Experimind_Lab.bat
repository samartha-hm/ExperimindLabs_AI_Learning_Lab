@echo off
title Experimind AI Learning Lab — Secure One-Click Updater
echo ============================================================================
echo   EXPERIMIND AI LEARNING LAB — ONE-CLICK LAB UPDATER
echo   Company: Experimind Labs - Innovation for Education
echo   Mode: Zero Admin Rights - Safe Rollback Protection
echo ============================================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Update_Experimind_Lab.ps1"

echo.
echo Press any key to exit...
pause >nul
