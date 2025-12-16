import { Order, OrderStatus, PaymentStatus } from '../entities/Order';

export interface OrderSearchCriteria {
    userId?: string;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    startDate?: Date;
    endDate?: Date;
    minAmount?: number;
    maxAmount?: number;
}

export interface IOrderRepository {
    save(order: Order): Promise<Order>;
    findById(id: string): Promise<Order | null>;
    findByOrderNumber(orderNumber: string): Promise<Order | null>;
    findByUserId(userId: string, limit?: number, offset?: number): Promise<Order[]>;
    search(criteria: OrderSearchCriteria, limit?: number, offset?: number): Promise<Order[]>;
    update(order: Order): Promise<Order>;
    delete(id: string): Promise<void>;
    count(criteria?: OrderSearchCriteria): Promise<number>;
    existsByOrderNumber(orderNumber: string): Promise<boolean>;
}