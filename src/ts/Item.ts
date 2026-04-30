/*
 * Student ID: 25108934
 * Student Name: Tharushi Sandeepa Bogahapitiye Serasingha Gamage
 * Unit: PROG2005 Programming Mobile Systems
 * Assignment: Assessment 2 - Part 1
 * File Description: Defines the Item interface and ItemClass for data validation
 */

interface Item {
  itemId: number;
  itemName: string;
  category: string;
  quantity: number;
  price: number;
  supplierName: string;
  stockStatus: string;
  popularItem: boolean;
  comment?: string;
}

class ItemClass {
  itemId: number;
  itemName: string;
  category: string;
  quantity: number;
  price: number;
  supplierName: string;
  stockStatus: string;
  popularItem: boolean;
  comment?: string;

  constructor(
    itemId: number,
    itemName: string,
    category: string,
    quantity: number,
    price: number,
    supplierName: string,
    stockStatus: string,
    popularItem: boolean,
    comment?: string
  ) {
    this.itemId = itemId;
    this.itemName = itemName;
    this.category = category;
    this.quantity = quantity;
    this.price = price;
    this.supplierName = supplierName;
    this.stockStatus = stockStatus;
    this.popularItem = popularItem;
    this.comment = comment;
  }

  isValid(): boolean {
    if (!this.itemId || !this.itemName || !this.category) {
      return false;
    }
    if (this.quantity < 0 || this.price < 0) {
      return false;
    }
    if (!this.supplierName || !this.stockStatus) {
      return false;
    }
    return true;
  }
}
