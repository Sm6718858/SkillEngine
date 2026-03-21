# Security Policy

## Supported Versions

The following versions of Skill Engine are currently supported with security updates.

| Version | Supported |
| ------- | --------- |
| 1.x.x   | ✅ Yes |
| < 1.0   | ❌ No |

Older versions are no longer maintained. Please upgrade to the latest version to receive security patches and updates.

---

## Reporting a Vulnerability

If you discover a security vulnerability in **Skill Engine**, please report it responsibly.

### How to Report

- Email: sm6718858@gmail.com  
- Or create a **private security advisory** on GitHub.

Please include the following details:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if available)

---

## Response Policy

After a vulnerability is reported:

1. We will acknowledge the report within **48 hours**.
2. The issue will be investigated and validated.
3. If confirmed, a security patch will be released as soon as possible.
4. The reporter may be credited for responsible disclosure.

---

## Security Best Practices Used in Skill Engine

The project follows these security practices:

- **JWT Authentication** with expiration
- **Password hashing using bcrypt**
- **Input validation and sanitization**
- **Role-based access control (RBAC)**
- **Environment variables for sensitive keys**
- **Protected API routes using middleware**
- **HTTPS recommended for deployment**

---

## Disclaimer

Please do not publicly disclose vulnerabilities until they have been addressed to avoid security risks for users.
