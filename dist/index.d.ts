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
export declare class TaxuClient {
    private client;
    private apiKey;
    constructor(config: TaxuConfig);
    /**
     * Calculate tax for a given amount using Taxu's AI-powered engine
     */
    calculateTax(request: TaxCalculationRequest): Promise<TaxuApiResponse<TaxCalculationResult>>;
    /**
     * Get supported jurisdictions
     */
    getJurisdictions(): Promise<TaxuApiResponse<string[]>>;
    /**
     * Health check endpoint
     */
    ping(): Promise<TaxuApiResponse<{
        timestamp: string;
    }>>;
    private handleError;
}
export default TaxuClient;
export * from './types';
export declare function createTaxuClient(config: TaxuConfig): TaxuClient;
//# sourceMappingURL=index.d.ts.map