/*
 * Student ID: 25108934
 * Student Name: Tharushi Sandeepa Bogahapitiye Serasingha Gamage
 * Unit: PROG2005 Programming Mobile Systems
 * Assignment: Assessment 2 - Part 1
 * File Description: Contains the InventoryManager class handling all inventory operations with empty initialization
 */

class InventoryManager {
  private items: Item[] = [];

  constructor() {
  }

  addItem(item: Item): boolean {
    if (this.isItemIdExists(item.itemId)) {
      return false;
    }

    const newItem = new ItemClass(
      item.itemId,
      item.itemName,
      item.category,
      item.quantity,
      item.price,
      item.supplierName,
      item.stockStatus,
      item.popularItem,
      item.comment
    );

    if (!newItem.isValid()) {
      return false;
    }

    this.items.push(item);
    return true;
  }

  private isItemIdExists(itemId: number): boolean {
    return this.items.some((item) => item.itemId === itemId);
  }

  getAllItems(): Item[] {
    return this.items;
  }

  searchByName(itemName: string): Item | undefined {
    const found = this.items.find(
      (item) => item.itemName.toLowerCase() === itemName.toLowerCase()
    );
    return found;
  }

  searchById(itemId: number): Item | undefined {
    const found = this.items.find((item) => item.itemId === itemId);
    return found;
  }

  getPopularItems(): Item[] {
    return this.items.filter((item) => item.popularItem === true);
  }

  updateItemByName(itemName: string, updatedItem: Item): boolean {
    const index = this.items.findIndex(
      (item) => item.itemName.toLowerCase() === itemName.toLowerCase()
    );

    if (index === -1) {
      return false;
    }

    if (updatedItem.itemId !== this.items[index].itemId) {
      if (this.isItemIdExists(updatedItem.itemId)) {
        return false;
      }
    }

    this.items[index] = updatedItem;
    return true;
  }

  updateItemById(itemId: number, updatedItem: Item): boolean {
    const index = this.items.findIndex((item) => item.itemId === itemId);

    if (index === -1) {
      return false;
    }

    if (updatedItem.itemId !== this.items[index].itemId) {
      if (this.isItemIdExists(updatedItem.itemId)) {
        return false;
      }
    }

    this.items[index] = updatedItem;
    return true;
  }

  deleteItemByName(itemName: string): boolean {
    const index = this.items.findIndex(
      (item) => item.itemName.toLowerCase() === itemName.toLowerCase()
    );

    if (index === -1) {
      return false;
    }

    this.items.splice(index, 1);
    return true;
  }

  deleteItemById(itemId: number): boolean {
    const index = this.items.findIndex((item) => item.itemId === itemId);

    if (index === -1) {
      return false;
    }

    this.items.splice(index, 1);
    return true;
  }

  getTotalItems(): number {
    return this.items.length;
  }

  editItem(
    itemId: number,
    field: string,
    value: string | number | boolean
  ): boolean {
    const item = this.items.find((item) => item.itemId === itemId);

    if (!item) {
      return false;
    }

    if (field === "itemName") {
      item.itemName = value as string;
    } else if (field === "category") {
      item.category = value as string;
    } else if (field === "quantity") {
      item.quantity = value as number;
    } else if (field === "price") {
      item.price = value as number;
    } else if (field === "supplierName") {
      item.supplierName = value as string;
    } else if (field === "stockStatus") {
      item.stockStatus = value as string;
    } else if (field === "popularItem") {
      item.popularItem = value as boolean;
    } else if (field === "comment") {
      item.comment = value as string;
    } else {
      return false;
    }

    return true;
  }
}
