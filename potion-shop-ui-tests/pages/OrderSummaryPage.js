// pages/OrderSummaryPage.js

class OrderSummaryPage {
    constructor(page) {
        this.page = page;

        // --- Locators for the Sidebar ---
        this.subtotalText = page.locator('#summary-subtotal .item-price');
        this.totalText = page.locator('#summary-total .total-price');
    }

    // --- Getter Methods (Data Extraction) ---

    async getSubtotal() {
        // Extract text (e.g., "25 gold"), remove " gold", and convert to a number
        const text = await this.subtotalText.innerText();
        return parseFloat(text.replace(' gold', ''));
    }

    async getTotal() {
        const text = await this.totalText.innerText();
        return parseFloat(text.replace(' gold', ''));
    }
}

module.exports = { OrderSummaryPage };