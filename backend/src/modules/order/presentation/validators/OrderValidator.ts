import { body, query, ValidationChain } from 'express-validator';

export class OrderValidator {
    public static createRules(): ValidationChain[] {
        return [
            body('shippingAddress')
                .notEmpty()
                .withMessage('Shipping address is required')
                .isObject()
                .withMessage('Shipping address must be an object'),
            body('shippingAddress.street')
                .trim()
                .notEmpty()
                .withMessage('Street address is required'),
            body('shippingAddress.city')
                .trim()
                .notEmpty()
                .withMessage('City is required'),
            body('shippingAddress.state')
                .trim()
                .notEmpty()
                .withMessage('State is required'),
            body('shippingAddress.country')
                .trim()
                .notEmpty()
                .withMessage('Country is required'),
            body('shippingAddress.postalCode')
                .trim()
                .notEmpty()
                .withMessage('Postal code is required'),
            body('shippingAddress.additionalInfo')
                .optional()
                .isString()
                .withMessage('Additional info must be a string'),
            body('discountPercentage')
                .optional()
                .isFloat({ min: 0, max: 100 })
                .withMessage('Discount percentage must be between 0 and 100'),
        ];
    }

    public static updateShippingAddressRules(): ValidationChain[] {
        return [
            body('shippingAddress')
                .notEmpty()
                .withMessage('Shipping address is required')
                .isObject()
                .withMessage('Shipping address must be an object'),
            body('shippingAddress.street')
                .trim()
                .notEmpty()
                .withMessage('Street address is required'),
            body('shippingAddress.city')
                .trim()
                .notEmpty()
                .withMessage('City is required'),
            body('shippingAddress.state')
                .trim()
                .notEmpty()
                .withMessage('State is required'),
            body('shippingAddress.country')
                .trim()
                .notEmpty()
                .withMessage('Country is required'),
            body('shippingAddress.postalCode')
                .trim()
                .notEmpty()
                .withMessage('Postal code is required'),
        ];
    }

    public static updateStatusRules(): ValidationChain[] {
        return [
            body('status')
                .notEmpty()
                .withMessage('Status is required')
                .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
                .withMessage('Invalid order status'),
        ];
    }

    public static searchRules(): ValidationChain[] {
        return [
            query('userId')
                .optional()
                .isUUID()
                .withMessage('User ID must be a valid UUID'),
            query('status')
                .optional()
                .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
                .withMessage('Invalid order status'),
            query('paymentStatus')
                .optional()
                .isIn(['pending', 'paid', 'failed', 'refunded'])
                .withMessage('Invalid payment status'),
            query('startDate')
                .optional()
                .isISO8601()
                .withMessage('Start date must be a valid ISO 8601 date'),
            query('endDate')
                .optional()
                .isISO8601()
                .withMessage('End date must be a valid ISO 8601 date'),
            query('minAmount')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Min amount must be a positive number'),
            query('maxAmount')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Max amount must be a positive number'),
            query('limit')
                .optional()
                .isInt({ min: 1, max: 100 })
                .withMessage('Limit must be between 1 and 100'),
            query('offset')
                .optional()
                .isInt({ min: 0 })
                .withMessage('Offset must be a non-negative integer'),
        ];
    }

    public static paginationRules(): ValidationChain[] {
        return [
            query('limit')
                .optional()
                .isInt({ min: 1, max: 100 })
                .withMessage('Limit must be between 1 and 100'),
            query('offset')
                .optional()
                .isInt({ min: 0 })
                .withMessage('Offset must be a non-negative integer'),
        ];
    }
}