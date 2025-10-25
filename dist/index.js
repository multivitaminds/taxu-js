import axios from 'axios';
export class TaxuClient {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.client = axios.create({
            baseURL: config.baseURL || 'https://api.taxu.io/v1',
            timeout: config.timeout || 10000,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'User-Agent': 'taxu-js/0.1.0'
            }
        });
    }
    /**
     * Calculate tax for a given amount using Taxu's AI-powered engine
     */
    async calculateTax(request) {
        try {
            const response = await this.client.post('/tax/calculate', request);
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    /**
     * Get supported jurisdictions
     */
    async getJurisdictions() {
        try {
            const response = await this.client.get('/jurisdictions');
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    /**
     * Health check endpoint
     */
    async ping() {
        try {
            const response = await this.client.get('/ping');
            return response.data;
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    handleError(error) {
        if (error.response) {
            // API error response
            const message = error.response.data?.message || `API Error: ${error.response.status}`;
            return new Error(message);
        }
        else if (error.request) {
            // Network error
            return new Error('Network error: Unable to reach Taxu API');
        }
        else {
            // Other error
            return new Error(`Request error: ${error.message}`);
        }
    }
}
// Default export for convenience
export default TaxuClient;
// Named exports for flexibility
export * from './types';
// Convenience function to create a client
export function createTaxuClient(config) {
    return new TaxuClient(config);
}
//# sourceMappingURL=index.js.map