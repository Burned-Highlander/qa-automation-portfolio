# 🧪 QA Automation Portfolio

![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![GitHub Actions](https://img.shields.io/github/actions/workflow/status/Burned-Highlander/qa-automation-portfolio/playwright.yml?branch=main&style=for-the-badge&logo=githubactions)

A multi-application test automation suite demonstrating expertise across **UI, API, Accessibility, and Performance testing**. This repository contains structured Playwright test suites for two distinct applications, utilizing a unified configuration and GitHub Actions for CI/CD.

---

## 🎯 Applications Under Test

### 1. **Potion Shop** (UI & Accessibility)
- **Application:** [The Enchanted Brew Shop](https://qe-at-cgi-fi.github.io/potion-shop/)
- **Testing Focus:** End-to-end UI automation, cross-browser compatibility, and WCAG accessibility compliance.
- **Key Features:** Page Object Model (POM), dynamic modal accessibility scanning, and graceful handling of known legacy technical debt.

### 2. **Restful Booker Platform** (API & Performance)
- **Application:** [Restful Booker API](https://automationintesting.online/)
- **Testing Focus:** REST API validation, security, and performance benchmarking.
- **Key Features:** 3-layer architecture (Base Helper, Request/Response Specs, Clean Tests), API chaining, and statistically sound p95 latency budgets.

---

## ✨ Key Technical Achievements

*   **AI-Assisted Debugging:** Utilized AI tools to reverse-engineer API contracts from backend source code and debug complex `500 Internal Server Error` responses, pivoting test strategies to target reliable endpoints.
*   **Real-World Bug Discovery:** Identified and documented a functional flaw where the `/api/room` endpoint ignored date-range parameters and returned identical payloads, proving a focus on finding real product issues, not just writing passing tests.
*   **Statistical Performance Testing:** Implemented **p95 latency budgets** with warm-up requests and raw sample logging, moving beyond unreliable "average" metrics to measure true user experience.
*   **Dynamic Accessibility (a11y) Testing:** Went beyond static page scans by using the Page Object Model to trigger dynamic UI states (e.g., confirmation modals) and running Axe-core scans specifically against those interactive states to catch regression-prone issues.
*   **Unified CI/CD Pipeline:** Configured a GitHub Actions workflow to automatically execute test suites on every push and pull request, utilizing `npm ci` and optimized browser installations for fast, reliable pipeline runs.

---

## 🏗️ Project Structure

This repository is structured as a monorepo with shared dependencies but isolated test suites for clear separation of concerns:

```text
qa-automation-portfolio/
├── .github/workflows/
│   └── playwright.yml          # CI/CD pipeline configuration
├── potion-shop-ui-tests/       # UI & Accessibility tests
│   ├── pages/                  # Page Object Models
│   └── tests/                  # Spec files
├── restful-booker-api-tests/   # API & Performance tests
│   ├── helpers/                # Base API client
│   ├── specs/                  # Request/Response contracts
│   └── tests/                  # Spec files
├── package.json
├── playwright.config.js        # Unified test configuration
└── README.md
``` 
---

## 🛠️ Tech Stack

*   **Framework:** Playwright (JavaScript)
*   **Architecture:** Page Object Model (UI) & 3-Layer API Pattern
*   **Tools:** Axe-core (Accessibility), GitHub Actions (CI/CD), Git

---

##  How to Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/[Your GitHub Username]/qa-automation-portfolio.git
   cd qa-automation-portfolio
    ```
2. **Install dependencies:**
   ```bash
   npm install
   npx playwright install
   ```

3. **Run All Tests (Cross-Browser UI + API):**
   ```bash
   npx playwright test
   ```

4. **Run Specific Suites:**
   ```bash
   # Run only API tests
   npx playwright test --project=restful-booker-api

   # Run only UI tests on Chromium
   npx playwright test --project=potion-shop-ui-chromium
   ```
## 📝 Notes for Reviewers

*   **Accessibility:** The `accessibility.spec.js` file intentionally filters out a specific list of `knownViolationIds`. This is a deliberate design choice to prevent CI failures from pre-existing technical debt in the third-party demo application, while still strictly catching any *new* accessibility regressions.
*   **Performance:** The `api-performance.spec.js` uses a provisional p95 budget derived from baseline measurements. In a production environment, this value would be formally agreed upon via an SLO/SLA with the development team.