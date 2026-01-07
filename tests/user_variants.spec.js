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

  test('locked_out_user_cannot_login should show proper error', async () => {
    await loginPage.login(users.lockedOutUser.username, users.lockedOutUser.password);
    // Requirement: Visible error and include text assertion
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(/locked/i);
  });

  test('performance_glitch_user should eventually load inventory', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await loginPage.login(users.performanceGlitchUser.username, users.performanceGlitchUser.password);
    
    // Requirement: Use a reasonable extended timeout (up to 30s) instead of fixed sleeps
    await expect(inventoryPage.inventoryContainer).toBeVisible({ timeout: 30000 });
  });

  test('problem_user should maintain cart integrity with multiple items', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.login(users.problemUser.username, users.problemUser.password);
    
    // Adding 2 different items
    const addButtons = page.locator('[data-test^="add-to-cart"]');
    await addButtons.nth(0).click();
    await addButtons.nth(1).click();

    await inventoryPage.header.cartLink.click();
    // Requirement: Assert cart contains 2 items for this variant
    await expect(cartPage.cartItems).toHaveCount(2);
  });
});