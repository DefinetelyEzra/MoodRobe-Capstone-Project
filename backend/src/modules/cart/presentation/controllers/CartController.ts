import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../../../user/presentation/middleware/AuthMiddleware';
import { GetOrCreateCartUseCase } from '../../application/use-cases/GetOrCreateCartUseCase';
import { AddItemToCartUseCase } from '../../application/use-cases/AddItemToCartUseCase';
import { UpdateCartItemQuantityUseCase } from '../../application/use-cases/UpdateCartItemQuantityUseCase';
import { RemoveItemFromCartUseCase } from '../../application/use-cases/RemoveItemFromCartUseCase';
import { ClearCartUseCase } from '../../application/use-cases/ClearCartUseCase';
import {
    CartNotFoundException,
    CartItemNotFoundException,
    ProductNotAvailableException,
    InsufficientStockException,
    InvalidQuantityException,
} from '../../domain/exceptions/CartExceptions';

export class CartController {
    constructor(
        private readonly getOrCreateCartUseCase: GetOrCreateCartUseCase,
        private readonly addItemToCartUseCase: AddItemToCartUseCase,
        private readonly updateCartItemQuantityUseCase: UpdateCartItemQuantityUseCase,
        private readonly removeItemFromCartUseCase: RemoveItemFromCartUseCase,
        private readonly clearCartUseCase: ClearCartUseCase
    ) { }

    public getCart = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const result = await this.getOrCreateCartUseCase.execute(req.userId);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public addItem = async (req: AuthRequest, res: Response): Promise<void> => {
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

            const result = await this.addItemToCartUseCase.execute(req.body, req.userId);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public updateItemQuantity = async (req: AuthRequest, res: Response): Promise<void> => {
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

            const { productVariantId } = req.params;
            const result = await this.updateCartItemQuantityUseCase.execute(
                productVariantId,
                req.body,
                req.userId
            );
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public removeItem = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { productVariantId } = req.params;
            const result = await this.removeItemFromCartUseCase.execute(
                productVariantId,
                req.userId
            );
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            await this.clearCartUseCase.execute(req.userId);
            res.status(200).json({ message: 'Cart cleared successfully' });
        } catch (error) {
            this.handleError(error, res);
        }
    };

    private handleError(error: unknown, res: Response): void {
        if (error instanceof CartNotFoundException) {
            res.status(404).json({ error: error.message });
        } else if (error instanceof CartItemNotFoundException) {
            res.status(404).json({ error: error.message });
        } else if (error instanceof ProductNotAvailableException) {
            res.status(400).json({ error: error.message });
        } else if (error instanceof InsufficientStockException) {
            res.status(400).json({ error: error.message });
        } else if (error instanceof InvalidQuantityException) {
            res.status(400).json({ error: error.message });
        } else if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}