---
description: Critical offline-first, child-safe, zero-admin security rules for Experimind AI Learning Lab
globs: "**/*"
---

# Experimind AI Learning Lab — Offline-First & School Lab Security Rules

These rules govern all architectural, code, and asset modifications within Experimind AI Learning Lab.

## 1. Absolute Offline-First Guarantee
- **Zero External CDNs:** Never include `<script>`, `<link>`, or font stylesheets referencing `cdnjs.cloudflare.com`, `cdn.jsdelivr.net`, `unpkg.com`, or external runtime hosts.
- **Local Fallbacks for Multimedia:** All video modules must provide a 100% offline procedural HTML5 canvas simulation alongside any optional YouTube embed.
- **No Internet Required:** The application must boot, run all 80 games, 8 vision labs, 12 video tutorials, and reference books entirely disconnected from the web.

## 2. Zero-PII Child Safety Standard (COPPA / GDPR-K / NEP 2020)
- **Zero Student Accounts:** Never prompt for student real names, email addresses, phone numbers, or passwords.
- **Volatile In-Memory Session:** Stars, progress, and quiz choices must be stored only in memory (`state`), resetting cleanly when the browser closes.
- **Camera Stream Isolation:** Camera frames must NEVER be stored, transmitted to remote endpoints, or saved to local disk. Webcam processing occurs strictly in local RAM via off-screen canvas buffers.

## 3. Windows Lab Portability & Non-Admin Execution
- **Zero Admin Rights:** Everything must run from standard student user accounts (`Launch_Experimind_Lab.bat`).
- **Chromeless Kiosk Mode:** Launch using `--app="%ENTRY_HTML%"` with Microsoft Edge or Google Chrome.
- **Atomic Updates with Rollback:** Any updater script must create a timestamped backup before touching files, verify all 19 readiness gates, and immediately rollback if any gate fails.

## 4. Cryptographic Integrity Validation
- All production files must match their SHA-256 hashes in `CHECKSUMS.sha256`.
- The Content Security Policy (CSP) in `index.html` must remain active and restrict script/media sources strictly to `'self'`, safe data URIs, and local blob streams.

