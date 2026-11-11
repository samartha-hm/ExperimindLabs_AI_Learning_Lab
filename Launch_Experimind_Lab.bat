@echo off
title Experimind AI Learning Lab — Offline Portable Launcher
echo ============================================================================
echo   EXPERIMIND AI LEARNING LAB (LKG to Class 8)
echo   Company: Experimind Labs - Innovation for Education
echo   Mode: 100%% Offline-First School Computer Lab Suite (Zero Admin Required)
echo ============================================================================
echo.
set "LAB_DIR=%~dp0"
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --new-window "%LAB_DIR%index.html"
    exit /b 0
)
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --new-window "%LAB_DIR%index.html"
    exit /b 0
)
start "" "%LAB_DIR%index.html"
