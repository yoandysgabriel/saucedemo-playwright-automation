const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'https://www.saucedemo.com',
    testIdAttribute: 'data-test', // Crucial para SauceDemo
    screenshot: 'only-on-failure',
  },
});