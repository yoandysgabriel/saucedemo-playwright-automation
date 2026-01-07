# SauceDemo Automation Automation

Automated test suite for SauceLabs' Demo Website using **Playwright** and **JavaScript**. This project implements the **Page Object Model (POM)** with component composition to ensure maintainability and scalability.

## 🚀 Getting Started

1. **Install dependencies:**

   ```bash
   npm install

   ```

2. **Install Playwright browsers:**

   ```bash
    npx playwright install chromium

   ```

3. **Run all tests:**

   ## Headless mode

   ```bash
   npm test
   ```

   ## UI mode for debugging

   ```bash
   npx playwright test --ui
   ```

# 🏗️ Project Architecture

    pages/: Page Objects and Shared Components (e.g., Header).

    tests/: Organized test suites (Smoke, Functional, User Variants).

    data/: Centralized test data and user credentials.

# 🛠️ Tech Stack

    Framework: Playwright (Web-first assertions and auto-waiting).

    Language: JavaScript (CommonJS).

    Selector Strategy: Priority on data-test attributes for high reliability.
