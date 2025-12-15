import { ProductVariant } from '../entities/ProductVariant';

export interface IProductVariantRepository {
    save(variant: ProductVariant): Promise<ProductVariant>;
    saveMany(variants: ProductVariant[]): Promise<ProductVariant[]>;
    findById(id: string): Promise<ProductVariant | null>;
    findByProductId(productId: string): Promise<ProductVariant[]>;
    findBySku(sku: string): Promise<ProductVariant | null>;
    update(variant: ProductVariant): Promise<ProductVariant>;
    delete(id: string): Promise<void>;
    deleteByProductId(productId: string): Promise<void>;
    existsBySku(sku: string): Promise<boolean>;
}