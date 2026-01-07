const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const users = require('../data/users');

test.describe('Smoke Flows', () => {
  let loginPage;
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await page.goto('/');
  });

  test('Successful login with standard_user', async ({ page }) => {
    await loginPage.login(users.standardUser.username, users.standardUser.password);
    await expect(page).toHaveURL(/inventory.html/);
    await expect(inventoryPage.inventoryContainer).toBeVisible();
  });

  test('Successful logout', async ({ page }) => {
    await loginPage.login(users.standardUser.username, users.standardUser.password);
    await inventoryPage.header.logout();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('Complete checkout flow', async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.login(users.standardUser.username, users.standardUser.password);
    
    // Acciones del flujo
    await inventoryPage.addFirstItem();
    await inventoryPage.header.cartLink.click();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillInformation('Test', 'User', '12345');
    await checkoutPage.finishOrder();

    // Verificación final
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });
});