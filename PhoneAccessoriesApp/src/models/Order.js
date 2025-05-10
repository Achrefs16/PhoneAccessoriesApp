export class Order {
    constructor({ id, items, status, date, total, address }) {
      this.id = id;
      this.items = items;
      this.status = status;
      this.date = new Date(date);
      this.total = total;
      this.address = address;
    }
  }