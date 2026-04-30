"use strict";
/*
 * Student ID: 25108934
 * Student Name: Tharushi Sandeepa Bogahapitiye Serasingha Gamage
 * Unit: PROG2005 Programming Mobile Systems
 * Assignment: Assessment 2 - Part 1
 * File Description: Defines the Item interface and ItemClass for data validation
 */
class ItemClass {
    itemId;
    itemName;
    category;
    quantity;
    price;
    supplierName;
    stockStatus;
    popularItem;
    comment;
    constructor(itemId, itemName, category, quantity, price, supplierName, stockStatus, popularItem, comment) {
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
    isValid() {
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
