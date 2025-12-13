import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '../../domain/exceptions/UserExceptions';

export interface AuthRequest extends Request {
    userId?: string;
}

export class AuthMiddleware {
    public static authenticate(
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ): void {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader?.startsWith('Bearer ')) {
                throw new UnauthorizedException('No token provided or invalid format');
            }

            const token = authHeader.substring(7);
            const secret = process.env.JWT_SECRET;

            if (!secret) {
                throw new Error('JWT_SECRET is not configured');
            }

            const decoded = jwt.verify(token, secret) as { userId: string };
            req.userId = decoded.userId;

            next();
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                res.status(401).json({ error: 'Invalid token' });
            } else if (error instanceof UnauthorizedException) {
                res.status(401).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
}