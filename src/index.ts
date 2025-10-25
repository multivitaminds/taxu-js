import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface TaxuConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
}

export interface TaxuApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

export interface TaxCalculationRequest {
  amount: number;
  currency: string;
  jurisdiction?: string;
  taxType?: string;
}

export interface TaxCalculationResult {
  originalAmount: number;
  taxAmount: number;
  totalAmount: number;
  taxRate: number;
  jurisdiction: string;
  calculationId: string;
}

export class TaxuClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(config: TaxuConfig) {
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
  async calculateTax(request: TaxCalculationRequest): Promise<TaxuApiResponse<TaxCalculationResult>> {
    try {
      const response = await this.client.post('/tax/calculate', request);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get supported jurisdictions
   */
  async getJurisdictions(): Promise<TaxuApiResponse<string[]>> {
    try {
      const response = await this.client.get('/jurisdictions');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Health check endpoint
   */
  async ping(): Promise<TaxuApiResponse<{ timestamp: string }>> {
    try {
      const response = await this.client.get('/ping');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Make a direct request to any Taxu API endpoint
   */
  async request<T = any>(
    endpoint: string,
    options?: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      data?: any;
      params?: Record<string, any>;
    }
  ): Promise<TaxuApiResponse<T>> {
    try {
      const { method = 'GET', data, params } = options || {};
      
      const response = await this.client.request({
        url: endpoint,
        method: method.toLowerCase() as any,
        data,
        params
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      // API error response
      const message = error.response.data?.message || `API Error: ${error.response.status}`;
      return new Error(message);
    } else if (error.request) {
      // Network error
      return new Error('Network error: Unable to reach Taxu API');
    } else {
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
export function createTaxuClient(apiKeyOrConfig: string | TaxuConfig): TaxuClient {
  if (typeof apiKeyOrConfig === 'string') {
    return new TaxuClient({ apiKey: apiKeyOrConfig });
  }
  return new TaxuClient(apiKeyOrConfig);
}
