import { body, query, ValidationChain } from 'express-validator';

export class ProductValidator {
    public static createRules(): ValidationChain[] {
        return [
            body('name')
                .trim()
                .notEmpty()
                .withMessage('Product name is required')
                .isLength({ max: 255 })
                .withMessage('Product name cannot exceed 255 characters'),
            body('description')
                .trim()
                .notEmpty()
                .withMessage('Description is required'),
            body('category')
                .trim()
                .notEmpty()
                .withMessage('Category is required')
                .isLength({ max: 100 })
                .withMessage('Category cannot exceed 100 characters'),
            body('basePrice')
                .optional()
                .custom((value) => {
                    if (typeof value === 'object' && value.amount !== undefined) {
                        return true;
                    }
                    if (typeof value === 'number') {
                        return true;
                    }
                    throw new Error('Base price must be a number or price object');
                }),
            body('basePrice.amount')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Base price amount must be a positive number'),
            body('basePrice.currency')
                .optional()
                .isLength({ min: 3, max: 3 })
                .withMessage('Currency must be a 3-letter code'),
            body('currency')
                .optional()
                .isLength({ min: 3, max: 3 })
                .withMessage('Currency must be a 3-letter code'),
            body('aestheticTags')
                .optional()
                .isArray()
                .withMessage('Aesthetic tags must be an array'),
            body('variants')
                .isArray({ min: 1 })
                .withMessage('At least one variant is required'),
            body('variants.*.sku')
                .notEmpty()
                .withMessage('SKU is required for each variant')
                .isLength({ max: 100 })
                .withMessage('SKU cannot exceed 100 characters'),
            body('variants.*.name')
                .notEmpty()
                .withMessage('Variant name is required'),
            body('variants.*.price')
                .custom((value) => {
                    if (typeof value === 'object' && value.amount !== undefined) {
                        return true;
                    }
                    if (typeof value === 'number') {
                        return true;
                    }
                    throw new Error('Variant price must be a number or price object');
                }),
            body('variants.*.price.amount')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Variant price amount must be a positive number'),
            body('variants.*.price.currency')
                .optional()
                .isLength({ min: 3, max: 3 })
                .withMessage('Currency must be a 3-letter code'),
            body('variants.*.stockQuantity')
                .isInt({ min: 0 })
                .withMessage('Stock quantity must be a non-negative integer'),
            body('variants.*.attributes')
                .optional()
                .isObject()
                .withMessage('Attributes must be an object'),
            body('images')
                .optional()
                .isArray()
                .withMessage('Images must be an array'),
            body('images.*.imageUrl')
                .optional()
                .notEmpty()
                .withMessage('Image URL is required')
                .isURL()
                .withMessage('Image URL must be valid'),
            body('images.*.isPrimary')
                .optional()
                .isBoolean()
                .withMessage('isPrimary must be a boolean'),
            body('images.*.displayOrder')
                .optional()
                .isInt({ min: 0 })
                .withMessage('Display order must be a non-negative integer'),
        ];
    }

    public static updateRules(): ValidationChain[] {
        return [
            body('name')
                .optional()
                .trim()
                .notEmpty()
                .withMessage('Product name cannot be empty')
                .isLength({ max: 255 })
                .withMessage('Product name cannot exceed 255 characters'),
            body('description')
                .optional()
                .trim(),
            body('category')
                .optional()
                .trim()
                .notEmpty()
                .withMessage('Category cannot be empty')
                .isLength({ max: 100 })
                .withMessage('Category cannot exceed 100 characters'),
            body('basePrice')
                .optional()
                .custom((value) => {
                    if (typeof value === 'object' && value.amount !== undefined) {
                        return true;
                    }
                    if (typeof value === 'number') {
                        return true;
                    }
                    throw new Error('Base price must be a number or price object');
                }),
            body('basePrice.amount')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Base price amount must be a positive number'),
            body('basePrice.currency')
                .optional()
                .isLength({ min: 3, max: 3 })
                .withMessage('Currency must be a 3-letter code'),
            body('aestheticTags')
                .optional()
                .isArray()
                .withMessage('Aesthetic tags must be an array'),
            body('variants')
                .optional()
                .isArray()
                .withMessage('Variants must be an array'),
            body('variants.*.id')
                .optional()
                .isUUID()
                .withMessage('Variant ID must be a valid UUID'),
            body('variants.*.sku')
                .optional()
                .notEmpty()
                .withMessage('SKU cannot be empty')
                .isLength({ max: 100 })
                .withMessage('SKU cannot exceed 100 characters'),
            body('variants.*.name')
                .optional()
                .notEmpty()
                .withMessage('Variant name cannot be empty'),
            body('variants.*.price')
                .optional()
                .custom((value) => {
                    if (typeof value === 'object' && value.amount !== undefined) {
                        return true;
                    }
                    if (typeof value === 'number') {
                        return true;
                    }
                    throw new Error('Variant price must be a number or price object');
                }),
            body('variants.*.price.amount')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Variant price amount must be a positive number'),
            body('variants.*.price.currency')
                .optional()
                .isLength({ min: 3, max: 3 })
                .withMessage('Currency must be a 3-letter code'),
            body('variants.*.stockQuantity')
                .optional()
                .isInt({ min: 0 })
                .withMessage('Stock quantity must be a non-negative integer'),
            body('images')
                .optional()
                .isArray()
                .withMessage('Images must be an array'),
            body('images.*.id')
                .optional()
                .isUUID()
                .withMessage('Image ID must be a valid UUID'),
            body('images.*.imageUrl')
                .optional()
                .notEmpty()
                .withMessage('Image URL cannot be empty')
                .isURL()
                .withMessage('Image URL must be valid'),
            body('images.*.isPrimary')
                .optional()
                .isBoolean()
                .withMessage('isPrimary must be a boolean'),
            body('images.*.displayOrder')
                .optional()
                .isInt({ min: 0 })
                .withMessage('Display order must be a non-negative integer'),
        ];
    }

    public static updateStockRules(): ValidationChain[] {
        return [
            body('stockQuantity')
                .isInt({ min: 0 })
                .withMessage('Stock quantity must be a non-negative integer'),
        ];
    }

    public static addImageRules(): ValidationChain[] {
        return [
            body('url')
                .notEmpty()
                .withMessage('Image URL is required')
                .isURL()
                .withMessage('Image URL must be valid'),
            body('isPrimary')
                .optional()
                .isBoolean()
                .withMessage('isPrimary must be a boolean'),
            body('displayOrder')
                .optional()
                .isInt({ min: 0 })
                .withMessage('Display order must be a non-negative integer'),
        ];
    }

    public static searchRules(): ValidationChain[] {
        return [
            query('merchantId')
                .optional()
                .isUUID()
                .withMessage('Merchant ID must be a valid UUID'),
            query('category')
                .optional()
                .isString()
                .withMessage('Category must be a string'),
            query('aestheticTags')
                .optional()
                .custom((value) => {
                    if (typeof value === 'string') {
                        return true;
                    }
                    if (Array.isArray(value)) {
                        return value.every((tag) => typeof tag === 'string');
                    }
                    return false;
                })
                .withMessage('Aesthetic tags must be a string or array of strings'),
            query('minPrice')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Min price must be a positive number'),
            query('maxPrice')
                .optional()
                .isFloat({ min: 0 })
                .withMessage('Max price must be a positive number'),
            query('isActive')
                .optional()
                .isBoolean()
                .withMessage('isActive must be a boolean'),
            query('searchTerm')
                .optional()
                .isString()
                .withMessage('Search term must be a string'),
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