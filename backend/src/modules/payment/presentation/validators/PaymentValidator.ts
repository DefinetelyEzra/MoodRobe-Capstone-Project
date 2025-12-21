import { body, param } from 'express-validator';

export class PaymentValidator {
    public static initiatePaymentRules() {
        return [
            body('orderId')
                .notEmpty()
                .withMessage('Order ID is required')
                .isUUID()
                .withMessage('Order ID must be a valid UUID')
        ];
    }

    public static verifyPaymentRules() {
        return [
            body('reference')
                .notEmpty()
                .withMessage('Payment reference is required')
                .isString()
                .withMessage('Reference must be a string')
        ];
    }

    public static refundPaymentRules() {
        return [
            param('id')
                .notEmpty()
                .withMessage('Payment ID is required')
                .isUUID()
                .withMessage('Payment ID must be a valid UUID'),
            body('amount')
                .notEmpty()
                .withMessage('Refund amount is required')
                .isFloat({ min: 0.01 })
                .withMessage('Refund amount must be greater than 0'),
            body('reason')
                .optional()
                .isString()
                .withMessage('Reason must be a string')
                .isLength({ max: 500 })
                .withMessage('Reason must not exceed 500 characters')
        ];
    }

    public static getPaymentByIdRules() {
        return [
            param('id')
                .notEmpty()
                .withMessage('Payment ID is required')
                .isUUID()
                .withMessage('Payment ID must be a valid UUID')
        ];
    }

    public static getPaymentsByOrderIdRules() {
        return [
            param('orderId')
                .notEmpty()
                .withMessage('Order ID is required')
                .isUUID()
                .withMessage('Order ID must be a valid UUID')
        ];
    }
}