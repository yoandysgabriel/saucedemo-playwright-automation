const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const users = require('../data/users');

test.describe('Functional / Edge Cases', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await page.goto('/');
  });

  test('login should show validation error with invalid credentials', async () => {
    await loginPage.login('invalid_user', 'wrong_password');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).not.toBeEmpty();
  });

  test('should add multiple items and remove at least one from cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.login(users.standardUser.username, users.standardUser.password);
    
    // Adding multiple items
    const addButtons = page.locator('[data-test^="add-to-cart"]');
    await addButtons.nth(0).click();
    await addButtons.nth(1).click();
    await expect(inventoryPage.header.cartBadge).toHaveText('2');

    // Removing one item and verifying integrity
    await inventoryPage.header.cartLink.click();
    const removeButtons = page.locator('[data-test^="remove-"]');
    await removeButtons.first().click();

    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(inventoryPage.header.cartBadge).toHaveText('1');
  });
});