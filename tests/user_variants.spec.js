const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const users = require('../data/users');

test.describe('NEW — User-variant tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await page.goto('/');
  });

  /**
   * TEST: Locked-out user shows proper error
   * Requirement: Assert login fails and error references "locked".
   */
  test('locked_out_user shows proper error', async () => {
    await loginPage.login(users.lockedOutUser.username, users.lockedOutUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
    // Validating that the error text is non-empty and contains "locked"
    await expect(loginPage.errorMessage).toContainText(/locked/i);
  });

  /**
   * TEST: Performance-glitch user checks
   * Requirement: Ensure main inventory page eventually loads with a longer timeout.
   */
  test('performance_glitch_user should eventually load inventory', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await loginPage.login(users.performanceGlitchUser.username, users.performanceGlitchUser.password);
    
    // Applying extended timeout to handle intentional performance degradation
    await expect(inventoryPage.inventoryContainer).toBeVisible({ timeout: 15000 });
  });

  /**
   * TEST: Problem user checks
   * Requirement: Add 2 items and assert the cart contains 2 items (integrity check).
   */
  test('problem_user cart integrity check', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.login(users.problemUser.username, users.problemUser.password);
    
    // Adding 2 different items to verify basic cart functionality for this variant
    const addButtons = page.locator('[data-test^="add-to-cart"]');
    await addButtons.nth(0).click();
    await addButtons.nth(1).click();

    await inventoryPage.header.cartLink.click();
    
    // Asserting the cart integrity for the problem_user profile
    await expect(cartPage.cartItems).toHaveCount(2);
  });
});