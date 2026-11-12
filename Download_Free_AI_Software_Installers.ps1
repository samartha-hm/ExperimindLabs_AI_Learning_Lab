# Experimind AI Learning Lab — Free AI & Coding Software Offline Installer Fetcher
# Run this script tonight on your internet-connected PC to download official offline desktop installers
# for Scratch 3.0 Desktop and GCompris directly onto your USB drive for tomorrow's school lab.

param(
  [string]$DestinationDir = ""
)

$ErrorActionPreference = "Continue"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

if (-not $DestinationDir) {
  $DestinationDir = Join-Path $root "Offline_AI_Software_Installers"
}

Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "   FREE AI-RELATED SOFTWARE — OFFLINE INSTALLER PREPARATION TOOL" -ForegroundColor Cyan
Write-Host "   Company: Experimind Labs • Innovation for Education" -ForegroundColor Cyan
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "`nTarget Output Folder: $DestinationDir`n" -ForegroundColor White

New-Item -ItemType Directory -Path $DestinationDir -Force | Out-Null

# 1. Scratch 3.0 Desktop (MIT Media Lab)
# Official Direct Offline Direct Download URL from Scratch Foundation
$scratchUrl = "https://downloads.scratch.mit.edu/desktop/Scratch%20Setup.exe"
$scratchDest = Join-Path $DestinationDir "Scratch_3_Desktop_Setup.exe"

Write-Host "1. MIT Scratch 3.0 Desktop (Official 100% Offline Windows Installer)" -ForegroundColor Yellow
if (Test-Path $scratchDest) {
  Write-Host "   [ALREADY DOWNLOADED] $scratchDest" -ForegroundColor Green
} else {
  Write-Host "   Downloading Scratch Desktop installer from official MIT servers..." -ForegroundColor Gray
  try {
    Invoke-WebRequest -Uri $scratchUrl -OutFile $scratchDest -UseBasicParsing -TimeoutSec 120
    Write-Host "   [SUCCESS] Scratch 3 Desktop Setup saved! ($([math]::Round((Get-Item $scratchDest).Length / 1MB, 1)) MB)" -ForegroundColor Green
  } catch {
    Write-Host "   [NOTE] Direct download failed or timed out. You can also download Scratch 3 directly from: https://scratch.mit.edu/download" -ForegroundColor Yellow
  }
}

# 2. GCompris Educational Software Suite (KDE Community)
# Official 64-bit Windows Standalone Installer
$gcomprisUrl = "https://www.gcompris.net/download/qt/windows/gcompris-qt-4.3-Windows-x86_64.exe"
$gcomprisDest = Join-Path $DestinationDir "GCompris_Educational_Suite_Setup.exe"

Write-Host "`n2. GCompris Educational Software Suite (LKG to Class 4 Foundational Logic)" -ForegroundColor Yellow
if (Test-Path $gcomprisDest) {
  Write-Host "   [ALREADY DOWNLOADED] $gcomprisDest" -ForegroundColor Green
} else {
  Write-Host "   Downloading GCompris Windows installer from KDE servers..." -ForegroundColor Gray
  try {
    Invoke-WebRequest -Uri $gcomprisUrl -OutFile $gcomprisDest -UseBasicParsing -TimeoutSec 120
    Write-Host "   [SUCCESS] GCompris Setup saved! ($([math]::Round((Get-Item $gcomprisDest).Length / 1MB, 1)) MB)" -ForegroundColor Green
  } catch {
    Write-Host "   [NOTE] Direct download failed or timed out. You can also download GCompris directly from: https://www.gcompris.net/downloads-en.html" -ForegroundColor Yellow
  }
}

# 3. Create Silent Installer Helper Script for School Lab Admins
$silentInstallBat = Join-Path $DestinationDir "Silent_Install_All_Software.bat"
$batContent = @"
@echo off
title Free AI Software Silent Lab Installer
echo Installing Scratch 3 Desktop and GCompris for School Lab...
if exist "%~dp0Scratch_3_Desktop_Setup.exe" (
  echo Installing Scratch 3 Desktop...
  start /wait "" "%~dp0Scratch_3_Desktop_Setup.exe" /S
)
if exist "%~dp0GCompris_Educational_Suite_Setup.exe" (
  echo Installing GCompris...
  start /wait "" "%~dp0GCompris_Educational_Suite_Setup.exe" /S
)
echo Installation complete!
pause
"@
$batContent | Set-Content -Path $silentInstallBat -Encoding ASCII

Write-Host "`n============================================================================" -ForegroundColor Cyan
Write-Host "   INSTALLER PREPARATION COMPLETE!" -ForegroundColor Green
Write-Host "   Copy the '$DestinationDir' folder onto your USB drive." -ForegroundColor White
Write-Host "   If any student PC needs Scratch or GCompris installed locally," -ForegroundColor White
Write-Host "   simply run Silent_Install_All_Software.bat from the USB drive!" -ForegroundColor White
Write-Host "============================================================================" -ForegroundColor Cyan

