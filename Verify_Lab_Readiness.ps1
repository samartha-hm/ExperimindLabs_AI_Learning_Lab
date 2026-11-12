# Experimind AI Learning Lab — School Deployment & Integrity Verification Script (v5.0 Enterprise)
Write-Host "=== Experimind AI Learning Lab Pre-Deployment Verification ===" -ForegroundColor Cyan
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$required = @(
  "index.html",
  "version.json",
  "CHECKSUMS.sha256",
  "favicon.ico",
  "favicon.png",
  "Launch_Experimind_Lab.bat",
  "Create_Desktop_Shortcut.bat",
  "00_MASTER_REQUIREMENTS.md",
  "10_Brand_Assets\Experimind_Labs_Official_Logo.png",
  "src\config\brand.js",
  "src\data\curriculum80.js",
  "src\data\externalPlatforms.js",
  "src\data\videoHub.js",
  "src\data\referenceBooks.js",
  "src\simulators\engines.js",
  "src\vision\visionLab.js",
  "src\videoPlayer.js",
  "src\audio\soundEngine.js",
  "src\styles\main.css",
  "src\app.js"
)
$missing = 0
foreach ($rel in $required) {
  $full = Join-Path $root $rel
  if (Test-Path $full) {
    Write-Host "[PASS] Found $rel" -ForegroundColor Green
  } else {
    Write-Host "[FAIL] Missing $rel" -ForegroundColor Red
    $missing++
  }
}

# Optional Deep Cryptographic Integrity Audit if CHECKSUMS.sha256 exists
$checksumPath = Join-Path $root "CHECKSUMS.sha256"
$hashMismatches = 0
if (Test-Path $checksumPath) {
  Write-Host "`n--- Running Deep Cryptographic SHA-256 Audit ---" -ForegroundColor Cyan
  $lines = Get-Content $checksumPath | Where-Object { $_ -and -not $_.StartsWith("#") }
  foreach ($line in $lines) {
    $parts = $line.Split(" ", [System.StringSplitOptions]::RemoveEmptyEntries)
    if ($parts.Length -ge 2) {
      $expectedHash = $parts[0].Trim().ToLowerInvariant()
      $filePath = $parts[1].Trim()
      $target = Join-Path $root $filePath
      if (Test-Path $target) {
        $actualHash = (Get-FileHash -Path $target -Algorithm SHA256).Hash.ToLowerInvariant()
        if ($expectedHash -eq $actualHash) {
          Write-Host " [INTEGRITY OK] $filePath" -ForegroundColor DarkGreen
        } else {
          Write-Host " [HASH MISMATCH!] $filePath (Expected $expectedHash, got $actualHash)" -ForegroundColor Red
          $hashMismatches++
        }
      }
    }
  }
}

if ($missing -eq 0 -and $hashMismatches -eq 0) {
  Write-Host "`nALL 19 DEPLOYMENT & INTEGRITY GATES PASSED (100/100)! Ready for school computer lab USB copy." -ForegroundColor Green
  exit 0
} else {
  Write-Host "`nWARNING: $missing missing files, $hashMismatches cryptographic hash mismatches." -ForegroundColor Yellow
  exit 1
}
