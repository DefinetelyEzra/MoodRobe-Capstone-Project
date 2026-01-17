import { body } from 'express-validator';

export class StyleBoardValidator {
    static createStyleBoardRules() {
        return [
            body('name')
                .notEmpty()
                .withMessage('Style board name is required')
                .isLength({ max: 255 })
                .withMessage('Style board name cannot exceed 255 characters'),
            body('description')
                .optional()
                .isString()
                .withMessage('Description must be a string'),
            body('aestheticTags')
                .optional()
                .isArray()
                .withMessage('Aesthetic tags must be an array'),
            body('aestheticTags.*')
                .optional()
                .isUUID()
                .withMessage('Each aesthetic tag must be a valid UUID'),
            body('isPublic')
                .optional()
                .isBoolean()
                .withMessage('isPublic must be a boolean')
        ];
    }

    static updateStyleBoardRules() {
        return [
            body('name')
                .optional()
                .isLength({ max: 255 })
                .withMessage('Style board name cannot exceed 255 characters'),
            body('description')
                .optional()
                .isString()
                .withMessage('Description must be a string'),
            body('aestheticTags')
                .optional()
                .isArray()
                .withMessage('Aesthetic tags must be an array'),
            body('isPublic')
                .optional()
                .isBoolean()
                .withMessage('isPublic must be a boolean')
        ];
    }

    static addItemRules() {
        return [
            body('productId')
                .notEmpty()
                .withMessage('Product ID is required')
                .isUUID()
                .withMessage('Product ID must be a valid UUID'),
            body('position')
                .optional()
                .isObject()
                .withMessage('Position must be an object'),
            body('position.x')
                .optional()
                .isNumeric()
                .withMessage('Position x must be a number'),
            body('position.y')
                .optional()
                .isNumeric()
                .withMessage('Position y must be a number'),
            body('note')
                .optional()
                .isString()
                .withMessage('Note must be a string')
        ];
    }

    static updateItemRules() {
        return [
            body('position')
                .optional()
                .isObject()
                .withMessage('Position must be an object'),
            body('note')
                .optional()
                .isString()
                .withMessage('Note must be a string')
        ];
    }
}