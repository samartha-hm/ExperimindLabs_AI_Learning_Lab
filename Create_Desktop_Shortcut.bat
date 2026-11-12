@echo off
title Experimind AI Learning Lab - Create Desktop Shortcut
echo ============================================================================
echo   EXPERIMIND AI LEARNING LAB - DESKTOP SHORTCUT CREATOR
echo   Company: Experimind Labs - Innovation for Education
echo ============================================================================
echo.

set "LAB_DIR=%~dp0"
set "TARGET=%LAB_DIR%Launch_Experimind_Lab.bat"
set "ICON=%LAB_DIR%favicon.ico"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $d = [Environment]::GetFolderPath('Desktop'); $s = $ws.CreateShortcut((Join-Path $d 'Experimind AI Learning Lab.lnk')); $s.TargetPath = '%TARGET%'; $s.WorkingDirectory = '%LAB_DIR%'; $s.IconLocation = '%ICON%,0'; $s.Description = 'Experimind AI Learning Lab (LKG to Class 8)'; $s.Save(); Write-Host '[SUCCESS] Desktop shortcut created successfully on your Desktop!' -ForegroundColor Green"

echo.
echo Desktop shortcut created!
echo.
