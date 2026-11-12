# Experimind AI Learning Lab — Cryptographic SHA-256 Checksum Generator
# Generates and updates CHECKSUMS.sha256 for Zero-Trust file integrity verification.

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

Write-Host "=== Generating Cryptographic SHA-256 Integrity Manifest ===" -ForegroundColor Cyan

$filesToHash = @(
  "index.html",
  "version.json",
  "Launch_Experimind_Lab.bat",
  "Verify_Lab_Readiness.ps1",
  "favicon.ico",
  "favicon.png",
  "10_Brand_Assets\Experimind_Labs_Official_Logo.png",
  "10_Brand_Assets\Experimind_Labs_Official_Logo.svg",
  "src\config\brand.js",
  "src\data\curriculum80.js",
  "src\data\externalPlatforms.js",
  "src\data\videoHub.js",
  "src\data\referenceBooks.js",
  "src\audio\soundEngine.js",
  "src\simulators\engines.js",
  "src\vision\visionLab.js",
  "src\videoPlayer.js",
  "src\styles\main.css",
  "src\app.js"
)

$outputLines = @()
$header = "# Experimind AI Learning Lab - SHA-256 Cryptographic Checksum Manifest"
$outputLines += $header
$outputLines += "# Generated on: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss UTC')"
$outputLines += "# Verification format: <sha256_hash>  <relative_path>`n"

foreach ($file in $filesToHash) {
  $fullPath = Join-Path $root $file
  if (Test-Path $fullPath) {
    $hash = (Get-FileHash -Path $fullPath -Algorithm SHA256).Hash.ToLowerInvariant()
    $line = "$hash  $file"
    $outputLines += $line
    Write-Host " [SHA256] $file -> $hash" -ForegroundColor Green
  } else {
    Write-Host " [MISSING] $file" -ForegroundColor Red
  }
}

$checksumPath = Join-Path $root "CHECKSUMS.sha256"
$outputLines | Set-Content -Path $checksumPath -Encoding UTF8
Write-Host "`nSuccessfully wrote integrity manifest: CHECKSUMS.sha256" -ForegroundColor Cyan

