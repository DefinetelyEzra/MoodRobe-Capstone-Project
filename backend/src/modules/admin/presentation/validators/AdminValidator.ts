import { body } from 'express-validator';

export class AdminValidator {
    public static createCarouselRules() {
        return [
            body('imageUrl')
                .notEmpty()
                .withMessage('Image URL is required')
                .isURL()
                .withMessage('Invalid image URL'),
            body('title')
                .optional({ values: 'falsy' })
                .isString()
                .withMessage('Title must be a string')
                .isLength({ max: 255 })
                .withMessage('Title cannot exceed 255 characters'),
            body('subtitle')
                .optional({ values: 'falsy' })
                .isString()
                .withMessage('Subtitle must be a string')
                .isLength({ max: 255 })
                .withMessage('Subtitle cannot exceed 255 characters'),
            body('linkUrl')
                .optional({ values: 'falsy' })
                .isURL()
                .withMessage('Invalid link URL'),
            body('displayOrder')
                .optional()
                .isInt({ min: 0 })
                .withMessage('Display order must be a non-negative integer')
        ];
    }

    public static updateCarouselRules() {
        return [
            body('imageUrl')
                .optional()
                .isURL()
                .withMessage('Invalid image URL'),
            body('title')
                .optional({ values: 'falsy' })
                .isString()
                .isLength({ max: 255 })
                .withMessage('Title cannot exceed 255 characters'),
            body('subtitle')
                .optional({ values: 'falsy' })
                .isString()
                .isLength({ max: 255 })
                .withMessage('Subtitle cannot exceed 255 characters'),
            body('linkUrl')
                .optional({ values: 'falsy' })
                .isURL()
                .withMessage('Invalid link URL'),
            body('displayOrder')
                .optional()
                .isInt({ min: 0 })
                .withMessage('Display order must be a non-negative integer'),
            body('isActive')
                .optional()
                .isBoolean()
                .withMessage('isActive must be a boolean')
        ];
    }

    public static updateContentRules() {
        return [
            body('content')
                .notEmpty()
                .withMessage('Content is required')
                .isString()
                .withMessage('Content must be a string'),
            body('metadata')
                .optional()
                .isObject()
                .withMessage('Metadata must be an object')
        ];
    }

    public static updateAestheticImageRules() {
        return [
            body('imageUrl')
                .notEmpty()
                .withMessage('Image URL is required')
                .isString()
                .withMessage('Image URL must be a string')
                .isURL()
                .withMessage('Invalid image URL')
        ];
    }
}