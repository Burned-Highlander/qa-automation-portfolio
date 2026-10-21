// helpers/ApiHelper.js

class ApiHelper {
    constructor(request) {
        this.request = request;
        this.baseUrl = 'https://automationintesting.online';
    }

    // Common headers used across all requests
    get defaultHeaders() {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    // Generic GET request
    async get(endpoint, params = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const queryParams = new URLSearchParams(params).toString();
        const fullUrl = queryParams ? `${url}?${queryParams}` : url;

        return await this.request.get(fullUrl, {
            headers: this.defaultHeaders
        });
    }

    // Generic POST request
    async post(endpoint, payload) {
        const url = `${this.baseUrl}${endpoint}`;
        return await this.request.post(url, {
            data: payload,
            headers: this.defaultHeaders
        });
    }

    // Generic PUT request
    async put(endpoint, payload) {
        const url = `${this.baseUrl}${endpoint}`;
        return await this.request.put(url, {
            data: payload,
            headers: this.defaultHeaders
        });
    }
}

module.exports = { ApiHelper };