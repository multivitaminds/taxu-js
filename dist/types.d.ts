export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | string;
export type TaxType = 'sales' | 'vat' | 'gst' | 'income' | 'property' | string;
export type Jurisdiction = 'US' | 'CA' | 'GB' | 'AU' | 'DE' | 'FR' | string;
export interface TaxRule {
    id: string;
    jurisdiction: Jurisdiction;
    taxType: TaxType;
    rate: number;
    isActive: boolean;
    effectiveDate: string;
    expiryDate?: string;
}
export interface TaxuError {
    code: string;
    message: string;
    details?: Record<string, any>;
}
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
    };
}
export interface CreateTaxRuleRequest {
    jurisdiction: Jurisdiction;
    taxType: TaxType;
    rate: number;
    effectiveDate: string;
    expiryDate?: string;
}
export type TaxuResult<T> = Promise<TaxuApiResponse<T>>;
export interface TaxuApiResponse<T = any> {
    data: T;
    success: boolean;
    message?: string;
    timestamp?: string;
}
//# sourceMappingURL=types.d.ts.map