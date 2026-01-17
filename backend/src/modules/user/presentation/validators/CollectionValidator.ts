import { body } from 'express-validator';

export class CollectionValidator {
    static createCollectionRules() {
        return [
            body('name')
                .notEmpty()
                .withMessage('Collection name is required')
                .isLength({ max: 255 })
                .withMessage('Collection name cannot exceed 255 characters'),
            body('description')
                .optional()
                .isString()
                .withMessage('Description must be a string'),
            body('isPublic')
                .optional()
                .isBoolean()
                .withMessage('isPublic must be a boolean')
        ];
    }

    static updateCollectionRules() {
        return [
            body('name')
                .optional()
                .isLength({ max: 255 })
                .withMessage('Collection name cannot exceed 255 characters'),
            body('description')
                .optional()
                .isString()
                .withMessage('Description must be a string'),
            body('isPublic')
                .optional()
                .isBoolean()
                .withMessage('isPublic must be a boolean')
        ];
    }

    static addToCollectionRules() {
        return [
            body('productId')
                .notEmpty()
                .withMessage('Product ID is required')
                .isUUID()
                .withMessage('Product ID must be a valid UUID')
        ];
    }
}