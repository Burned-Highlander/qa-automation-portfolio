// restful-booker-api-tests/helpers/ApiHelper.js

class ApiHelper {
    constructor(request) {
        this.request = request;
        // No need to hardcode baseURL here anymore!
        // Playwright's request context automatically uses the baseURL from playwright.config.js
    }

    get defaultHeaders() {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    async get(endpoint, params = {}) {
        const queryParams = new URLSearchParams(params).toString();
        const url = queryParams ? `${endpoint}?${queryParams}` : endpoint;

        return await this.request.get(url, {
            headers: this.defaultHeaders
        });
    }

    async post(endpoint, payload) {
        return await this.request.post(endpoint, {
            data: payload,
            headers: this.defaultHeaders
        });
    }

    async put(endpoint, payload) {
        return await this.request.put(endpoint, {
            data: payload,
            headers: this.defaultHeaders
        });
    }
}

module.exports = { ApiHelper };