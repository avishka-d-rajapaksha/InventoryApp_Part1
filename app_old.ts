/*
 * Student ID: 25108934
 * Student Name: Tharushi Sandeepa Bogahapitiye Serasingha Gamage
 * Unit: PROG2005 Programming Mobile Systems
 * Assignment: Assessment 2 - Part 1
 * File Description: Main application logic handling UI interactions, event listeners, and server communication
 */

const inventoryManager = new InventoryManager();

document.addEventListener("DOMContentLoaded", () => {
  attachEventListeners();
  displayAllItems();
});

function attachEventListeners(): void {
  const addBtn = document.getElementById("addBtn");
  const deleteBtn = document.getElementById("deleteBtn");
  const searchBtn = document.getElementById("searchBtn");
  const displayAllBtn = document.getElementById("displayAllBtn");
  const displayPopularBtn = document.getElementById("displayPopularBtn");
  const updateBtn = document.getElementById("updateBtn");

  if (addBtn) {
    addBtn.addEventListener("click", handleAddItem);
  }
  if (deleteBtn) {
    deleteBtn.addEventListener("click", handleDeleteItem);
  }
  if (searchBtn) {
    searchBtn.addEventListener("click", handleSearchItem);
  }
  if (displayAllBtn) {
    displayAllBtn.addEventListener("click", displayAllItems);
  }
  if (displayPopularBtn) {
    displayPopularBtn.addEventListener("click", displayPopularItems);
  }
  if (updateBtn) {
    updateBtn.addEventListener("click", handleUpdateItem);
  }

  setupSuggestions("itemName", "itemNameSuggestions", "getName");
  setupSuggestions("itemId", "itemIdSuggestions", "getId");
  setupSuggestions("category", "categorySuggestions", "getCategory");
  setupSuggestions("supplierName", "supplierNameSuggestions", "getSupplier");
  setupSuggestions("stockStatus", "stockStatusSuggestions", "getStatus");
  setupSuggestions("deleteItemName", "deleteItemNameSuggestions", "getName");
  setupSuggestions("deleteItemId", "deleteItemIdSuggestions", "getId");
  setupSuggestions("searchItemName", "searchItemNameSuggestions", "getName");
  setupSuggestions("searchItemId", "searchItemIdSuggestions", "getId");
  setupSuggestions("updateItemName", "updateItemNameSuggestions", "getName");
  setupSuggestions("updateItemId", "updateItemIdSuggestions", "getId");

  setupLivePreview();

  document.addEventListener("click", (e: MouseEvent) => {
    const input = e.target as HTMLElement;
    if (!input.classList || !input.classList.contains("form-input")) {
      document.querySelectorAll(".suggestion-list").forEach((list) => {
        list.classList.remove("show");
      });
    }
  });
}

function handleAddItem(): void {
  const itemIdInput = (document.getElementById("itemId") as HTMLInputElement).value.trim();
  const itemName = (document.getElementById("itemName") as HTMLInputElement).value.trim();
  const category = (document.getElementById("category") as HTMLInputElement).value.trim();
  const quantityInput = (document.getElementById("quantity") as HTMLInputElement).value.trim();
  const priceInput = (document.getElementById("price") as HTMLInputElement).value.trim();
  const supplierName = (document.getElementById("supplierName") as HTMLInputElement).value.trim();
  const stockStatus = (document.getElementById("stockStatus") as HTMLInputElement).value.trim();
  const popularItem = (document.getElementById("popularItem") as HTMLInputElement).checked;
  const comment = (document.getElementById("comment") as HTMLInputElement).value.trim();

  if (!itemIdInput || !itemName || !category || !supplierName || !stockStatus) {
    showNotification("All required fields must be filled!", "error");
    return;
  }

  const itemId = parseInt(itemIdInput);
  
  const quantity = parseInt(quantityInput);
  const price = parseFloat(priceInput);

  if (isNaN(itemId) || isNaN(quantity) || isNaN(price)) {
    showNotification("Item ID, Quantity and Price must be valid numbers!", "error");
    return;
  }

  if (itemId <= 0 || quantity < 0 || price < 0) {
    showNotification("Item ID must be positive, Quantity and Price cannot be negative!", "error");
    return;
  }

  const newItem: Item = {
    itemId,
    itemName,
    category,
    quantity,
    price,
    supplierName,
    stockStatus,
    popularItem,
    comment: comment || undefined,
  };

  if (inventoryManager.addItem(newItem)) {
    sendItemToServer(newItem, "POST");

    showNotification(`✓ Item "${itemName}" added successfully!`, "success");
    clearAddForm();
    displayAllItems();
  } else {
    const existing = inventoryManager.searchByName(itemName);
    if (existing) {
      showNotification(`Item with name "${itemName}" already exists!`, "error");
    } else {
      showNotification("Item ID already exists or invalid data!", "error");
    }
  }
}

