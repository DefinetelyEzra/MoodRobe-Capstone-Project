import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../../../user/presentation/middleware/AuthMiddleware';
import { CreateOrderFromCartUseCase } from '../../application/use-cases/CreateOrderFromCartUseCase';
import { GetOrderByIdUseCase } from '../../application/use-cases/GetOrderByIdUseCase';
import { GetUserOrdersUseCase } from '../../application/use-cases/GetUserOrdersUseCase';
import { UpdateOrderStatusUseCase } from '../../application/use-cases/UpdateOrderStatusUseCase';
import { CancelOrderUseCase } from '../../application/use-cases/CancelOrderUseCase';
import { UpdateShippingAddressUseCase } from '../../application/use-cases/UpdateShippingAddressUseCase';
import { MarkOrderAsPaidUseCase } from '../../application/use-cases/MarkOrderAsPaidUseCase';
import { SearchOrdersUseCase } from '../../application/use-cases/SearchOrdersUseCase';
import {
    OrderNotFoundException,
    InvalidOrderStateException,
    EmptyCartException,
    InsufficientStockException,
} from '../../domain/exceptions/OrderExceptions';

export class OrderController {
    constructor(
        private readonly createOrderFromCartUseCase: CreateOrderFromCartUseCase,
        private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
        private readonly getUserOrdersUseCase: GetUserOrdersUseCase,
        private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
        private readonly cancelOrderUseCase: CancelOrderUseCase,
        private readonly updateShippingAddressUseCase: UpdateShippingAddressUseCase,
        private readonly markOrderAsPaidUseCase: MarkOrderAsPaidUseCase,
        private readonly searchOrdersUseCase: SearchOrdersUseCase
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

            const result = await this.createOrderFromCartUseCase.execute(req.body, req.userId);
            res.status(201).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public getById = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            const result = await this.getOrderByIdUseCase.execute(id, req.userId);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public getUserOrders = async (req: AuthRequest, res: Response): Promise<void> => {
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

            const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : 20;
            const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : 0;

            const result = await this.getUserOrdersUseCase.execute(req.userId, limit, offset);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public updateStatus = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { id } = req.params;
            await this.updateOrderStatusUseCase.execute(id, req.body);
            res.status(200).json({ message: 'Order status updated successfully' });
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public cancel = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            await this.cancelOrderUseCase.execute(id, req.userId);
            res.status(200).json({ message: 'Order cancelled successfully' });
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public updateShippingAddress = async (req: AuthRequest, res: Response): Promise<void> => {
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
            await this.updateShippingAddressUseCase.execute(id, req.body, req.userId);
            res.status(200).json({ message: 'Shipping address updated successfully' });
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public markAsPaid = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await this.markOrderAsPaidUseCase.execute(id);
            res.status(200).json({ message: 'Order marked as paid' });
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

            const searchDto = {
                userId: req.query.userId as string | undefined,
                status: req.query.status as any,
                paymentStatus: req.query.paymentStatus as any,
                startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
                endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
                minAmount: req.query.minAmount ? Number.parseFloat(req.query.minAmount as string) : undefined,
                maxAmount: req.query.maxAmount ? Number.parseFloat(req.query.maxAmount as string) : undefined,
                limit: req.query.limit ? Number.parseInt(req.query.limit as string) : undefined,
                offset: req.query.offset ? Number.parseInt(req.query.offset as string) : undefined,
            };

            const result = await this.searchOrdersUseCase.execute(searchDto);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    private handleError(error: unknown, res: Response): void {
        if (error instanceof OrderNotFoundException) {
            res.status(404).json({ error: error.message });
        } else if (error instanceof InvalidOrderStateException) {
            res.status(400).json({ error: error.message });
        } else if (error instanceof EmptyCartException) {
            res.status(400).json({ error: error.message });
        } else if (error instanceof InsufficientStockException) {
            res.status(400).json({ error: error.message });
        } else if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}