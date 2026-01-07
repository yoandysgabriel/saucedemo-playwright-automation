# Test Plan - SauceDemo Automation

## 🎯 Objective

Validate critical business flows and ensure system resilience across different user profiles for the SauceDemo application.

## 🧪 Test Scope

1. **Smoke Flows**:
   - Authentication (Login/Logout) for `standard_user`.
   - Complete E2E purchase journey (Inventory -> Cart -> Checkout -> Finish).
2. **Functional / Edge Cases**:
   - Login validation with invalid/missing inputs.
   - Dynamic cart management (Adding multiple items and removing items).
3. **User-Variant Tests (New)**:
   - **Security**: Lockout error verification for `locked_out_user`.
   - **Performance**: Resilience check for `performance_glitch_user` using extended timeouts (30s).
   - **Integrity**: Cart state consistency for `problem_user`.

## ⚙️ Engineering Decisions

- **Selector Strategy**: Leveraged `page.getByTestId()` to interact with `data-test` attributes, ensuring tests are decoupled from CSS/HTML structure changes.
- **POM Composition**: Decoupled the `Header` into a standalone component injected into pages, reducing code duplication.
- **Stability**: Avoided fixed sleeps; implemented dynamic waiting for element visibility and state transitions.

## 📝 Assumptions & Limitations

- **Data**: Tests rely on the static credentials provided by SauceDemo.
- **Environment**: Execution is targeted at the production demo site.
- **Scope**: Focuses on desktop Chromium execution; cross-browser compatibility is configured but not the primary focus of this suite.

## ⚠️ Findings

- **Intended Failures**: The `problem_user` and `performance_glitch_user` tests are designed to handle/detect the intentional bugs present in those profiles (e.g., asset mismatch and login latency).
