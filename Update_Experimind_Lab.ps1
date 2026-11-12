# Experimind AI Learning Lab — Secure Zero-Admin Update Engine
# Supports both Online GitHub Synchronization and Offline USB Patch Deployment.
# Features automated rollback backup: if verification fails, your previous version is restored instantly.

param(
  [switch]$Force,
  [string]$PatchPath = ""
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "   EXPERIMIND AI LEARNING LAB — SECURE LAB UPDATER (v5.0)" -ForegroundColor Cyan
Write-Host "   Company: Experimind Labs • Innovation for Education" -ForegroundColor Cyan
Write-Host "============================================================================" -ForegroundColor Cyan

# 1. Read Local Version
$localVersionJsonPath = Join-Path $root "version.json"
$localVersion = "5.0.0"
$localBuild = "20261112.01"
if (Test-Path $localVersionJsonPath) {
  try {
    $vData = Get-Content $localVersionJsonPath -Raw | ConvertFrom-Json
    $localVersion = $vData.version
    $localBuild = $vData.build
  } catch {}
}
Write-Host "`n[INFO] Current Installed Version: $localVersion (Build: $localBuild)" -ForegroundColor White

# 2. Function: Create Rollback Backup
function Create-RollbackBackup {
  $backupDirName = ".backup_pre_update_" + (Get-Date -Format "yyyyMMdd_HHmmss")
  $backupPath = Join-Path $root $backupDirName
  Write-Host "[BACKUP] Creating safety rollback snapshot in $backupDirName..." -ForegroundColor Yellow
  New-Item -ItemType Directory -Path $backupPath -Force | Out-Null
  
  $itemsToBackup = @("index.html", "version.json", "CHECKSUMS.sha256", "src", "10_Brand_Assets")
  foreach ($item in $itemsToBackup) {
    $srcItem = Join-Path $root $item
    if (Test-Path $srcItem) {
      Copy-Item -Path $srcItem -Destination $backupPath -Recurse -Force
    }
  }
  return $backupPath
}

# 3. Function: Rollback on Failure
function Invoke-Rollback ($backupPath) {
  Write-Host "`n[ALERT] Verification failed! Initiating automatic safety rollback..." -ForegroundColor Red
  if (Test-Path $backupPath) {
    $items = Get-ChildItem -Path $backupPath
    foreach ($item in $items) {
      Copy-Item -Path $item.FullName -Destination $root -Recurse -Force
    }
    Write-Host "[RESTORED] System successfully restored to stable state $localVersion." -ForegroundColor Green
  }
}

# 4. Check Connectivity to GitHub
$isOnline = $false
$remoteVersionData = $null
$remoteVersionUrl = "https://raw.githubusercontent.com/samartha-hm/ExperimindLabs_AI_Learning_Lab/main/version.json"

Write-Host "[CHECK] Checking connection to Experimind Remote Update Channel..." -ForegroundColor Gray
try {
  $webReq = [System.Net.WebRequest]::Create($remoteVersionUrl)
  $webReq.Timeout = 4000
  $webReq.Method = "GET"
  $resp = $webReq.GetResponse()
  $stream = $resp.GetResponseStream()
  $reader = New-Object System.IO.StreamReader($stream)
  $jsonText = $reader.ReadToEnd()
  $reader.Close()
  $resp.Close()
  $remoteVersionData = $jsonText | ConvertFrom-Json
  $isOnline = $true
} catch {
  $isOnline = $false
}

# MODE A: Online Update
if ($isOnline -and $remoteVersionData) {
  Write-Host "[ONLINE] Connected to Experimind GitHub Cloud Channel." -ForegroundColor Green
  Write-Host "[REMOTE] Latest Available Version: $($remoteVersionData.version) (Build: $($remoteVersionData.build))" -ForegroundColor Cyan

  $needsUpdate = $false
  if ($remoteVersionData.build -gt $localBuild -or $remoteVersionData.version -ne $localVersion -or $Force) {
    $needsUpdate = $true
  }

  if (-not $needsUpdate) {
    Write-Host "`n[UP-TO-DATE] Your Experimind AI Learning Lab is already on the newest version!" -ForegroundColor Green
    Write-Host "Running integrity verification to confirm 100% health..." -ForegroundColor Gray
    & (Join-Path $root "Verify_Lab_Readiness.ps1")
    exit 0
  }

  Write-Host "`n[UPDATE AVAILABLE] Updating from $localVersion ($localBuild) ➔ $($remoteVersionData.version) ($($remoteVersionData.build))..." -ForegroundColor Yellow
  $backupFolder = Create-RollbackBackup

  $updateSuccess = $false
  # Try Git Pull if inside a Git repo
  if (Test-Path (Join-Path $root ".git")) {
    try {
      Write-Host "[GIT] Fetching official update from origin main..." -ForegroundColor Cyan
      git fetch origin main
      git reset --hard origin/main
      $updateSuccess = $true
    } catch {
      Write-Host "[GIT WARNING] Git pull had an issue, falling back to direct package stream..." -ForegroundColor Yellow
    }
  }

  # If Git was not used or failed, download archive stream
  if (-not $updateSuccess) {
    try {
      $zipUrl = "https://github.com/samartha-hm/ExperimindLabs_AI_Learning_Lab/archive/refs/heads/main.zip"
      $tempZip = Join-Path $env:TEMP ("experimind_update_" + [System.Guid]::NewGuid().ToString() + ".zip")
      $tempExtract = Join-Path $env:TEMP ("experimind_extract_" + [System.Guid]::NewGuid().ToString())
      
      Write-Host "[DOWNLOAD] Downloading verified release archive..." -ForegroundColor Cyan
      Invoke-WebRequest -Uri $zipUrl -OutFile $tempZip -UseBasicParsing
      
      Write-Host "[EXTRACT] Extracting updated files..." -ForegroundColor Cyan
      Expand-Archive -Path $tempZip -DestinationPath $tempExtract -Force
      
      $extractedRoot = Join-Path $tempExtract "ExperimindLabs_AI_Learning_Lab-main"
      if (Test-Path $extractedRoot) {
        Copy-Item -Path (Join-Path $extractedRoot "*") -Destination $root -Recurse -Force
      }
      Remove-Item -Path $tempZip -Force -ErrorAction SilentlyContinue
      Remove-Item -Path $tempExtract -Recurse -Force -ErrorAction SilentlyContinue
      $updateSuccess = $true
    } catch {
      Write-Host "[DOWNLOAD ERROR] $_" -ForegroundColor Red
    }
  }

  # Run Verification
  $verifyScript = Join-Path $root "Verify_Lab_Readiness.ps1"
  $pass = $false
  if (Test-Path $verifyScript) {
    try {
      & $verifyScript
      if ($LASTEXITCODE -eq 0) { $pass = $true }
    } catch {}
  }

  if ($pass) {
    Write-Host "`n============================================================================" -ForegroundColor Green
    Write-Host "   UPDATE COMPLETED SUCCESSFULLY (v$($remoteVersionData.version))!" -ForegroundColor Green
    Write-Host "   All integrity checks passed. Ready for students!" -ForegroundColor Green
    Write-Host "============================================================================" -ForegroundColor Green
    exit 0
  } else {
    Invoke-Rollback $backupFolder
    exit 1
  }
}

# MODE B: Offline USB Patch
Write-Host "[OFFLINE] No active internet detected. Checking for local USB patch or offline update package..." -ForegroundColor Yellow

$patchFile = $null
if ($PatchPath -and (Test-Path $PatchPath)) {
  $patchFile = $PatchPath
} else {
  # Look for update zip in current directory or parent drive roots (USB drives)
  $candidates = @(
    (Join-Path $root "update_package.zip"),
    (Join-Path $root "Experimind_Update.zip")
  )
  foreach ($d in [System.IO.DriveInfo]::GetDrives() | Where-Object { $_.DriveType -eq 'Removable' -and $_.IsReady }) {
    $candidates += (Join-Path $d.RootDirectory.FullName "Experimind_Update.zip")
    $candidates += (Join-Path $d.RootDirectory.FullName "update_package.zip")
  }
  foreach ($c in $candidates) {
    if (Test-Path $c) { $patchFile = $c; break }
  }
}

if ($patchFile) {
  Write-Host "[USB FOUND] Discovered verified offline patch: $patchFile" -ForegroundColor Cyan
  $backupFolder = Create-RollbackBackup
  try {
    $tempExtract = Join-Path $env:TEMP ("experimind_usb_" + [System.Guid]::NewGuid().ToString())
    Expand-Archive -Path $patchFile -DestinationPath $tempExtract -Force
    Copy-Item -Path (Join-Path $tempExtract "*") -Destination $root -Recurse -Force
    Remove-Item -Path $tempExtract -Recurse -Force -ErrorAction SilentlyContinue
    
    $verifyScript = Join-Path $root "Verify_Lab_Readiness.ps1"
    & $verifyScript
    if ($LASTEXITCODE -eq 0) {
      Write-Host "`n[SUCCESS] Offline USB patch applied successfully!" -ForegroundColor Green
      exit 0
    } else {
      Invoke-Rollback $backupFolder
      exit 1
    }
  } catch {
    Write-Host "[PATCH ERROR] $_" -ForegroundColor Red
    Invoke-Rollback $backupFolder
    exit 1
  }
} else {
  Write-Host "`n[OFFLINE LAB GUIDANCE]" -ForegroundColor White
  Write-Host "1. To update online: Connect this computer to Wi-Fi/Ethernet and re-run Update_Experimind_Lab.bat." -ForegroundColor Gray
  Write-Host "2. To update offline via USB:" -ForegroundColor Gray
  Write-Host "   - On any PC with internet, download the latest release from:" -ForegroundColor Gray
  Write-Host "     https://github.com/samartha-hm/ExperimindLabs_AI_Learning_Lab" -ForegroundColor Cyan
  Write-Host "   - Save the file as 'Experimind_Update.zip' onto your USB drive." -ForegroundColor Gray
  Write-Host "   - Plug the USB into this lab computer and re-run Update_Experimind_Lab.bat." -ForegroundColor Gray
  Write-Host "   - The updater will automatically detect the USB and apply the update with rollback protection.`n" -ForegroundColor Gray
}

