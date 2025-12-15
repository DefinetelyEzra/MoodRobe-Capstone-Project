import { body, query, ValidationChain } from 'express-validator';

export class MerchantValidator {
    public static createRules(): ValidationChain[] {
        return [
            body('name')
                .trim()
                .notEmpty()
                .withMessage('Merchant name is required')
                .isLength({ max: 255 })
                .withMessage('Merchant name cannot exceed 255 characters'),
            body('email')
                .trim()
                .notEmpty()
                .withMessage('Email is required')
                .isEmail()
                .withMessage('Invalid email format')
                .normalizeEmail(),
            body('businessDetails')
                .optional()
                .isObject()
                .withMessage('Business details must be an object'),
            body('businessDetails.businessType')
                .optional()
                .isString()
                .withMessage('Business type must be a string'),
            body('businessDetails.phone')
                .optional()
                .matches(/^\+?[\d\s\-()]+$/)
                .withMessage('Invalid phone number format'),
            body('businessDetails.website')
                .optional()
                .isURL()
                .withMessage('Invalid website URL'),
            body('businessDetails.taxId')
                .optional()
                .isLength({ max: 50 })
                .withMessage('Tax ID cannot exceed 50 characters'),
        ];
    }

    public static updateRules(): ValidationChain[] {
        return [
            body('name')
                .optional()
                .trim()
                .notEmpty()
                .withMessage('Merchant name cannot be empty')
                .isLength({ max: 255 })
                .withMessage('Merchant name cannot exceed 255 characters'),
            body('email')
                .optional()
                .trim()
                .isEmail()
                .withMessage('Invalid email format')
                .normalizeEmail(),
            body('businessDetails')
                .optional()
                .isObject()
                .withMessage('Business details must be an object'),
            body('businessDetails.phone')
                .optional()
                .matches(/^\+?[\d\s\-()]+$/)
                .withMessage('Invalid phone number format'),
            body('businessDetails.website')
                .optional()
                .isURL()
                .withMessage('Invalid website URL'),
        ];
    }

    public static addStaffRules(): ValidationChain[] {
        return [
            body('userId')
                .notEmpty()
                .withMessage('User ID is required')
                .isUUID()
                .withMessage('User ID must be a valid UUID'),
            body('role')
                .notEmpty()
                .withMessage('Role is required')
                .isIn(['owner', 'admin', 'manager', 'staff'])
                .withMessage('Invalid role'),
        ];
    }

    public static updateStaffRules(): ValidationChain[] {
        return [
            body('role')
                .optional()
                .isIn(['owner', 'admin', 'manager', 'staff'])
                .withMessage('Invalid role'),
            body('permissions')
                .optional()
                .isObject()
                .withMessage('Permissions must be an object'),
            body('permissions.canManageProducts')
                .optional()
                .isBoolean()
                .withMessage('canManageProducts must be a boolean'),
            body('permissions.canManageOrders')
                .optional()
                .isBoolean()
                .withMessage('canManageOrders must be a boolean'),
            body('permissions.canManageStaff')
                .optional()
                .isBoolean()
                .withMessage('canManageStaff must be a boolean'),
            body('permissions.canViewAnalytics')
                .optional()
                .isBoolean()
                .withMessage('canViewAnalytics must be a boolean'),
            body('permissions.canManageSettings')
                .optional()
                .isBoolean()
                .withMessage('canManageSettings must be a boolean'),
        ];
    }

    public static queryRules(): ValidationChain[] {
        return [
            query('limit')
                .optional()
                .isInt({ min: 1, max: 100 })
                .withMessage('Limit must be between 1 and 100'),
            query('offset')
                .optional()
                .isInt({ min: 0 })
                .withMessage('Offset must be a non-negative integer'),
            query('activeOnly')
                .optional()
                .isBoolean()
                .withMessage('activeOnly must be a boolean'),
        ];
    }
}