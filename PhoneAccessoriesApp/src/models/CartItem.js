export class CartItem {
    constructor({ accessory, quantity = 1 }) {
      this.accessory = accessory;
      this.quantity = quantity;
    }
  }