import { body, ValidationChain } from 'express-validator';

export class UserValidator {
    public static registerRules(): ValidationChain[] {
        return [
            body('name')
                .trim()
                .notEmpty()
                .withMessage('Name is required')
                .isLength({ max: 255 })
                .withMessage('Name cannot exceed 255 characters'),
            body('email')
                .trim()
                .notEmpty()
                .withMessage('Email is required')
                .isEmail()
                .withMessage('Invalid email format')
                .normalizeEmail(),
            body('password')
                .notEmpty()
                .withMessage('Password is required')
                .isLength({ min: 8 })
                .withMessage('Password must be at least 8 characters long')
                .matches(/[A-Z]/)
                .withMessage('Password must contain at least one uppercase letter')
                .matches(/[a-z]/)
                .withMessage('Password must contain at least one lowercase letter')
                .matches(/\d/)
                .withMessage('Password must contain at least one number'),
        ];
    }

    public static loginRules(): ValidationChain[] {
        return [
            body('email')
                .trim()
                .notEmpty()
                .withMessage('Email is required')
                .isEmail()
                .withMessage('Invalid email format')
                .normalizeEmail(),
            body('password')
                .notEmpty()
                .withMessage('Password is required'),
        ];
    }

    public static updateRules(): ValidationChain[] {
        return [
            body('name')
                .optional()
                .trim()
                .notEmpty()
                .withMessage('Name cannot be empty')
                .isLength({ max: 255 })
                .withMessage('Name cannot exceed 255 characters'),
            body('email')
                .optional()
                .trim()
                .isEmail()
                .withMessage('Invalid email format')
                .normalizeEmail(),
        ];
    }

    public static updatePasswordRules(): ValidationChain[] {
        return [
            body('currentPassword')
                .notEmpty()
                .withMessage('Current password is required'),
            body('newPassword')
                .notEmpty()
                .withMessage('New password is required')
                .isLength({ min: 8 })
                .withMessage('Password must be at least 8 characters long')
                .matches(/[A-Z]/)
                .withMessage('Password must contain at least one uppercase letter')
                .matches(/[a-z]/)
                .withMessage('Password must contain at least one lowercase letter')
                .matches(/\d/)
                .withMessage('Password must contain at least one number'),
        ];
    }

    public static selectAestheticRules(): ValidationChain[] {
        return [
            body('aestheticId')
                .notEmpty()
                .withMessage('Aesthetic ID is required')
                .isUUID()
                .withMessage('Invalid aesthetic ID format'),
        ];
    }
}