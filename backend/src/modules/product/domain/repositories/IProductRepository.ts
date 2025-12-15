import { Product } from '../entities/Product';

export interface ProductSearchCriteria {
    merchantId?: string;
    category?: string;
    aestheticTags?: string[];
    minPrice?: number;
    maxPrice?: number;
    isActive?: boolean;
    searchTerm?: string;
}

export interface IProductRepository {
    save(product: Product): Promise<Product>;
    findById(id: string): Promise<Product | null>;
    findByMerchantId(merchantId: string, limit?: number, offset?: number): Promise<Product[]>;
    findAll(limit?: number, offset?: number): Promise<Product[]>;
    search(criteria: ProductSearchCriteria, limit?: number, offset?: number): Promise<Product[]>;
    update(product: Product): Promise<Product>;
    delete(id: string): Promise<void>;
    count(criteria?: ProductSearchCriteria): Promise<number>;
    findByAestheticTag(aestheticId: string, limit?: number, offset?: number): Promise<Product[]>;
}