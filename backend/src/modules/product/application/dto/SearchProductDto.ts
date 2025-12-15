export interface SearchProductDto {
    merchantId?: string;
    category?: string;
    aestheticTags?: string[];
    minPrice?: number;
    maxPrice?: number;
    isActive?: boolean;
    searchTerm?: string;
    limit?: number;
    offset?: number;
}

export interface PaginatedProductsResponse {
    products: any[];
    total: number;
    limit: number;
    offset: number;
}