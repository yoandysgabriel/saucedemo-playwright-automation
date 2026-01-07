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

// 1. Login
    await loginPage.login(users.standardUser.username, users.standardUser.password);
    
    // 2. Add at least one item
    await inventoryPage.addFirstItem();
    
    // 3. Go to Cart
    await inventoryPage.header.cartLink.click();
    await expect(page).toHaveURL(/cart.html/);
    
    // 4. Proceed to Checkout (Página de información)
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one.html/);
    
    // 5. Fill Information & Continue (Página de Overview)
    await checkoutPage.fillInformation('Gemini', 'User', '12345');
    await expect(page).toHaveURL(/checkout-step-two.html/);
    
    // 6. Finish (Página de Complete)
    await checkoutPage.finishOrder();
    await expect(page).toHaveURL(/checkout-complete.html/);

    // 7. Final Assertion
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });
});