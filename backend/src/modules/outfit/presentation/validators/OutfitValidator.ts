import { body, ValidationChain } from 'express-validator';

export class OutfitValidator {
    public static createRules(): ValidationChain[] {
        return [
            body('name')
                .trim()
                .notEmpty()
                .withMessage('Outfit name is required')
                .isLength({ max: 255 })
                .withMessage('Outfit name cannot exceed 255 characters'),
            body('description')
                .optional()
                .trim(),
            body('outfitType')
                .isIn(['full', 'dress', 'casual', 'formal'])
                .withMessage('Invalid outfit type'),
            body('items')
                .isObject()
                .withMessage('Items must be an object')
                .custom((items) => Object.keys(items).length > 0)
                .withMessage('Outfit must have at least one item'),
            body('aestheticTags')
                .optional()
                .isArray()
                .withMessage('Aesthetic tags must be an array'),
            body('isPublic')
                .optional()
                .isBoolean()
                .withMessage('isPublic must be a boolean'),
        ];
    }

    public static updateRules(): ValidationChain[] {
        return [
            body('name')
                .optional()
                .trim()
                .notEmpty()
                .withMessage('Outfit name cannot be empty')
                .isLength({ max: 255 })
                .withMessage('Outfit name cannot exceed 255 characters'),
            body('description')
                .optional()
                .trim(),
            body('outfitType')
                .optional()
                .isIn(['full', 'dress', 'casual', 'formal'])
                .withMessage('Invalid outfit type'),
            body('items')
                .optional()
                .isObject()
                .withMessage('Items must be an object'),
            body('aestheticTags')
                .optional()
                .isArray()
                .withMessage('Aesthetic tags must be an array'),
            body('isPublic')
                .optional()
                .isBoolean()
                .withMessage('isPublic must be a boolean'),
        ];
    }
}