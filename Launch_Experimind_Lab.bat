@echo off
title Experimind AI Learning Lab — Offline Portable Launcher
echo ============================================================================
echo   EXPERIMIND AI LEARNING LAB (LKG to Class 8)
echo   Company: Experimind Labs - Innovation for Education
echo   Mode: 100%% Offline-First School Computer Lab Suite (Zero Admin Required)
echo ============================================================================
echo.

set "LAB_DIR=%~dp0"
set "ENTRY_HTML=%LAB_DIR%index.html"

:: Optional Silent Auto-Update Check (Fast-forward if online with Git; fallback immediately offline)
where git >nul 2>&1
if %errorlevel% equ 0 (
    if exist "%LAB_DIR%.git" (
        git pull --ff-only origin main >nul 2>&1
    )
)

:: Check 64-bit and 32-bit Microsoft Edge installations
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" --app="%ENTRY_HTML%"
    exit /b 0
)
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app="%ENTRY_HTML%"
    exit /b 0
)

:: Check Google Chrome installations
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app="%ENTRY_HTML%"
    exit /b 0
)
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --app="%ENTRY_HTML%"
    exit /b 0
)
if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" (
    start "" "%LocalAppData%\Google\Chrome\Application\chrome.exe" --app="%ENTRY_HTML%"
    exit /b 0
)

:: Default browser fallback
start "" "%ENTRY_HTML%"
