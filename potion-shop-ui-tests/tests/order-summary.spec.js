// tests/order-summary.spec.js

const { test, expect } = require('@playwright/test');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { OrderSummaryPage } = require('../pages/OrderSummaryPage');

test.describe('Order Summary Pricing Validation', () => {
    let checkoutPage;
    let orderSummaryPage;

    test.beforeEach(async ({ page }) => {
        // Initialize BOTH page objects
        checkoutPage = new CheckoutPage(page);
        orderSummaryPage = new OrderSummaryPage(page);

        await page.goto('/potion-shop/');
        await page.screenshot({ path: 'debug-order-summary-start.png', fullPage: true });
    });

    test('Scenario 1: Simple Order calculates correct subtotal and total', async () => {
        // ACT: Select the base potion.
        // We leave everything else as default (Vial, Standard, Qty 1, No ingredients).
        await checkoutPage.selectHealingPotion();

        // ASSERT: Verify the mathematical calculations
        // Healing Draught (25) * 1 (Vial) * 1 (Standard) * 1 (Qty) = 25
        // Total = 25 + 3 (Brewing Fee) = 28

        const subtotal = await orderSummaryPage.getSubtotal();
        const total = await orderSummaryPage.getTotal();

        expect(subtotal).toBe(25);
        expect(total).toBe(28);
    });

    test('Scenario 2: Complex Order calculates correct subtotal and total', async () => {
        /*
        Potion: Invisibility Brew (45 gold)
        Size: Bottle (2.5x multiplier, not 2x)
        Potency: Enhanced (1.25x multiplier)
        Quantity: 2
        Ingredients: Dragon Scale (15) + Moonstone (8) = 23 gold.
        */

        //ACT: Select Invisiblity potion
        await checkoutPage.selectInvisibilityPotion();

        //ACT: Select Bottle size
        await checkoutPage.selectLargeSize();

        //ACT: Select Enhanced potency
        await checkoutPage.selectEnhancedPotency();

        //ACT: Add ingredients Dragon Scale and Moonstone
        await checkoutPage.addDragonScale();
        await checkoutPage.addMoonstone();

        //ACT: Set quantity to 2
        await checkoutPage.increaseQuantity(); // Now quantity is 2

        // ASSERT: Verify the mathematical calculations
        // Invisibility Brew (45) * 2.5 (Bottle) * 1.25 (Enhanced) * 2 (Qty) = 281.25
        // Ingredients: 15 + 8 = 23
        // Subtotal = 281.25 + 23 = 304.25
        // Total = 304.25 + 3 (Brewing Fee) = 307.25

        const subtotal = await orderSummaryPage.getSubtotal();
        const total = await orderSummaryPage.getTotal();

        expect(subtotal).toBe(304.25);
        expect(total).toBe(307.25);

    });
});