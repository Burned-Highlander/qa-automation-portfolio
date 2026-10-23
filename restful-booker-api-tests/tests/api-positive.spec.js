// tests/API tests/api-positive.spec.js

const { test, expect } = require('@playwright/test');
const { ApiHelper } = require('../helpers/ApiHelper');
const { BookingSpecs } = require('../specs/BookingSpecs');

test.describe('Restful Booker Platform - Positive Flow', () => {
    let api;

    test.beforeEach(async ({ request }) => {
        api = new ApiHelper(request);
    });

    test('should successfully create a new booking with valid data', async () => {
        // ARRANGE: Use the Request Spec
        const payload = BookingSpecs.validBookingPayload({
            firstname: "Orlando",
            lastname: "Broom",
            phone: "22040823399"
        });

        console.log('📤 Sending POST request with payload:', JSON.stringify(payload, null, 2));

        // ACT: Use the Base Helper
        const response = await api.post('/api/booking', payload);

        console.log('📥 Received response with status:', response.status());

        // ASSERT: Use the Response Spec
        const body = await BookingSpecs.assertBookingCreated(response, payload);

        console.log('✅ Successfully created booking with ID:', body.bookingid);
        console.log('✅ Returned data matches sent data:', body.firstname === payload.firstname);
    });
});