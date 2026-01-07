const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const users = require('../data/users');

test.describe('Functional and Edge Case Suite', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await page.goto('/');
  });

  /**
   * TEST CASE: Validation error on login
   * Requirement: Validation error with missing or invalid input.
   */
  test('should show validation error for invalid credentials', async () => {
    await loginPage.login('invalid_user', 'wrong_password');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });

  /**
   * TEST CASE: Cart management
   * Requirement: Add multiple items and remove at least one.
   */
  test('should add multiple items and remove one from cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.login(users.standardUser.username, users.standardUser.password);
    
    // Add two items
    const addButtons = page.locator('[data-test^="add-to-cart"]');
    await addButtons.nth(0).click();
    await addButtons.nth(1).click();
    await expect(inventoryPage.header.cartBadge).toHaveText('2');

    // Go to cart and remove one
    await inventoryPage.header.cartLink.click();
    const removeButtons = page.locator('[data-test^="remove-"]');
    await removeButtons.first().click();

    // Assert cart integrity
    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(inventoryPage.header.cartBadge).toHaveText('1');
  });
});