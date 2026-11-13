# Experimind AI Learning Lab — Release Packaging & Distribution Tool
# Automates: Checksum Generation -> Pre-Deployment Verification -> Zip Archive Bundling -> Git Release Push

param(
  [string]$NewVersion = "5.0.0",
  [switch]$PushGit
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

Write-Host "=== Experimind AI Learning Lab — Build Release Package ===" -ForegroundColor Cyan

# 1. Update version.json if specified
$versionJsonPath = Join-Path $root "version.json"
if (Test-Path $versionJsonPath) {
  $vObj = Get-Content $versionJsonPath -Raw | ConvertFrom-Json
  $vObj.version = $NewVersion
  $vObj.build = (Get-Date -Format "yyyyMMdd.HHmm")
  $vObj.releaseDate = (Get-Date -Format "yyyy-MM-dd")
  try {
    $commit = git rev-parse --short HEAD
    $vObj.gitCommit = $commit
  } catch {}
  $vObj | ConvertTo-Json -Depth 5 | Set-Content -Path $versionJsonPath -Encoding UTF8
  Write-Host "[VERSION] Updated version.json to v$NewVersion (Build $($vObj.build))" -ForegroundColor Green
}

# 2. Re-generate SHA-256 Checksums
& (Join-Path $root "Generate_Checksums.ps1")

# 3. Verify all deployment gates
& (Join-Path $root "Verify_Lab_Readiness.ps1")
if ($LASTEXITCODE -ne 0) {
  Write-Host "[ERROR] Verification failed! Aborting release packaging." -ForegroundColor Red
  exit 1
}

# 4. Create Production Zip Bundle
$distDir = Join-Path (Split-Path -Parent $root) "RELEASE_BUILDS"
New-Item -ItemType Directory -Path $distDir -Force | Out-Null

$zipName = "Experimind_AI_Learning_Lab_v$NewVersion" + "_ShipReady.zip"
$zipPath = Join-Path $distDir $zipName

Write-Host "`n[PACKAGING] Creating clean production release archive: $zipName..." -ForegroundColor Cyan
if (Test-Path $zipPath) { Remove-Item -Path $zipPath -Force }

Add-Type -AssemblyName System.IO.Compression.FileSystem

# Exclude git, temp folders, and backups
$tempStage = Join-Path $env:TEMP ("experimind_stage_" + [System.Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $tempStage -Force | Out-Null

$itemsToInclude = @(
  "index.html",
  "version.json",
  "CHECKSUMS.sha256",
  "favicon.ico",
  "favicon.png",
  "Launch_Experimind_Lab.bat",
  "Create_Desktop_Shortcut.bat",
  "Sync_Latest_Updates.bat",
  "Push_To_GitHub.bat",
  "Deploy_Lab_Enterprise_Silent.ps1",
  "Update_Experimind_Lab.bat",
  "Update_Experimind_Lab.ps1",
  "Verify_Lab_Readiness.ps1",
  "Generate_Checksums.ps1",
  "Build_Release_Package.ps1",
  "00_MASTER_REQUIREMENTS.md",
  "AGENT.md",
  "README.md",
  ".github",
  "10_Brand_Assets",
  "Offline_AI_Software_Installers",
  "src"
)

foreach ($item in $itemsToInclude) {
  $srcPath = Join-Path $root $item
  if (Test-Path $srcPath) {
    Copy-Item -Path $srcPath -Destination $tempStage -Recurse -Force
  }
}

[System.IO.Compression.ZipFile]::CreateFromDirectory($tempStage, $zipPath, [System.IO.Compression.CompressionLevel]::Optimal, $false)
Remove-Item -Path $tempStage -Recurse -Force -ErrorAction SilentlyContinue

$zipSizeMb = [math]::Round(((Get-Item $zipPath).Length / 1MB), 2)
$successMsg = "[SUCCESS] Release bundle packaged successfully: $zipPath [$zipSizeMb MB]"
Write-Host $successMsg -ForegroundColor Green

# 5. Git commit & push if requested
if ($PushGit) {
  Write-Host "`n[GIT] Committing version bump and pushing to origin main..." -ForegroundColor Cyan
  git add .
  git commit -m "release: Experimind AI Learning Lab v$NewVersion production release"
  git push origin main
  Write-Host "[GIT SUCCESS] Remote GitHub update channel successfully published!" -ForegroundColor Green
} else {
  Write-Host "[TIP] Run with -PushGit to automatically publish this update to all school labs via GitHub." -ForegroundColor Yellow
}

