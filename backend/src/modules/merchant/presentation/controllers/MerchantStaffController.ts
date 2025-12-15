import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../../../user/presentation/middleware/AuthMiddleware';
import { AddMerchantStaffUseCase } from '../../application/use-cases/AddMerchantStaffUseCase';
import { GetMerchantStaffUseCase } from '../../application/use-cases/GetMerchantStaffUseCase';
import { UpdateStaffRoleUseCase } from '../../application/use-cases/UpdateStaffRoleUseCase';
import { RemoveMerchantStaffUseCase } from '../../application/use-cases/RemoveMerchantStaffUseCase';
import {
    StaffNotFoundException,
    StaffAlreadyExistsException,
    UnauthorizedMerchantAccessException,
    CannotRemoveOwnerException,
} from '../../domain/exceptions/MerchantExceptions';

export class MerchantStaffController {
    constructor(
        private readonly addMerchantStaffUseCase: AddMerchantStaffUseCase,
        private readonly getMerchantStaffUseCase: GetMerchantStaffUseCase,
        private readonly updateStaffRoleUseCase: UpdateStaffRoleUseCase,
        private readonly removeMerchantStaffUseCase: RemoveMerchantStaffUseCase
    ) { }

    public addStaff = async (req: AuthRequest, res: Response): Promise<void> => {
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
            const result = await this.addMerchantStaffUseCase.execute(
                merchantId,
                req.body,
                req.userId
            );
            res.status(201).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public getStaff = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { merchantId } = req.params;
            const result = await this.getMerchantStaffUseCase.execute(merchantId);
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public updateStaff = async (req: AuthRequest, res: Response): Promise<void> => {
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

            const { staffId } = req.params;
            const result = await this.updateStaffRoleUseCase.execute(
                staffId,
                req.body,
                req.userId
            );
            res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    };

    public removeStaff = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { staffId } = req.params;
            await this.removeMerchantStaffUseCase.execute(staffId, req.userId);
            res.status(200).json({ message: 'Staff member removed successfully' });
        } catch (error) {
            this.handleError(error, res);
        }
    };

    private handleError(error: unknown, res: Response): void {
        if (error instanceof StaffNotFoundException) {
            res.status(404).json({ error: error.message });
        } else if (error instanceof StaffAlreadyExistsException) {
            res.status(409).json({ error: error.message });
        } else if (error instanceof UnauthorizedMerchantAccessException) {
            res.status(403).json({ error: error.message });
        } else if (error instanceof CannotRemoveOwnerException) {
            res.status(400).json({ error: error.message });
        } else if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}