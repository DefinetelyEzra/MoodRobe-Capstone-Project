import { OrderLine } from './OrderLine';
import { Address } from '../value-objects/Address';
import { OrderTotal } from '../value-objects/OrderTotal';

export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderProps {
    id: string;
    userId: string;
    orderNumber: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    total: OrderTotal;
    shippingAddress: Address;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Order {
    private orderLines: OrderLine[] = [];

    private constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly orderNumber: string,
        public status: OrderStatus,
        public paymentStatus: PaymentStatus,
        public readonly total: OrderTotal, // Changed to public readonly
        public shippingAddress: Address,
        public readonly createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) { }

    public static create(
        id: string,
        userId: string,
        orderNumber: string,
        total: OrderTotal,
        shippingAddress: Address
    ): Order {
        return new Order(
            id,
            userId,
            orderNumber,
            'pending',
            'pending',
            total,
            shippingAddress
        );
    }

    public static reconstitute(props: OrderProps): Order {
        const {
            id,
            userId,
            orderNumber,
            status,
            paymentStatus,
            total,
            shippingAddress,
            createdAt = new Date(),
            updatedAt = new Date()
        } = props;

        return new Order(
            id,
            userId,
            orderNumber,
            status,
            paymentStatus,
            total,
            shippingAddress,
            createdAt,
            updatedAt
        );
    }

    public addOrderLine(orderLine: OrderLine): void {
        this.orderLines.push(orderLine);
    }

    public setOrderLines(orderLines: OrderLine[]): void {
        this.orderLines = orderLines;
    }

    public getOrderLines(): OrderLine[] {
        return [...this.orderLines];
    }

    public confirm(): void {
        if (this.status !== 'pending') {
            throw new Error('Only pending orders can be confirmed');
        }
        this.status = 'confirmed';
        this.updatedAt = new Date();
    }

    public startProcessing(): void {
        if (this.status !== 'confirmed') {
            throw new Error('Only confirmed orders can be processed');
        }
        this.status = 'processing';
        this.updatedAt = new Date();
    }

    public ship(): void {
        if (this.status !== 'processing') {
            throw new Error('Only processing orders can be shipped');
        }
        this.status = 'shipped';
        this.updatedAt = new Date();
    }

    public deliver(): void {
        if (this.status !== 'shipped') {
            throw new Error('Only shipped orders can be delivered');
        }
        this.status = 'delivered';
        this.updatedAt = new Date();
    }

    public cancel(): void {
        if (['delivered', 'cancelled', 'refunded'].includes(this.status)) {
            throw new Error(`Cannot cancel order with status: ${this.status}`);
        }
        this.status = 'cancelled';
        this.updatedAt = new Date();
    }

    public markAsPaid(): void {
        if (this.paymentStatus === 'paid') {
            throw new Error('Order is already paid');
        }
        this.paymentStatus = 'paid';
        this.updatedAt = new Date();
    }

    public markPaymentFailed(): void {
        this.paymentStatus = 'failed';
        this.updatedAt = new Date();
    }

    public refund(): void {
        if (this.paymentStatus !== 'paid') {
            throw new Error('Only paid orders can be refunded');
        }
        this.paymentStatus = 'refunded';
        this.status = 'refunded';
        this.updatedAt = new Date();
    }

    public getTotal(): OrderTotal {
        return this.total;
    }

    public updateShippingAddress(address: Address): void {
        if (!['pending', 'confirmed'].includes(this.status)) {
            throw new Error('Cannot update address for orders that are being processed or shipped');
        }
        this.shippingAddress = address;
        this.updatedAt = new Date();
    }

    public canBeCancelled(): boolean {
        return !['delivered', 'cancelled', 'refunded'].includes(this.status);
    }

    public canBeRefunded(): boolean {
        return this.paymentStatus === 'paid' && ['delivered', 'shipped'].includes(this.status);
    }

    public calculateTotalQuantity(): number {
        return this.orderLines.reduce((sum, line) => sum + line.quantity, 0);
    }
}