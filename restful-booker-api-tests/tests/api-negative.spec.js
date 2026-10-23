// tests/API tests/api-negative.spec.js

const { test, expect } = require('@playwright/test');
const { ApiHelper } = require('../helpers/ApiHelper');
const { BookingSpecs } = require('../specs/BookingSpecs');

test.describe('Restful Booker Platform - Negative Flow', () => {
    let api;

    test.beforeEach(async ({ request }) => {
        api = new ApiHelper(request);
    });

    test('should reject booking creation with invalid payload', async () => {
        // ARRANGE: Use the Request Spec
        const payload = BookingSpecs.invalidBookingPayload();

        console.log('📤 Sending POST request with INVALID payload:', JSON.stringify(payload, null, 2));

        // ACT: Use the Base Helper
        const response = await api.post('/api/booking', payload);

        console.log('📥 Received response with status:', response.status());

        // ASSERT: Use the Response Spec
        await BookingSpecs.assertValidationError(response, [
            "size must be between 3 and 18",
            "must be a well-formed email address",
            "size must be between 11 and 21"
        ]);

        const body = await response.json();
        console.log('✅ API correctly rejected the request');
        console.log('✅ Returned errors:', body.errors);
    });
});