function handleDeleteItem(): void {
  const itemName = (document.getElementById("deleteItemName") as HTMLInputElement).value.trim();
  const itemIdInput = (document.getElementById("deleteItemId") as HTMLInputElement).value.trim();

  if (!itemName && !itemIdInput) {
    showNotification("Please enter an item name or ID to delete!", "error");
    return;
  }

  let itemToDelete: Item | undefined;
  let searchIdentifier: string;

  if (itemIdInput) {
    const itemId = parseInt(itemIdInput);
    if (isNaN(itemId)) {
      showNotification("Item ID must be a valid number!", "error");
      return;
    }
    itemToDelete = inventoryManager.searchById(itemId);
    searchIdentifier = `ID ${itemId}`;
  } else {
    itemToDelete = inventoryManager.searchByName(itemName);
    searchIdentifier = `"${itemName}"`;
  }

  if (!itemToDelete) {
    showNotification(`Item with ${searchIdentifier} not found!`, "error");
    return;
  }

  const confirmBox = document.getElementById("confirmationBox");
  if (confirmBox) {
    confirmBox.innerHTML = `
      <div class="delete-confirmation">
        <p>Are you sure you want to delete <strong>${itemToDelete.itemName}</strong> (ID: ${itemToDelete.itemId})?</p>
        <div class="confirmation-buttons">
          <button id="confirmDeleteBtn" class="btn btn-danger">Delete</button>
          <button id="cancelDeleteBtn" class="btn btn-secondary">Cancel</button>
        </div>
      </div>
    `;

    const confirmBtn = document.getElementById("confirmDeleteBtn");
    const cancelBtn = document.getElementById("cancelDeleteBtn");

    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => {
        const deleted = itemIdInput
          ? inventoryManager.deleteItemById(parseInt(itemIdInput))
          : inventoryManager.deleteItemByName(itemName);

        if (deleted) {
          showNotification(`✓ Item deleted successfully!`, "success");
          confirmBox.innerHTML = "";
          (document.getElementById("deleteItemName") as HTMLInputElement).value = "";
          (document.getElementById("deleteItemId") as HTMLInputElement).value = "";
          displayAllItems();
        } else {
          showNotification(`Error: Could not delete item!`, "error");
          confirmBox.innerHTML = "";
        }
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        confirmBox.innerHTML = "";
      });
    }
  }
}

function handleSearchItem(): void {
  const itemName = (document.getElementById("searchItemName") as HTMLInputElement).value.trim();
  const itemIdInput = (document.getElementById("searchItemId") as HTMLInputElement).value.trim();

  if (!itemName && !itemIdInput) {
    showNotification("Please enter an item name or ID to search!", "error");
    return;
  }

  let found: Item | undefined;
  let searchIdentifier: string;

  if (itemIdInput) {
    const itemId = parseInt(itemIdInput);
    if (isNaN(itemId)) {
      showNotification("Item ID must be a valid number!", "error");
      return;
    }
    found = inventoryManager.searchById(itemId);
    searchIdentifier = `ID ${itemId}`;
  } else {
    found = inventoryManager.searchByName(itemName);
    searchIdentifier = `"${itemName}"`;
  }

  if (found) {
    displayItems([found]);
    showNotification(`✓ Item ${searchIdentifier} found!`, "success");
  } else {
    displayItems([]);
    showNotification(`Item with ${searchIdentifier} not found!`, "error");
  }
}

