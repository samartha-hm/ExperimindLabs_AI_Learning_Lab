# Experimind AI Learning Lab — Enterprise Silent Multi-PC Lab Deployment Tool
# Used by School Network Administrators to push Experimind AI Learning Lab to 20-50+ computers across LAN / Active Directory.

param(
  [string[]]$ComputerNames = @(),
  [string]$SharedSourcePath = "\\SERVER\Shared\Experimind_AI_Learning_Lab",
  [string]$LocalDestinationPath = "C:\Experimind_AI_Learning_Lab"
)

$ErrorActionPreference = "Continue"

Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "   EXPERIMIND AI LEARNING LAB — ENTERPRISE MULTI-PC LAB DEPLOYMENT" -ForegroundColor Cyan
Write-Host "   Company: Experimind Labs • Innovation for Education" -ForegroundColor Cyan
Write-Host "   Standard: Microsoft Active Directory / Intune / SCCM Compatible" -ForegroundColor Cyan
Write-Host "============================================================================" -ForegroundColor Cyan

# 1. Local Deployment Function
function Deploy-LocalMachine {
  param([string]$Source, [string]$Dest)
  Write-Host "[DEPLOY] Deploying locally to $Dest..." -ForegroundColor Cyan
  if (-not (Test-Path $Dest)) {
    New-Item -ItemType Directory -Path $Dest -Force | Out-Null
  }
  Copy-Item -Path (Join-Path $Source "*") -Destination $Dest -Recurse -Force
  
  # Create Public Desktop Shortcut for all student profiles
  $ws = New-Object -ComObject WScript.Shell
  $publicDesktop = [Environment]::GetFolderPath('CommonDesktopDirectory')
  if (-not $publicDesktop -or -not (Test-Path $publicDesktop)) {
    $publicDesktop = [Environment]::GetFolderPath('Desktop')
  }
  $scPath = Join-Path $publicDesktop "Experimind AI Learning Lab.lnk"
  $s = $ws.CreateShortcut($scPath)
  $s.TargetPath = Join-Path $Dest "Launch_Experimind_Lab.bat"
  $s.WorkingDirectory = $Dest
  $s.IconLocation = (Join-Path $Dest "favicon.ico") + ",0"
  $s.Description = "Experimind AI Learning Lab (LKG to Class 8)"
  $s.Save()
  Write-Host "[SUCCESS] Deployed locally with All-Users Desktop Shortcut!" -ForegroundColor Green
}

# 2. Remote Deployment Function via WinRM / SMB
function Deploy-RemoteMachine {
  param([string]$Computer, [string]$Source, [string]$Dest)
  Write-Host "[REMOTE] Pushing deployment to $Computer..." -ForegroundColor Cyan
  $adminShare = "\\$Computer\C$\Experimind_AI_Learning_Lab"
  try {
    if (-not (Test-Path $adminShare)) {
      New-Item -ItemType Directory -Path $adminShare -Force | Out-Null
    }
    Copy-Item -Path (Join-Path $Source "*") -Destination $adminShare -Recurse -Force
    Write-Host "[SUCCESS] Copied to $Computer" -ForegroundColor Green
  } catch {
    Write-Host "[ERROR] Could not copy to $Computer : $_" -ForegroundColor Red
  }
}

$currentDir = Split-Path -Parent $MyInvocation.MyCommand.Path

if ($ComputerNames.Count -eq 0) {
  Write-Host "`nRunning Local Standalone Lab Installation..." -ForegroundColor Yellow
  Deploy-LocalMachine -Source $currentDir -Dest $LocalDestinationPath
} else {
  Write-Host "`nRunning Multi-Computer Network Push across $($ComputerNames.Count) computers..." -ForegroundColor Yellow
  foreach ($pc in $ComputerNames) {
    Deploy-RemoteMachine -Computer $pc -Source $currentDir -Dest $LocalDestinationPath
  }
}

Write-Host "`n============================================================================" -ForegroundColor Cyan
Write-Host "   DEPLOYMENT EXECUTION FINISHED!" -ForegroundColor Green
Write-Host "============================================================================" -ForegroundColor Cyan

