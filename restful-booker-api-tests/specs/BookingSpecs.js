// specs/BookingSpecs.js
const { expect } = require('@playwright/test');

class BookingSpecs {
    // Request Specs (Payload Builders)
    static validBookingPayload(overrides = {}) {
        return {
            roomid: 1,
            firstname: "John",
            lastname: "Doe",
            totalprice: 100,
            depositpaid: true,
            bookingdates: {
                checkin: "2026-12-01",
                checkout: "2026-12-05"
            },
            ...overrides // Allow test-specific overrides
        };
    }

    static invalidBookingPayload() {
        return {
            roomid: 1,
            firstname: "A", // Too short
            lastname: "B",  // Too short
            depositpaid: false,
            bookingdates: {
                checkin: "2026-10-03",
                checkout: "2026-10-16"
            },
            email: "invalid", // Bad format
            phone: "123"      // Too short
        };
    }

    // Response Specs (Assertion Helpers)
    static async assertBookingCreated(response, expectedPayload) {
        expect(response.status()).toBe(201);
        const body = await response.json();

        expect(body.bookingid).toBeDefined();

        // Fix: Check body.firstname directly, not body.booking.firstname
        expect(body.firstname).toBe(expectedPayload.firstname);
        return body;
    }

    static assertValidationError(response, expectedErrors) {
        expect(response.status()).toBe(400);
        return response.json().then(body => {
            expect(body.errors).toBeDefined();
            expectedErrors.forEach(error => {
                expect(body.errors).toContain(error);
            });
        });
    }

    // Security Test Specs
    static invalidAuthPayload() {
        return {
            username: "fake_admin_user",
            password: "wrong_password_123"
        };
    }

    static async assertUnauthorizedAccess(response) {
        const status = response.status();
        expect(status === 401 || status === 403).toBeTruthy();
    }
}

module.exports = { BookingSpecs };