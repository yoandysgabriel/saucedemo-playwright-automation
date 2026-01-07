class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');

    this.finishButton = page.getByTestId('finish');
    this.completeHeader = page.getByTestId('complete-header');
  }

  async fillInformation(fName, lName, zip) {
    await this.firstNameInput.fill(fName);
    await this.lastNameInput.fill(lName);
    await this.postalCodeInput.fill(zip);
    await this.continueButton.click();
  }

  async finishOrder() {
    await this.finishButton.click();
  }
}
module.exports = { CheckoutPage };