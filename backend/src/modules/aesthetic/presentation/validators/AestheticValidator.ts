import { body, query, ValidationChain } from 'express-validator';

export class AestheticValidator {
    public static createRules(): ValidationChain[] {
        return [
            body('name')
                .trim()
                .notEmpty()
                .withMessage('Name is required')
                .isLength({ max: 100 })
                .withMessage('Name cannot exceed 100 characters'),
            body('description')
                .trim()
                .notEmpty()
                .withMessage('Description is required')
                .isLength({ max: 1000 })
                .withMessage('Description cannot exceed 1000 characters'),
            body('themeProperties')
                .notEmpty()
                .withMessage('Theme properties are required')
                .isObject()
                .withMessage('Theme properties must be an object'),
            body('themeProperties.colors')
                .isArray({ min: 1 })
                .withMessage('At least one color is required'),
            body('themeProperties.style')
                .notEmpty()
                .withMessage('Style is required'),
            body('imageUrl')
                .optional()
                .isURL()
                .withMessage('Image URL must be valid')
                .isLength({ max: 500 })
                .withMessage('Image URL cannot exceed 500 characters'),
        ];
    }

    public static updateRules(): ValidationChain[] {
        return [
            body('name')
                .optional()
                .trim()
                .notEmpty()
                .withMessage('Name cannot be empty')
                .isLength({ max: 100 })
                .withMessage('Name cannot exceed 100 characters'),
            body('description')
                .optional()
                .trim()
                .notEmpty()
                .withMessage('Description cannot be empty')
                .isLength({ max: 1000 })
                .withMessage('Description cannot exceed 1000 characters'),
            body('themeProperties')
                .optional()
                .isObject()
                .withMessage('Theme properties must be an object'),
            body('themeProperties.colors')
                .optional()
                .isArray({ min: 1 })
                .withMessage('At least one color is required'),
            body('themeProperties.style')
                .optional()
                .notEmpty()
                .withMessage('Style cannot be empty'),
            body('imageUrl')
                .optional()
                .isURL()
                .withMessage('Image URL must be valid')
                .isLength({ max: 500 })
                .withMessage('Image URL cannot exceed 500 characters'),
        ];
    }

    public static searchRules(): ValidationChain[] {
        return [
            query('keyword')
                .trim()
                .notEmpty()
                .withMessage('Search keyword is required')
                .isLength({ min: 2 })
                .withMessage('Keyword must be at least 2 characters'),
        ];
    }

    public static submitQuizRules(): ValidationChain[] {
        return [
            body('answers')
                .isArray({ min: 1 })
                .withMessage('Answers array is required'),
            body('answers.*.questionId')
                .notEmpty()
                .withMessage('Question ID is required for each answer'),
            body('answers.*.optionId')
                .notEmpty()
                .withMessage('Option ID is required for each answer'),
        ];
    }
}