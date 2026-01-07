const { Header } = require('./Header');

class InventoryPage {
  constructor(page) {
    this.page = page;
    this.header = new Header(page);
    this.inventoryContainer = page.getByTestId('inventory-container');
    this.addToCartButtons = page.locator('[data-test^="add-to-cart"]');
  }

  async addFirstItem() {
    await this.addToCartButtons.first().click();
  }

  async addItemByIndex(index) {
    const button = this.addToCartButtons.nth(index);
    await button.waitFor({ state: 'visible' });
    await button.click();
  }
}

module.exports = { InventoryPage };