# Security Policy

## Supported Versions

The following table lists the release branches and their security update status:

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| < 2.0   | :x:                |

---

## Reporting a Vulnerability

We take the security of this project and user data privacy very seriously, particularly concerning medical imaging scans and personal health tokens.

If you discover a security vulnerability or sensitive data leakage risk:
1. **Do NOT open a public GitHub issue.**
2. Send an email directly to **Tejas Musale** at `tejasmusale830@gmail.com` with the subject line `[SECURITY VULNERABILITY] TB Care AI`.
3. Include:
   - A detailed description of the vulnerability.
   - Steps or proof-of-concept script to reproduce.
   - Potential impact on the system or patient privacy.
4. We will acknowledge receipt of your report within 48 hours and work on a prompt resolution and patch.

---

## Patient Privacy & Data Handling Guidelines

- **No Permanent Image Storing**: The backend provides temporary file caching for immediate analysis and includes an automatic `/cleanup_files` endpoint.
- **Environment Variables**: Never commit sensitive API keys or credentials directly to version control. Always use `.env` files.