function handleUpdateItem(): void {
  const itemName = (document.getElementById("updateItemName") as HTMLInputElement).value.trim();
  const itemIdInput = (document.getElementById("updateItemId") as HTMLInputElement).value.trim();
  const updateField = (document.getElementById("updateField") as HTMLInputElement).value.trim();
  const updateValueInput = (document.getElementById("updateValue") as HTMLInputElement).value.trim();

  if ((!itemName && !itemIdInput) || !updateField || !updateValueInput) {
    showNotification("Please enter item name/ID, field, and new value!", "error");
    return;
  }

  let item: Item | undefined;
  let searchIdentifier: string;

  if (itemIdInput) {
    const itemId = parseInt(itemIdInput);
    if (isNaN(itemId)) {
      showNotification("Item ID must be a valid number!", "error");
      return;
    }
    item = inventoryManager.searchById(itemId);
    searchIdentifier = `ID ${itemId}`;
  } else {
    item = inventoryManager.searchByName(itemName);
    searchIdentifier = `"${itemName}"`;
  }

  if (!item) {
    showNotification(`Item with ${searchIdentifier} not found!`, "error");
    return;
  }

  let convertedValue: string | number | boolean = updateValueInput;

  if (updateField === "quantity") {
    convertedValue = parseInt(updateValueInput);
    if (isNaN(convertedValue as number)) {
      showNotification("Quantity must be a valid number!", "error");
      return;
    }
  } else if (updateField === "price") {
    convertedValue = parseFloat(updateValueInput);
    if (isNaN(convertedValue as number)) {
      showNotification("Price must be a valid number!", "error");
      return;
    }
  } else if (updateField === "popularItem") {
    convertedValue = updateValueInput.toLowerCase() === "true" || updateValueInput === "yes";
  }

  if (inventoryManager.editItem(item.itemId, updateField, convertedValue)) {
    const updatedItem = inventoryManager.searchById(item.itemId);
    if (updatedItem) {
      sendItemToServer(updatedItem, "POST");
    }

    showNotification(`✓ Item updated successfully!`, "success");
    clearUpdateForm();
    displayAllItems();
  } else {
    showNotification("Error: Could not update item!", "error");
  }
}

function displayAllItems(): void {
  const items = inventoryManager.getAllItems();
  displayItems(items);

  if (items.length > 0) {
    showNotification(`Showing ${items.length} items`, "info");
  } else {
    showNotification("No items in inventory", "info");
  }
}

function displayPopularItems(): void {
  const items = inventoryManager.getPopularItems();

  if (items.length === 0) {
    showNotification("No popular items found!", "info");
    displayItems([]);
    return;
  }

  displayItems(items);
  showNotification(`Showing ${items.length} popular items`, "info");
}

