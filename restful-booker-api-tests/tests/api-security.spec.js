// tests/API tests/api-security.spec.js

const { test, expect } = require('@playwright/test');
const { ApiHelper } = require('../../helpers/ApiHelper');
const { BookingSpecs } = require('../../specs/BookingSpecs');

test.describe('Restful Booker Platform - Security Flow', () => {
    let api;

    test.beforeEach(async ({ request }) => {
        api = new ApiHelper(request);
    });

    test('should reject login attempts with invalid credentials', async () => {
        // ARRANGE: Use the Request Spec
        const payload = BookingSpecs.invalidAuthPayload();

        console.log('📤 Sending POST request to /auth/login with INVALID credentials:', JSON.stringify(payload, null, 2));

        // ACT: Use the Base Helper
        const response = await api.post('/api/auth/login', payload);

        console.log('📥 Received response with status:', response.status());

        // ASSERT: Use the Response Spec
        await BookingSpecs.assertUnauthorizedAccess(response);

        console.log('✅ API correctly rejected unauthorized login attempt');
    });

    test('should reject unauthorized attempts to modify a newly created booking', async () => {
        // ARRANGE: Create a booking first (API Chaining)
        const createPayload = BookingSpecs.validBookingPayload({
            firstname: "Security",
            lastname: "Tester",
            roomid: 2,
        });

        console.log('📤 Step 1: Creating a booking to get a valid ID...');
        const createResponse = await api.post('/api/booking', createPayload);
        expect(createResponse.status()).toBe(201);
        const createBody = await createResponse.json();
        const newBookingId = createBody.bookingid;

        console.log('✅ Successfully created booking with ID:', newBookingId);

        // ACT: Attempt to UPDATE it with invalid auth
        const updatePayload = BookingSpecs.validBookingPayload({
            firstname: "Hacker",
            lastname: "Attempt",
            roomid: 3,
        });

        console.log('📤 Step 2: Attempting to UPDATE booking', newBookingId, 'WITHOUT authentication...');
        const updateResponse = await api.put(`/api/booking/${newBookingId}`, updatePayload);

        console.log('📥 Received response with status:', updateResponse.status());

        // ASSERT: Verify the security guard blocked us
        await BookingSpecs.assertUnauthorizedAccess(updateResponse);

        console.log('✅ API correctly blocked unauthorized modification attempt');
    });
});