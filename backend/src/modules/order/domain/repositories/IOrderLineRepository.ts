import { OrderLine } from '../entities/OrderLine';

export interface IOrderLineRepository {
    save(orderLine: OrderLine): Promise<OrderLine>;
    saveMany(orderLines: OrderLine[]): Promise<OrderLine[]>;
    findById(id: string): Promise<OrderLine | null>;
    findByOrderId(orderId: string): Promise<OrderLine[]>;
    update(orderLine: OrderLine): Promise<OrderLine>;
    delete(id: string): Promise<void>;
    deleteByOrderId(orderId: string): Promise<void>;
}