import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../../../user/presentation/middleware/AuthMiddleware';
import { InitiatePaymentUseCase } from '../../application/use-cases/InitiatePaymentUseCase';
import { VerifyPaymentUseCase } from '../../application/use-cases/VerifyPaymentUseCase';
import { GetPaymentByIdUseCase } from '../../application/use-cases/GetPaymentByIdUseCase';
import { GetPaymentsByOrderIdUseCase } from '../../application/use-cases/GetPaymentsByOrderIdUseCase';
import { ProcessRefundUseCase } from '../../application/use-cases/ProcessRefundUseCase';
import { HandlePaymentWebhookUseCase } from '../../application/use-cases/HandlePaymentWebhookUseCase';
import {
    PaymentNotFoundException,
    PaymentAlreadyProcessedException,
    PaymentVerificationFailedException,
    PaymentGatewayException,
    InvalidWebhookSignatureException,
    OrderNotFoundException
} from '../../domain/exceptions/PaymentExceptions';

export class PaymentController {
    constructor(
        private readonly initiatePaymentUseCase: InitiatePaymentUseCase,
        private readonly verifyPaymentUseCase: VerifyPaymentUseCase,
        private readonly getPaymentByIdUseCase: GetPaymentByIdUseCase,
        private readonly getPaymentsByOrderIdUseCase: GetPaymentsByOrderIdUseCase,
        private readonly processRefundUseCase: ProcessRefundUseCase,
        private readonly handlePaymentWebhookUseCase: HandlePaymentWebhookUseCase
    ) { }

    public initiatePayment = async (req: AuthRequest, res: Response): Promise<void> => {
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

            const result = await this.initiatePaymentUseCase.execute(
                req.body,
                req.userId
            );

            res.status(201).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const result = await this.verifyPaymentUseCase.execute(req.body);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public getPaymentById = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { id } = req.params;
            const result = await this.getPaymentByIdUseCase.execute(id, req.userId);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public getPaymentsByOrderId = async (
        req: AuthRequest,
        res: Response
    ): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { orderId } = req.params;
            const result = await this.getPaymentsByOrderIdUseCase.execute(
                orderId,
                req.userId
            );
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public processRefund = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { id } = req.params;
            const result = await this.processRefundUseCase.execute(id, req.body);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public handleWebhook = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const signature = req.headers['x-paystack-signature'] as string;

            if (!signature) {
                res.status(400).json({ error: 'Missing signature' });
                return;
            }

            const payload = JSON.stringify(req.body);
            const result = await this.handlePaymentWebhookUseCase.execute(
                payload,
                signature
            );

            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    private handleError(error: unknown, res: Response): void {
        if (error instanceof PaymentNotFoundException) {
            res.status(404).json({ error: error.message });
        } else if (error instanceof OrderNotFoundException) {
            res.status(404).json({ error: error.message });
        } else if (error instanceof PaymentAlreadyProcessedException) {
            res.status(409).json({ error: error.message });
        } else if (error instanceof PaymentVerificationFailedException) {
            res.status(400).json({ error: error.message });
        } else if (error instanceof PaymentGatewayException) {
            res.status(502).json({ error: error.message });
        } else if (error instanceof InvalidWebhookSignatureException) {
            res.status(401).json({ error: error.message });
        } else if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}