import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../../../user/presentation/middleware/AuthMiddleware';
import { CreateProductUseCase } from '../../application/use-cases/CreateProductUseCase';
import { GetProductByIdUseCase } from '../../application/use-cases/GetProductByIdUseCase';
import { SearchProductsUseCase } from '../../application/use-cases/SearchProductsUseCase';
import { UpdateProductUseCase } from '../../application/use-cases/UpdateProductUseCase';
import { DeleteProductUseCase } from '../../application/use-cases/DeleteProductUseCase';
import { GetProductsByAestheticUseCase } from '../../application/use-cases/GetProductsByAestheticUseCase';
import { UpdateVariantStockUseCase } from '../../application/use-cases/UpdateVariantStockUseCase';
import { AddProductImageUseCase } from '../../application/use-cases/AddProductImageUseCase';
import {
    ProductNotFoundException,
    ProductVariantNotFoundException,
    DuplicateSkuException,
    UnauthorizedProductAccessException,
} from '../../domain/exceptions/ProductExceptions';

export class ProductController {
    constructor(
        private readonly createProductUseCase: CreateProductUseCase,
        private readonly getProductByIdUseCase: GetProductByIdUseCase,
        private readonly searchProductsUseCase: SearchProductsUseCase,
        private readonly updateProductUseCase: UpdateProductUseCase,
        private readonly deleteProductUseCase: DeleteProductUseCase,
        private readonly getProductsByAestheticUseCase: GetProductsByAestheticUseCase,
        private readonly updateVariantStockUseCase: UpdateVariantStockUseCase,
        private readonly addProductImageUseCase: AddProductImageUseCase
    ) { }

    public create = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { merchantId } = req.params;
            const result = await this.createProductUseCase.execute(
                req.body,
                merchantId,
                req.userId
            );
            res.status(201).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public getById = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const result = await this.getProductByIdUseCase.execute(id);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public search = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            // Extract nested ternary to independent statement
            const aestheticTags = req.query.aestheticTags;
            let parsedAestheticTags: string[] | undefined;

            if (aestheticTags) {
                parsedAestheticTags = Array.isArray(aestheticTags)
                    ? aestheticTags as string[]
                    : [aestheticTags as string];
            }

            const searchDto = {
                merchantId: req.query.merchantId as string | undefined,
                category: req.query.category as string | undefined,
                aestheticTags: parsedAestheticTags,
                minPrice: req.query.minPrice
                    ? Number.parseFloat(req.query.minPrice as string)
                    : undefined,
                maxPrice: req.query.maxPrice
                    ? Number.parseFloat(req.query.maxPrice as string)
                    : undefined,
                isActive: req.query.isActive === 'true',
                searchTerm: req.query.searchTerm as string | undefined,
                limit: req.query.limit ? Number.parseInt(req.query.limit as string, 10) : undefined,
                offset: req.query.offset ? Number.parseInt(req.query.offset as string, 10) : undefined,
            };

            const result = await this.searchProductsUseCase.execute(searchDto);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public update = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            const result = await this.updateProductUseCase.execute(id, req.body, req.userId);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public delete = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            await this.deleteProductUseCase.execute(id, req.userId);
            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public getByAesthetic = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { aestheticId } = req.params;
            const limit = req.query.limit ? Number.parseInt(req.query.limit as string, 10) : 20;
            const offset = req.query.offset ? Number.parseInt(req.query.offset as string, 10) : 0;

            const result = await this.getProductsByAestheticUseCase.execute(
                aestheticId,
                limit,
                offset
            );
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public updateVariantStock = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { variantId } = req.params;
            const result = await this.updateVariantStockUseCase.execute(
                variantId,
                req.body,
                req.userId
            );
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public addImage = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            const result = await this.addProductImageUseCase.execute(
                id,
                req.body,
                req.userId
            );
            res.status(201).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    private handleError(error: unknown, res: Response): void {
        if (error instanceof ProductNotFoundException) {
            res.status(404).json({ error: error.message });
        } else if (error instanceof ProductVariantNotFoundException) {
            res.status(404).json({ error: error.message });
        } else if (error instanceof DuplicateSkuException) {
            res.status(409).json({ error: error.message });
        } else if (error instanceof UnauthorizedProductAccessException) {
            res.status(403).json({ error: error.message });
        } else if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}