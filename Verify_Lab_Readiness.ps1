# Experimind AI Learning Lab — School Deployment Verification Script
Write-Host "=== Experimind AI Learning Lab Pre-Deployment Verification ===" -ForegroundColor Cyan
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$required = @(
  "index.html",
  "Launch_Experimind_Lab.bat",
  "00_MASTER_REQUIREMENTS.md",
  "10_Brand_Assets\Experimind_Labs_Official_Logo.png",
  "src\config\brand.js",
  "src\data\curriculum80.js",
  "src\data\externalPlatforms.js",
  "src\data\videoHub.js",
  "src\data\referenceBooks.js",
  "src\simulators\engines.js",
  "src\vision\visionLab.js",
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
if ($missing -eq 0) {
  Write-Host "`nALL 14 DEPLOYMENT GATES PASSED! Ready for school computer lab USB copy." -ForegroundColor Green
} else {
  Write-Host "`nWARNING: $missing required files missing." -ForegroundColor Yellow
}
