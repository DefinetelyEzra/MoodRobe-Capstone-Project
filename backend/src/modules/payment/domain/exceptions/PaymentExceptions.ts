export class PaymentNotFoundException extends Error {
    constructor(paymentId: string) {
        super(`Payment with ID ${paymentId} not found`);
        this.name = 'PaymentNotFoundException';
    }
}

export class PaymentAlreadyProcessedException extends Error {
    constructor(paymentId: string) {
        super(`Payment ${paymentId} has already been processed`);
        this.name = 'PaymentAlreadyProcessedException';
    }
}

export class InvalidPaymentStatusException extends Error {
    constructor(currentStatus: string, action: string) {
        super(`Cannot ${action} payment with status: ${currentStatus}`);
        this.name = 'InvalidPaymentStatusException';
    }
}

export class PaymentVerificationFailedException extends Error {
    constructor(reason: string) {
        super(`Payment verification failed: ${reason}`);
        this.name = 'PaymentVerificationFailedException';
    }
}

export class RefundAmountExceededException extends Error {
    constructor(requestedAmount: number, availableAmount: number) {
        super(
            `Refund amount ${requestedAmount} exceeds available amount ${availableAmount}`
        );
        this.name = 'RefundAmountExceededException';
    }
}

export class PaymentGatewayException extends Error {
    constructor(provider: string, message: string) {
        super(`${provider} error: ${message}`);
        this.name = 'PaymentGatewayException';
    }
}

export class InvalidWebhookSignatureException extends Error {
    constructor() {
        super('Invalid webhook signature');
        this.name = 'InvalidWebhookSignatureException';
    }
}

export class DuplicatePaymentException extends Error {
    constructor(reference: string) {
        super(`Payment with reference ${reference} already exists`);
        this.name = 'DuplicatePaymentException';
    }
}

export class OrderNotFoundException extends Error {
    constructor(orderId: string) {
        super(`Order with ID ${orderId} not found`);
        this.name = 'OrderNotFoundException';
    }
}

export class PaymentAmountMismatchException extends Error {
    constructor(expectedAmount: number, actualAmount: number) {
        super(
            `Payment amount mismatch. Expected: ${expectedAmount}, Actual: ${actualAmount}`
        );
        this.name = 'PaymentAmountMismatchException';
    }
}