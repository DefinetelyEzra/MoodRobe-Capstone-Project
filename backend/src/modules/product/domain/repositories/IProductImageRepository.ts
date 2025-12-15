import { ProductImage } from '../entities/ProductImage';

export interface IProductImageRepository {
    save(image: ProductImage): Promise<ProductImage>;
    saveMany(images: ProductImage[]): Promise<ProductImage[]>;
    findById(id: string): Promise<ProductImage | null>;
    findByProductId(productId: string): Promise<ProductImage[]>;
    findPrimaryImage(productId: string): Promise<ProductImage | null>;
    update(image: ProductImage): Promise<ProductImage>;
    delete(id: string): Promise<void>;
    deleteByProductId(productId: string): Promise<void>;
    setPrimaryImage(productId: string, imageId: string): Promise<void>;
}