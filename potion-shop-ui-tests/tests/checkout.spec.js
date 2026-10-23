// tests/checkout.spec.js

const { test, expect } = require('@playwright/test');
const { CheckoutPage } = require('../pages/CheckoutPage');

test.describe('Potion Shop Checkout Flow', () => {
    let checkoutPage;

    test.beforeEach(async ({ page }) => {
        checkoutPage = new CheckoutPage(page);
        await page.goto('/potion-shop/');
    });

    test('1. Happy Path: Should successfully brew an order with valid details', async () => {
        await checkoutPage.selectHealingPotion();
        await checkoutPage.fillDeliveryDetails('Ray Mitsubishi', 'Grace Fields Castle', 'North Hampshire, England, United Kingdom');

        // ASSERT (Pre-submission): Verify the UI calculated the state correctly
        await expect(checkoutPage.quantityInput).toHaveValue('1');

        // ACT: Submit
        await checkoutPage.clickSubmitOrder();

        // ASSERT (Post-submission): Verify the modal and data reflection
        await expect(checkoutPage.confirmationModal).toBeVisible();

        const orderNumber = await checkoutPage.getOrderNumber();
        expect(orderNumber).toContain('EB-');

        // NEW: Verify the delivery method was registered correctly
        const deliveryEstimate = await checkoutPage.deliveryEstimateText.innerText();
        expect(deliveryEstimate).toContain('3-5 days'); // Because 'Owl Post' is checked by default

        });

    test('2. Should not brew an order without delivery details', async () => {
        await checkoutPage.selectHealingPotion();

        // ACT: Submit
        await checkoutPage.clickSubmitOrder();

        // ASSERT 1: The modal should NOT appear (Form submission was blocked)
        await expect(checkoutPage.confirmationModal).not.toBeVisible();

        // ASSERT 2: The browser should auto-focus the first invalid field (Full Name)
        await expect(checkoutPage.nameInput).toBeFocused();

        // ASSERT: Extract the property value, then use regex matching
        const message = await checkoutPage.nameInput.evaluate(el => el.validationMessage);
        expect(message).toMatch(/fill out this field/i);
    });

    test('3. Verify changing quantity is updated in UI', async () => {
        await checkoutPage.selectInvisibilityPotion();

        // ASSERT (Pre-submission): Verify the UI calculated the state correctly
        await expect(checkoutPage.quantityInput).toHaveValue('1');

        // ACT: Verify the UI reflects the updated quantity
        await checkoutPage.increaseQuantity();
        await checkoutPage.increaseQuantity();
        await checkoutPage.decreaseQuantity();
        await expect(checkoutPage.quantityInput).toHaveValue('2');
    });

});