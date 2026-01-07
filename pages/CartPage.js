const { Header } = require('./Header');

class CartPage {
  constructor(page) {
    this.page = page;
    this.header = new Header(page);
    this.cartItems = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}
module.exports = { CartPage };