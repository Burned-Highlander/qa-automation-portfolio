// tests/API tests/api-performance.spec.js

const { test, expect } = require('@playwright/test');
const { ApiHelper } = require('../../helpers/ApiHelper');

// Simple nearest-rank percentile calculation
function percentile(values, p) {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.max(0, Math.ceil((p / 100) * sorted.length) - 1);
    return sorted[index];
}

test.describe('Restful Booker Platform - Performance Flow', () => {
    let api;

    test.beforeEach(async ({ request }) => {
        api = new ApiHelper(request);
    });

    // P95 PERFORMANCE TEST (Industry Standard)
    test('should fetch room data within p95 latency budget', async () => {
        const params = { checkin: '2027-12-01', checkout: '2027-12-06' };
        const iterations = 10; // More samples for better p95 accuracy
        const latencies = [];

        console.log(`🔬 Running p95 performance test with ${iterations} iterations...`);
        console.log(`⚠️ Note: This endpoint returns identical data regardless of date range (verified)`);

        // Warm-up request (excludes TLS handshake / cold start from measurements)
        await api.get('/api/room', params);

        for (let i = 0; i < iterations; i++) {
            const startTime = Date.now();

            const response = await api.get('/api/room', params);

            const endTime = Date.now();
            const duration = endTime - startTime;

            expect(response.status()).toBe(200);
            latencies.push(duration);
            console.log(`  Sample ${i + 1}: ${duration}ms`);
        }

        // Calculate percentiles
        const median = percentile(latencies, 50);
        const p95 = percentile(latencies, 95);
        const p99 = percentile(latencies, 99);

        console.log(`📊 Median: ${median}ms | p95: ${p95}ms | p99: ${p99}ms`);
        console.log(`📋 Raw samples: ${latencies.join(', ')}ms`);

        // Provisional p95 budget: 1000ms (based on observed baseline of ~400-750ms)
        // In production, this would be derived from SLA/SLO or product requirements
        const P95_BUDGET_MS = 1000;

        expect(p95).toBeLessThan(P95_BUDGET_MS);
        console.log(`✅ p95 latency (${p95}ms) is within budget (${P95_BUDGET_MS}ms)`);
    });
});