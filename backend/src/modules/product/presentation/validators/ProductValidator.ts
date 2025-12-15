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
                .isFloat({ min: 0 })
                .withMessage('Base price must be a positive number'),
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
            body('variants.*.size')
                .optional()
                .isString()
                .withMessage('Size must be a string'),
            body('variants.*.color')
                .optional()
                .isString()
                .withMessage('Color must be a string'),
            body('variants.*.price')
                .isFloat({ min: 0 })
                .withMessage('Variant price must be a positive number'),
            body('variants.*.stockQuantity')
                .isInt({ min: 0 })
                .withMessage('Stock quantity must be a non-negative integer'),
            body('images')
                .optional()
                .isArray()
                .withMessage('Images must be an array'),
            body('images.*.url')
                .optional()
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
                .isFloat({ min: 0 })
                .withMessage('Base price must be a positive number'),
            body('aestheticTags')
                .optional()
                .isArray()
                .withMessage('Aesthetic tags must be an array'),
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