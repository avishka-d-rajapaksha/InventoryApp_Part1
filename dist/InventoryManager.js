"use strict";
/*
 * Student ID: 25108934
 * Student Name: Tharushi Sandeepa Bogahapitiye Serasingha Gamage
 * Unit: PROG2005 Programming Mobile Systems
 * Assignment: Assessment 2 - Part 1
 * File Description: Contains the InventoryManager class handling all inventory operations with empty initialization
 */
class InventoryManager {
    items = [];
    constructor() {
    }
    addItem(item) {
        if (this.isItemIdExists(item.itemId)) {
            return false;
        }
        const newItem = new ItemClass(item.itemId, item.itemName, item.category, item.quantity, item.price, item.supplierName, item.stockStatus, item.popularItem, item.comment);
        if (!newItem.isValid()) {
            return false;
        }
        this.items.push(item);
        return true;
    }
    isItemIdExists(itemId) {
        return this.items.some((item) => item.itemId === itemId);
    }
    getAllItems() {
        return this.items;
    }
    searchByName(itemName) {
        const found = this.items.find((item) => item.itemName.toLowerCase() === itemName.toLowerCase());
        return found;
    }
    searchById(itemId) {
        const found = this.items.find((item) => item.itemId === itemId);
        return found;
    }
    getPopularItems() {
        return this.items.filter((item) => item.popularItem === true);
    }
    updateItemByName(itemName, updatedItem) {
        const index = this.items.findIndex((item) => item.itemName.toLowerCase() === itemName.toLowerCase());
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
    updateItemById(itemId, updatedItem) {
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
    deleteItemByName(itemName) {
        const index = this.items.findIndex((item) => item.itemName.toLowerCase() === itemName.toLowerCase());
        if (index === -1) {
            return false;
        }
        this.items.splice(index, 1);
        return true;
    }
    deleteItemById(itemId) {
        const index = this.items.findIndex((item) => item.itemId === itemId);
        if (index === -1) {
            return false;
        }
        this.items.splice(index, 1);
        return true;
    }
    getTotalItems() {
        return this.items.length;
    }
    editItem(itemId, field, value) {
        const item = this.items.find((item) => item.itemId === itemId);
        if (!item) {
            return false;
        }
        if (field === "itemName") {
            item.itemName = value;
        }
        else if (field === "category") {
            item.category = value;
        }
        else if (field === "quantity") {
            item.quantity = value;
        }
        else if (field === "price") {
            item.price = value;
        }
        else if (field === "supplierName") {
            item.supplierName = value;
        }
        else if (field === "stockStatus") {
            item.stockStatus = value;
        }
        else if (field === "popularItem") {
            item.popularItem = value;
        }
        else if (field === "comment") {
            item.comment = value;
        }
        else {
            return false;
        }
        return true;
    }
}
