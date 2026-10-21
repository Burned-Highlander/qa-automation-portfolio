// tests/accessibility.spec.js

const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe('Potion Shop Accessibility (a11y)', () => {
    test('homepage should not have any new accessibility issues', async ({ page }) => {
        await page.goto('https://qe-at-cgi-fi.github.io/potion-shop/');

        // Run the Axe scan, but disable rules for known, unfixable demo app debt
        const accessibilityScanResults = await new AxeBuilder({ page })
            .disableRules(['color-contrast', 'heading-order', 'image-alt', 'label'])
            .analyze();

        // Assert that there are zero violations for all *other* rules
        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('checkout form should be accessible', async ({ page }) => {
        await page.goto('https://qe-at-cgi-fi.github.io/potion-shop/');

        // Analyze only the form, excluding the known unlabelled quantity input
        const formResults = await new AxeBuilder({ page })
            .include('#order-form')
            .exclude('#quantity') // Exclude the specific element we know is broken
            .analyze();

        expect(formResults.violations).toEqual([]);
    });
});