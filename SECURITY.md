# Security Policy

The RouteBuddy team takes the security and privacy of our users, drivers, and partners very seriously. We appreciate the responsible disclosure of security vulnerabilities and are committed to addressing reported issues promptly and transparently.

---

## Supported Versions

Security fixes and updates are actively maintained for the latest stable release and the main development branch. Older versions may not receive security updates once a newer minor or major version is published.

| Version | Supported          | Status                                 |
| :------ | :----------------: | :------------------------------------- |
| 1.0.x   | :white_check_mark: | Currently Supported (Active Release)   |
| < 1.0.0 | :x:                | Deprecated (Pre-release / Unsupported) |

We strongly recommend users and testers always stay updated with the latest build from authorized distribution channels (e.g., Google Play, Apple TestFlight / App Store, or tagged repository releases).

---

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities via public GitHub issues, discussions, or pull requests.**

If you discover or suspect a security vulnerability within the RouteBuddy Mobile application, please disclose it through one of the following private channels:

1. **GitHub Private Vulnerability Reporting (Preferred):**
   - Navigate to the [Security Advisories tab](https://github.com/jibanbudhathoki/routebuddy-mobile/security/advisories) of this repository.
   - Click **Report a vulnerability** to open an advisory draft.

2. **Email Security Contact:**
   - Email: `security@routebuddy.app` (or contact project maintainers directly via repository profile).
   - Please include `[SECURITY] Vulnerability Report: <Brief Description>` in the subject line.

### What to Include in Your Report

To help us investigate, triage, and remediate the issue effectively, please include as much detail as possible:

- **Type of issue**: (e.g., token leakage, improper session management, insecure data storage, injection, broken access control).
- **Affected version/commit**: App version, platform (iOS / Android), OS version, and environment.
- **Proof of Concept (PoC)**: Step-by-step reproduction instructions, scripts, or video demonstration.
- **Impact assessment**: The practical security or privacy impact and who is affected.
- **Suggested remediation**: (Optional) Recommended patches or mitigation strategies.

---

## Response Process & SLA

When you submit a vulnerability report in good faith, we commit to the following response timeline:

| Milestone               | Target Timeline         | Description                                                          |
| :---------------------- | :---------------------- | :------------------------------------------------------------------- |
| **Initial Response**    | Within 48 hours         | Acknowledge receipt of the report and begin initial triage.          |
| **Triage & Validation** | Within 5 business days  | Confirm vulnerability validity, assess severity (CVSS), and assign priority. |
| **Status Updates**      | Every 7 business days   | Keep the reporter informed on remediation progress.                  |
| **Fix & Release**       | 14–30 business days     | Deploy patch in an updated release, depending on complexity.         |
| **Public Disclosure**   | Coordinated             | Publish a security advisory after the fix is verified and deployed.  |

---

## Scope & Security Architecture

### In-Scope
- RouteBuddy Mobile client codebase (`src/` and native configurations).
- Client-side data storage and session management (tokens stored via `expo-secure-store`).
- Authentication and authorization client workflows (OAuth, refresh tokens, session revocation).
- Sensitive transaction flows (Stripe payment integration, wallet transactions, withdrawal validation).
- Input validation and schema integrity (Zod validation pipelines).

### Out-of-Scope
- Vulnerabilities requiring root/jailbreak or physical device compromise without privilege escalation.
- Denial of Service (DoS/DDoS) attacks against mobile APIs or third-party infrastructure.
- Social engineering, phishing, or physical attacks targeting RouteBuddy employees or users.
- Third-party SDK issues not controllable via client implementation (unless reproducible as a misconfiguration).

---

## Safe Harbor & Responsible Disclosure

We consider security research conducted under this policy to be authorized. We will not pursue legal action against researchers who:

- Make a good-faith effort to avoid privacy violations, data destruction, and service interruption.
- Give us reasonable time to investigate and resolve issues before publicly disclosing any details.
- Avoid accessing, modifying, or retaining user data belonging to other accounts without explicit consent.
- Comply with applicable local and international cybersecurity laws.

---

Thank you for helping keep RouteBuddy and our community safe!

---

&copy; 2026 RouteBuddy. All rights reserved.
