import { body } from 'express-validator';

export class FavoriteValidator {
    static addFavoriteRules() {
        return [
            body('productId')
                .notEmpty()
                .withMessage('Product ID is required')
                .isUUID()
                .withMessage('Product ID must be a valid UUID')
        ];
    }
}