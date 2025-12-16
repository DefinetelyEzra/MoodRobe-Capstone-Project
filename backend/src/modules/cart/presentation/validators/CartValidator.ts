import { body, ValidationChain } from 'express-validator';

export class CartValidator {
    public static addToCartRules(): ValidationChain[] {
        return [
            body('productVariantId')
                .notEmpty()
                .withMessage('Product variant ID is required')
                .isUUID()
                .withMessage('Product variant ID must be a valid UUID'),
            body('quantity')
                .notEmpty()
                .withMessage('Quantity is required')
                .isInt({ min: 1, max: 999 })
                .withMessage('Quantity must be between 1 and 999'),
        ];
    }

    public static updateQuantityRules(): ValidationChain[] {
        return [
            body('quantity')
                .notEmpty()
                .withMessage('Quantity is required')
                .isInt({ min: 1, max: 999 })
                .withMessage('Quantity must be between 1 and 999'),
        ];
    }
}