# Contributing to TB Care AI 🩺

Thank you for your interest in contributing to **TB Care AI**! We welcome contributions from developers, researchers, healthcare professionals, and designers who want to make Tuberculosis screening more accessible and accurate.

---

## 📋 Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [How to Contribute](#how-to-contribute)
   - [Reporting Bugs](#reporting-bugs)
   - [Suggesting Enhancements](#suggesting-enhancements)
   - [Submitting Pull Requests](#submitting-pull-requests)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Community & Contact](#community--contact)

---

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please treat all contributors with respect and professionalism.

---

## 💡 How to Contribute

### 🐛 Reporting Bugs
If you find a bug or unexpected behavior:
1. Check the [GitHub Issues](https://github.com/MusaleTejas/Ai-powered-tb-detection/issues) to ensure the issue has not already been reported.
2. Open a new issue with a clear title and description:
   - Steps to reproduce the bug.
   - Expected behavior vs. actual behavior.
   - Screenshots, console logs, or error stack traces.
   - Environment details (OS, Python version, Node.js version, Browser).

### ✨ Suggesting Enhancements
Have ideas for new features (e.g., DICOM metadata parsing, new hospital datasets, mobile responsiveness)?
1. Open an issue tagged as `enhancement`.
2. Clearly explain the motivation and proposed solution.

---

## 🚀 Submitting Pull Requests (PRs)

1. **Fork the Repository**: Click the **Fork** button on GitHub.
2. **Clone your fork locally**:
   ```bash
   git clone https://github.com/<your-username>/Ai-powered-tb-detection.git
   cd Ai-powered-tb-detection
   ```
3. **Create a descriptive feature branch**:
   ```bash
   git checkout -b feature/improve-gradcam-visualization
   ```
4. **Make your changes**: Ensure code builds and tests pass.
   ```bash
   # In frontend:
   npm run build

   # In backend:
   python test_mt.py
   ```
5. **Commit your changes**:
   ```bash
   git commit -m "feat: add enhanced color palette for Grad-CAM overlay"
   ```
6. **Push to your fork**:
   ```bash
   git push origin feature/improve-gradcam-visualization
   ```
7. **Open a Pull Request**: Submit your PR targeting the `main` branch of the upstream repository.

---

## 📐 Coding Standards

- **Frontend (TypeScript & React)**:
  - Use functional components with React hooks.
  - Follow ESLint rules and maintain type safety.
  - Style with Tailwind CSS utility classes.
- **Backend (Python & Flask)**:
  - Follow PEP 8 guidelines.
  - Keep model inference decoupled from web routes.
- **Commit Messages**:
  - `feat:` for new features.
  - `fix:` for bug fixes.
  - `docs:` for documentation changes.
  - `refactor:` for code restructuring.

---

## 📬 Contact & Support

For questions or project collaboration:
- **Lead Developer**: Tejas Musale
- **Email**: [tejasmusale830@gmail.com](mailto:tejasmusale830@gmail.com)
- **LinkedIn**: [in/tejas-musale](https://www.linkedin.com/in/tejas-musale)
