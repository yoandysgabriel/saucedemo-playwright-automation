const { Header } = require('./Header');

class InventoryPage {
  constructor(page) {
    this.page = page;
    this.header = new Header(page); // Composición
    this.inventoryContainer = page.getByTestId('inventory-container');
    this.addToCartButtons = page.locator('[data-test^="add-to-cart"]');
  }

  async addFirstItem() {
    await this.addToCartButtons.first().click();
  }
}
module.exports = { InventoryPage };