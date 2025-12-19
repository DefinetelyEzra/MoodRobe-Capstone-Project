import { Response, NextFunction } from 'express';
import { AuthRequest } from '@modules/user/presentation/middleware/AuthMiddleware';
import { ForbiddenException } from '@modules/admin/domain/exceptions/AdminExceptions';
import { TypeOrmUserRepository } from '@modules/user/infrastructure/persistence/repositories/TypeOrmUserRepository';

export class AdminMiddleware {
    private static readonly ADMIN_EMAIL = 'ezraagun@gmail.com';

    public static async verifyAdmin(
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            // Get user email from database
            const userRepository = new TypeOrmUserRepository();
            const user = await userRepository.findById(req.userId);

            if (!user) {
                res.status(401).json({ error: 'User not found' });
                return;
            }

            // Check if user email matches admin email
            if (user.getEmail() !== AdminMiddleware.ADMIN_EMAIL) {
                throw new ForbiddenException('Access denied. Admin privileges required.');
            }

            // User is admin, proceed
            next();
        } catch (error) {
            if (error instanceof ForbiddenException) {
                res.status(403).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    public static checkAdminEmail(email: string): boolean {
        return email === AdminMiddleware.ADMIN_EMAIL;
    }
}