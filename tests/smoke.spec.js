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

  test('standard_user should login successfully', async ({ page }) => {
    await loginPage.login(users.standardUser.username, users.standardUser.password);
    await expect(page).toHaveURL(/inventory.html/);
    await expect(inventoryPage.inventoryContainer).toBeVisible();
  });

  test('standard_user should logout successfully', async ({ page }) => {
    await loginPage.login(users.standardUser.username, users.standardUser.password);
    await inventoryPage.header.logout();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('standard_user should complete checkout successfully', async ({ page }) => {
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.login(users.standardUser.username, users.standardUser.password);
    await inventoryPage.addFirstItem();
    await inventoryPage.header.cartLink.click();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillInformation('QA', 'Candidate', '12345');
    await checkoutPage.finishOrder();

    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });
});