function displayItems(items: Item[]): void {
  const displayArea = document.getElementById("itemsDisplay");

  if (!displayArea) {
    return;
  }

  if (items.length === 0) {
    displayArea.innerHTML = "<p class='empty-message'>No items to display</p>";
    return;
  }

  let html = `
    <table class="items-table">
      <thead>
        <tr>
          <th>Item ID</th>
          <th>Item Name</th>
          <th>Category</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Supplier</th>
          <th>Stock Status</th>
          <th>Popular</th>
          <th>Comment</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const popularText = item.popularItem ? "✓ Yes" : "No";
    const comment = item.comment || "-";
    const statusClass = item.stockStatus === "Low Stock" ? "status-low" : "status-good";

    html += `
      <tr>
        <td><span class="item-id">${item.itemId}</span></td>
        <td><strong>${item.itemName}</strong></td>
        <td>${item.category}</td>
        <td>${item.quantity}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>${item.supplierName}</td>
        <td><span class="stock-${statusClass}">${item.stockStatus}</span></td>
        <td>${popularText}</td>
        <td>${comment}</td>
      </tr>
    `;
  }

  html += `
      </tbody>
    </table>
  `;

  displayArea.innerHTML = html;
}

function showNotification(message: string, type: "success" | "error" | "info"): void {
  const notification = document.getElementById("notification");

  if (!notification) {
    return;
  }

  notification.className = `notification notification-${type}`;
  notification.innerHTML = message;

  setTimeout(() => {
    notification.innerHTML = "";
    notification.className = "notification";
  }, 4000);
}

function clearAddForm(): void {
  (document.getElementById("itemId") as HTMLInputElement).value = "";
  (document.getElementById("itemName") as HTMLInputElement).value = "";
  (document.getElementById("category") as HTMLInputElement).value = "";
  (document.getElementById("quantity") as HTMLInputElement).value = "";
  (document.getElementById("price") as HTMLInputElement).value = "";
  (document.getElementById("supplierName") as HTMLInputElement).value = "";
  (document.getElementById("stockStatus") as HTMLInputElement).value = "";
  (document.getElementById("popularItem") as HTMLInputElement).checked = false;
  (document.getElementById("comment") as HTMLInputElement).value = "";
}

function clearUpdateForm(): void {
  (document.getElementById("updateItemName") as HTMLInputElement).value = "";
  (document.getElementById("updateItemId") as HTMLInputElement).value = "";
  (document.getElementById("updateField") as HTMLInputElement).value = "";
  (document.getElementById("updateValue") as HTMLInputElement).value = "";
}

async function sendItemToServer(item: Item, method: string): Promise<void> {
  try {
    const response = await fetch("http://localhost:8080", {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    if (response.ok) {
      console.log("Item sent to server successfully");
    } else {
      console.log("Server responded with error status");
    }
  } catch (error) {
    console.log("Could not reach server - ensure it is running on http://localhost:8080");
  }
}

function setupSuggestions(
  inputId: string,
  suggestionsId: string,
  type: "getName" | "getId" | "getCategory" | "getSupplier" | "getStatus"
): void {
  const inputElement = document.getElementById(inputId) as HTMLInputElement;
  const suggestionsElement = document.getElementById(suggestionsId);

  if (!inputElement || !suggestionsElement) {
    return;
  }

  inputElement.addEventListener("input", () => {
    const value = inputElement.value.trim().toLowerCase();

    if (value.length === 0) {
      suggestionsElement.classList.remove("show");
      return;
    }

    const allItems = inventoryManager.getAllItems();
    let filteredItems: any[] = [];

    if (type === "getName") {
      filteredItems = allItems.filter((item) =>
        item.itemName.toLowerCase().includes(value)
      );
    } else if (type === "getId") {
      filteredItems = allItems.filter((item) =>
        item.itemId.toString().includes(value)
      );
    } else if (type === "getCategory") {
      const categories = [...new Set(allItems.map((item) => item.category))];
      filteredItems = categories
        .filter((cat) => cat.toLowerCase().includes(value))
        .map((cat) => ({ category: cat }));
    } else if (type === "getSupplier") {
      const suppliers = [...new Set(allItems.map((item) => item.supplierName))];
      filteredItems = suppliers
        .filter((supp) => supp.toLowerCase().includes(value))
        .map((supp) => ({ supplierName: supp }));
    } else if (type === "getStatus") {
      const statuses = [...new Set(allItems.map((item) => item.stockStatus))];
      filteredItems = statuses
        .filter((status) => status.toLowerCase().includes(value))
        .map((status) => ({ stockStatus: status }));
    }

    if (filteredItems.length === 0) {
      suggestionsElement.classList.remove("show");
      return;
    }

    let html = "";
    for (let i = 0; i < Math.min(filteredItems.length, 5); i++) {
      const item = filteredItems[i];
      let displayText = "";

      if (type === "getName") {
        displayText = item.itemName;
      } else if (type === "getId") {
        displayText = item.itemId.toString();
      } else if (type === "getCategory") {
        displayText = item.category;
      } else if (type === "getSupplier") {
        displayText = item.supplierName;
      } else if (type === "getStatus") {
        displayText = item.stockStatus;
      }

      html += `<div class="suggestion-item" data-value="${displayText}">${displayText}</div>`;
    }

    suggestionsElement.innerHTML = html;
    suggestionsElement.classList.add("show");

    suggestionsElement.querySelectorAll(".suggestion-item").forEach((item) => {
      item.addEventListener("click", (e: Event) => {
        const value = (e.target as HTMLElement).getAttribute("data-value");
        if (value) {
          inputElement.value = value;
          suggestionsElement.classList.remove("show");
          updateLivePreview();
        }
      });
    });
  });

  inputElement.addEventListener("blur", () => {
    setTimeout(() => {
      suggestionsElement.classList.remove("show");
    }, 200);
  });

  inputElement.addEventListener("input", () => {
    updateLivePreview();
  });
}

function setupLivePreview(): void {
  const itemIdInput = document.getElementById("itemId") as HTMLInputElement;
  const itemNameInput = document.getElementById("itemName") as HTMLInputElement;
  const categoryInput = document.getElementById("category") as HTMLInputElement;
  const quantityInput = document.getElementById("quantity") as HTMLInputElement;
  const priceInput = document.getElementById("price") as HTMLInputElement;
  const supplierInput = document.getElementById("supplierName") as HTMLInputElement;
  const statusInput = document.getElementById("stockStatus") as HTMLInputElement;
  const popularInput = document.getElementById("popularItem") as HTMLInputElement;

  const inputs = [
    itemIdInput,
    itemNameInput,
    categoryInput,
    quantityInput,
    priceInput,
    supplierInput,
    statusInput,
    popularInput,
  ];

  inputs.forEach((input) => {
    if (input) {
      input.addEventListener("input", updateLivePreview);
      input.addEventListener("change", updateLivePreview);
    }
  });
}

function updateLivePreview(): void {
  const previewSection = document.getElementById("itemPreview");
  const itemIdInput = document.getElementById("itemId") as HTMLInputElement;
  const itemNameInput = document.getElementById("itemName") as HTMLInputElement;
  const categoryInput = document.getElementById("category") as HTMLInputElement;
  const quantityInput = document.getElementById("quantity") as HTMLInputElement;
  const priceInput = document.getElementById("price") as HTMLInputElement;
  const supplierInput = document.getElementById("supplierName") as HTMLInputElement;
  const statusInput = document.getElementById("stockStatus") as HTMLInputElement;
  const popularInput = document.getElementById("popularItem") as HTMLInputElement;

  const hasValue =
    itemIdInput.value ||
    itemNameInput.value ||
    categoryInput.value ||
    quantityInput.value ||
    priceInput.value ||
    supplierInput.value ||
    statusInput.value;

  if (!hasValue) {
    if (previewSection) previewSection.style.display = "none";
    return;
  }

  if (previewSection) previewSection.style.display = "block";

  const updatePreviewField = (fieldId: string, value: string) => {
    const element = document.getElementById(fieldId);
    if (element) {
      element.textContent = value || "-";
      element.classList.toggle("preview-empty", !value);
    }
  };

  updatePreviewField("previewId", itemIdInput.value);
  updatePreviewField("previewName", itemNameInput.value);
  updatePreviewField("previewCategory", categoryInput.value);
  updatePreviewField("previewQuantity", quantityInput.value);
  updatePreviewField("previewPrice", priceInput.value ? `$${priceInput.value}` : "");
  updatePreviewField("previewSupplier", supplierInput.value);
  updatePreviewField("previewStatus", statusInput.value);
  updatePreviewField("previewPopular", popularInput.checked ? "✓ Yes" : "No");
}
