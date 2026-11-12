---
name: lab-release-packager
description: Build, checksum, gate-check, and package production-ready release archives for school computer lab USB deployment.
---

# Experimind AI Learning Lab — Release Packager Skill

Use this skill whenever building a new version of Experimind AI Learning Lab to distribute to schools or upload to GitHub releases.

## Workflow Instructions

1. **Verify Version State:**
   - Inspect `version.json` and ensure the version string (e.g., `5.0.0`), build identifier, and release notes are up to date.
   - Synchronize `src/config/brand.js` version string with `version.json`.

2. **Generate Cryptographic Checksums:**
   - Run `Generate_Checksums.ps1` in PowerShell:
     ```powershell
     powershell -ExecutionPolicy Bypass -File .\Generate_Checksums.ps1
     ```
   - Verify that all 19 delivery files are accounted for in `CHECKSUMS.sha256`.

3. **Execute Pre-Deployment Gate Audit:**
   - Run `Verify_Lab_Readiness.ps1` to verify all 19 deployment and cryptographic integrity gates:
     ```powershell
     powershell -ExecutionPolicy Bypass -File .\Verify_Lab_Readiness.ps1
     ```
   - All gates must report `[PASS]` and `[INTEGRITY OK]`. Never package a release if any gate reports `[FAIL]`.

4. **Package Production Release Bundle:**
   - Run `Build_Release_Package.ps1` with the target version:
     ```powershell
     powershell -ExecutionPolicy Bypass -File .\Build_Release_Package.ps1 -NewVersion "5.0.0"
     ```
   - Verify that the resulting zip archive in `../RELEASE_BUILDS/` is healthy and contains only verified distribution assets (excluding `.git`, temporary scratch files, and backups).

5. **Publish to Remote Update Channel:**
   - When publishing to school labs, pass `-PushGit`:
     ```powershell
     powershell -ExecutionPolicy Bypass -File .\Build_Release_Package.ps1 -NewVersion "5.0.0" -PushGit
     ```
   - This automatically commits the changes and pushes to `origin main`, making the update instantly discoverable by `Update_Experimind_Lab.bat` on all connected lab machines.

