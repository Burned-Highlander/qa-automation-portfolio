// potion-shop-ui-tests/tests/accessibility.spec.js

const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { CheckoutPage } = require('../pages/CheckoutPage');

test.describe('Potion Shop Accessibility (a11y)', () => {

    // Known technical debt in this specific demo app
    const knownViolationIds = [
        'label-content-name-mismatch',
        'color-contrast',
        'heading-order',
        'image-alt',
        'label',
        'landmark-one-main',
        'region'
    ];

    let checkoutPage;

    test.beforeEach(async ({ page }) => {
        checkoutPage = new CheckoutPage(page);
        // Wait for DOM to be fully loaded before interacting
        await page.goto('/potion-shop/');
    });

    test('initial page load should not have any NEW accessibility issues', async ({ page }) => {
        // Scan the page in its initial, static state
        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

        const newViolations = accessibilityScanResults.violations.filter(
            (violation) => !knownViolationIds.includes(violation.id)
        );

        console.log(`🔍 Initial load violations: ${accessibilityScanResults.violations.length} (New: ${newViolations.length})`);

        expect(newViolations).toEqual([]);
    });

    test('confirmation modal should be accessible after submitting an order', async ({ page }) => {
        // 1. Use the POM to interact with the page and trigger the dynamic modal
        await checkoutPage.selectHealingPotion();
        await checkoutPage.fillDeliveryDetails('Test User', 'Test Castle', 'Test Kingdom');
        await checkoutPage.clickSubmitOrder();

        // 2. CRITICAL: Wait for the modal to be fully visible in the DOM before scanning.
        // Scanning during animation causes false positives.
        await expect(checkoutPage.confirmationModal).toBeVisible();

        // 3. Run the Axe scan WHILE the modal is open and focused
        const modalScanResults = await new AxeBuilder({ page }).analyze();

        const newModalViolations = modalScanResults.violations.filter(
            (violation) => !knownViolationIds.includes(violation.id)
        );

        console.log(`🔍 Modal state violations: ${modalScanResults.violations.length} (New: ${newModalViolations.length})`);

        if (newModalViolations.length > 0) {
            console.log('🚨 NEW modal violations found:');
            newModalViolations.forEach(v => console.log(`   - ${v.id}: ${v.help}`));
        }

        // 4. Assert no new violations were introduced by the dynamic modal
        expect(newModalViolations).toEqual([]);
    });
});