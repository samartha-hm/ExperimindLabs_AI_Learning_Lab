@echo off
title Experimind AI Learning Lab — Update Synchronizer (v5.0.0)
echo ============================================================================
echo   EXPERIMIND AI LEARNING LAB — UPDATE SYNCHRONIZER
echo   Target: https://github.com/samartha-hm/ExperimindLabs_AI_Learning_Lab
echo ============================================================================
echo.

set "LAB_DIR=%~dp0"
cd /d "%LAB_DIR%"

where git >nul 2>&1
if %errorlevel% equ 0 (
    if exist "%LAB_DIR%.git" (
        echo [GIT DETECTED] Synchronizing latest updates via Git...
        git pull origin main
        if %errorlevel% equ 0 (
            echo.
            echo [SUCCESS] Experimind AI Learning Lab is now 100%% up to date!
            echo.
            pause
            exit /b 0
        ) else (
            echo [WARN] Git pull encountered an error. Attempting direct zip download...
        )
    )
)

echo [DIRECT SYNC] Downloading latest verified package from GitHub...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$repoZip = 'https://github.com/samartha-hm/ExperimindLabs_AI_Learning_Lab/archive/refs/heads/main.zip';" ^
    "$tempZip = Join-Path $env:TEMP 'Experimind_Update_Latest.zip';" ^
    "$extractDir = Join-Path $env:TEMP ('Experimind_Extract_' + [System.Guid]::NewGuid().ToString());" ^
    "try {" ^
    "    Write-Host 'Fetching latest update zip...' -ForegroundColor Cyan;" ^
    "    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12;" ^
    "    (New-Object System.Net.WebClient).DownloadFile($repoZip, $tempZip);" ^
    "    Write-Host 'Extracting update bundle...' -ForegroundColor Cyan;" ^
    "    Expand-Archive -Path $tempZip -DestinationPath $extractDir -Force;" ^
    "    $sub = Get-ChildItem -Path $extractDir | Where-Object { $_.PSIsContainer } | Select-Object -First 1;" ^
    "    if ($sub) {" ^
    "        Copy-Item -Path (Join-Path $sub.FullName '*') -Destination '%LAB_DIR%' -Recurse -Force;" ^
    "        Write-Host '[SUCCESS] Platform updated successfully to latest build!' -ForegroundColor Green;" ^
    "    }" ^
    "    Remove-Item $tempZip -Force -ErrorAction SilentlyContinue;" ^
    "    Remove-Item $extractDir -Recurse -Force -ErrorAction SilentlyContinue;" ^
    "} catch {" ^
    "    Write-Host ('[ERROR] Failed to download or apply update: ' + $_.Exception.Message) -ForegroundColor Red;" ^
    "    exit 1;" ^
    "}"

if %errorlevel% equ 0 (
    echo.
    echo Update complete! All curriculum, simulators, and video resources are updated.
) else (
    echo.
    echo Please ensure the computer has active internet access and try again.
)
echo.
pause
