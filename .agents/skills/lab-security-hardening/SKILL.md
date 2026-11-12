---
name: lab-security-hardening
description: Audit and enforce offline security, Content Security Policy (CSP), SHA-256 cryptographic integrity, and zero-PII compliance for Experimind AI Learning Lab.
---

# Experimind AI Learning Lab — Security & Robustness Hardening Skill

Use this skill to audit, harden, and verify the security posture of the application before shipping or after applying updates.

## Core Security Pillars

### 1. Content Security Policy (CSP) Audit
- Ensure `index.html` defines the strict CSP meta header:
  ```html
  <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' data: blob:; media-src 'self' blob: mediastream:; frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com; connect-src 'self' https://raw.githubusercontent.com data: blob:; img-src 'self' data: blob:;">
  ```
- **Allowed connections:** Strictly limited to local files and the official GitHub version manifest for update checking.
- **Allowed frames:** Strictly limited to local offline video engine and privacy-enhanced YouTube (`youtube-nocookie.com`).
- **Disallowed:** All external socket connections, unverified third-party ad networks, and untrusted scripts.

### 2. Cryptographic Checksum Integrity
- `CHECKSUMS.sha256` must reflect exact SHA-256 digests for all 19 distribution files.
- Run `powershell -ExecutionPolicy Bypass -File .\Generate_Checksums.ps1` whenever any file is updated.
- Verify integrity with `powershell -ExecutionPolicy Bypass -File .\Verify_Lab_Readiness.ps1`.

### 3. Student Privacy & Volatile Memory Verification
- Confirm that no cookies, `localStorage`, or `indexedDB` retain student names, photos, or personal data.
- Camera frames must stay in transient GPU/RAM buffers via off-screen HTML5 Canvas.
- Progress stars must reside solely in volatile in-memory JavaScript objects that cleanly clear on window close.

### 4. Non-Admin Windows Lab Execution
- Ensure `Launch_Experimind_Lab.bat` and `Update_Experimind_Lab.bat` require no elevated Administrator privileges.
- Compatible with Windows 10/11 standard student accounts with constrained user folder write permissions.

