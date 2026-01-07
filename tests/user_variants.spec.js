const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const users = require('../data/users');

test.describe('User Variant Regression Suite', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await page.goto('/');
  });

  /**
   * TEST CASE: Verify security lockout message
   * Expectation: UI should prevent access and display a specific error for locked users.
   */
  test('locked_out_user should see error message', async () => {
    await loginPage.login(users.lockedOutUser.username, users.lockedOutUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out');
  });

  /**
   * TEST CASE: Performance Regression
   * Expectation: Application must be resilient to backend delays. 
   * Note: Using an extended timeout to handle the specific glitch associated with this profile.
   */
  test('performance_glitch_user should load inventory with delay', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await loginPage.login(users.performanceGlitchUser.username, users.performanceGlitchUser.password);
    
    // Validating system availability under degraded performance conditions
    await expect(inventoryPage.inventoryContainer).toBeVisible({ timeout: 10000 });
  });

  /**
   * TEST CASE: Visual/Functional integrity
   * Expectation: Ensure product assets are correctly mapped.
   * Note: This user profile often triggers broken image sources in this SUT.
   */
  test('problem_user should see consistent product images', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await loginPage.login(users.problemUser.username, users.problemUser.password);
    
    const firstProductImg = page.locator('.inventory_item_img img').first();
    await expect(firstProductImg).toHaveAttribute('src', '/static/media/sauce-backpack-1200x1500.0a0b8539.jpg');
  });
});