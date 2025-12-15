import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { ProductValidator } from '../validators/ProductValidator';
import { AuthMiddleware } from '../../../user/presentation/middleware/AuthMiddleware';
import { TypeOrmProductRepository } from '../../infrastructure/persistence/repositories/TypeOrmProductRepository';
import { TypeOrmProductVariantRepository } from '../../infrastructure/persistence/repositories/TypeOrmProductVariantRepository';
import { TypeOrmProductImageRepository } from '../../infrastructure/persistence/repositories/TypeOrmProductImageRepository';
import { TypeOrmMerchantStaffRepository } from '../../../merchant/infrastructure/persistence/repositories/TypeOrmMerchantStaffRepository';
import { CreateProductUseCase } from '../../application/use-cases/CreateProductUseCase';
import { GetProductByIdUseCase } from '../../application/use-cases/GetProductByIdUseCase';
import { SearchProductsUseCase } from '../../application/use-cases/SearchProductsUseCase';
import { UpdateProductUseCase } from '../../application/use-cases/UpdateProductUseCase';
import { DeleteProductUseCase } from '../../application/use-cases/DeleteProductUseCase';
import { GetProductsByAestheticUseCase } from '../../application/use-cases/GetProductsByAestheticUseCase';
import { UpdateVariantStockUseCase } from '../../application/use-cases/UpdateVariantStockUseCase';
import { AddProductImageUseCase } from '../../application/use-cases/AddProductImageUseCase';

export class ProductRoutes {
    public static create(): Router {
        const router = Router();

        // Initialize repositories
        const productRepository = new TypeOrmProductRepository();
        const variantRepository = new TypeOrmProductVariantRepository();
        const imageRepository = new TypeOrmProductImageRepository();
        const merchantStaffRepository = new TypeOrmMerchantStaffRepository();

        // Initialize use cases
        const createProductUseCase = new CreateProductUseCase(
            productRepository,
            variantRepository,
            imageRepository,
            merchantStaffRepository
        );
        const getProductByIdUseCase = new GetProductByIdUseCase(
            productRepository,
            variantRepository,
            imageRepository
        );
        const searchProductsUseCase = new SearchProductsUseCase(
            productRepository,
            variantRepository,
            imageRepository
        );
        const updateProductUseCase = new UpdateProductUseCase(
            productRepository,
            variantRepository,
            imageRepository,
            merchantStaffRepository
        );
        const deleteProductUseCase = new DeleteProductUseCase(
            productRepository,
            variantRepository,
            imageRepository,
            merchantStaffRepository
        );
        const getProductsByAestheticUseCase = new GetProductsByAestheticUseCase(
            productRepository,
            variantRepository,
            imageRepository
        );
        const updateVariantStockUseCase = new UpdateVariantStockUseCase(
            variantRepository,
            productRepository,
            merchantStaffRepository
        );
        const addProductImageUseCase = new AddProductImageUseCase(
            productRepository,
            imageRepository,
            merchantStaffRepository
        );

        // Initialize controller
        const productController = new ProductController(
            createProductUseCase,
            getProductByIdUseCase,
            searchProductsUseCase,
            updateProductUseCase,
            deleteProductUseCase,
            getProductsByAestheticUseCase,
            updateVariantStockUseCase,
            addProductImageUseCase
        );

        // Public routes
        router.get('/search', ProductValidator.searchRules(), productController.search);
        router.get('/aesthetic/:aestheticId', productController.getByAesthetic);
        router.get('/:id', productController.getById);

        // Protected routes
        router.post(
            '/merchant/:merchantId',
            AuthMiddleware.authenticate,
            ProductValidator.createRules(),
            productController.create
        );

        router.put(
            '/:id',
            AuthMiddleware.authenticate,
            ProductValidator.updateRules(),
            productController.update
        );

        router.delete('/:id', AuthMiddleware.authenticate, productController.delete);

        router.put(
            '/variant/:variantId/stock',
            AuthMiddleware.authenticate,
            ProductValidator.updateStockRules(),
            productController.updateVariantStock
        );

        router.post(
            '/:id/images',
            AuthMiddleware.authenticate,
            ProductValidator.addImageRules(),
            productController.addImage
        );

        return router;
    }
}