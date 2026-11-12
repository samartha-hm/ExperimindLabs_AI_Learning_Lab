---
name: lab-remote-updater
description: Manage remote software updates, delta synchronization, dual-mode online/offline deployment, and automated rollback verification for Experimind AI Learning Lab.
---

# Experimind AI Learning Lab — Remote Updater & Deployment Skill

Use this skill to diagnose, orchestrate, and test remote and offline updates across school computer lab deployments.

## Dual-Mode Update Architecture

Experimind AI Learning Lab employs a dual-channel update model designed specifically for school lab realities:

```
┌────────────────────────────────────────────────────────┐
│           EXPERIMIND DEVELOPMENT WORKSPACE             │
│        Build_Release_Package.ps1 -> Push to Git        │
└──────────────────────────┬─────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
     [Online Lab Channel]        [Offline USB Channel]
  Update_Experimind_Lab.bat       Experimind_Update.zip
  (Fetches from GitHub Main)      (Carried on USB Drive)
             │                           │
             └─────────────┬─────────────┘
                           ▼
             ┌───────────────────────────┐
             │   1. Safety Rollback Dir  │
             │   2. Atomic File Replace  │
             │   3. 19-Gate Audit Run    │
             │   4. Rollback on Any Fail │
             └───────────────────────────┘
```

## Procedures

### 1. Pushing Updates from Here (Developer Workspace)
1. Make necessary code, curriculum, simulator, or style enhancements.
2. Run `powershell -ExecutionPolicy Bypass -File .\Build_Release_Package.ps1 -NewVersion "5.X.Y" -PushGit`.
3. Confirm that GitHub `origin/main` receives the commit and updated `version.json`.

### 2. Testing Online Lab Machine Updates
1. On a school PC with internet access, run `Update_Experimind_Lab.bat`.
2. The script contacts `https://raw.githubusercontent.com/samartha-hm/ExperimindLabs_AI_Learning_Lab/main/version.json`.
3. If a newer build exists, it takes an atomic snapshot in `.backup_pre_update_<timestamp>`.
4. It synchronizes updated assets, validates all gates via `Verify_Lab_Readiness.ps1`, and reports success.
5. If any test fails, it immediately restores from the rollback snapshot.

### 3. Deploying Offline USB Updates to Disconnected Labs
1. Download the latest release zip from GitHub on an internet PC and save it as `Experimind_Update.zip` on a USB drive.
2. Insert the USB into the disconnected student computer.
3. Double-click `Update_Experimind_Lab.bat`.
4. The updater automatically scans removable drives, discovers `Experimind_Update.zip`, backs up local files, applies the update, verifies integrity, and completes with zero internet required.

