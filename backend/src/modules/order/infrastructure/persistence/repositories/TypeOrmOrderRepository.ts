import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../../config/database';
import { IOrderRepository, OrderSearchCriteria } from '../../../domain/repositories/IOrderRepository';
import { Order } from '../../../domain/entities/Order';
import { OrderEntity } from '../../entities/OrderEntity';
import { OrderMapper } from '../mappers/OrderMapper';

export class TypeOrmOrderRepository implements IOrderRepository {
    private readonly repository: Repository<OrderEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(OrderEntity);
    }

    public async save(order: Order): Promise<Order> {
        const entity = OrderMapper.toEntity(order);
        const savedEntity = await this.repository.save(entity);
        return OrderMapper.toDomain(savedEntity);
    }

    public async findById(id: string): Promise<Order | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? OrderMapper.toDomain(entity) : null;
    }

    public async findByOrderNumber(orderNumber: string): Promise<Order | null> {
        const entity = await this.repository.findOne({ where: { orderNumber } });
        return entity ? OrderMapper.toDomain(entity) : null;
    }

    public async findByUserId(
        userId: string,
        limit: number = 20,
        offset: number = 0
    ): Promise<Order[]> {
        const entities = await this.repository.find({
            where: { userId },
            take: limit,
            skip: offset,
            order: { createdAt: 'DESC' },
        });
        return entities.map((entity) => OrderMapper.toDomain(entity));
    }

    public async search(
        criteria: OrderSearchCriteria,
        limit: number = 20,
        offset: number = 0
    ): Promise<Order[]> {
        const query = this.repository.createQueryBuilder('order');

        if (criteria.userId) {
            query.andWhere('order.user_id = :userId', { userId: criteria.userId });
        }

        if (criteria.status) {
            query.andWhere('order.status = :status', { status: criteria.status });
        }

        if (criteria.paymentStatus) {
            // Note: Payment status logic would need to be adjusted based on your implementation
            query.andWhere('order.status IN (:...statuses)', {
                statuses: this.getStatusesForPaymentStatus(criteria.paymentStatus),
            });
        }

        if (criteria.startDate && criteria.endDate) {
            query.andWhere('order.created_at BETWEEN :startDate AND :endDate', {
                startDate: criteria.startDate,
                endDate: criteria.endDate,
            });
        } else if (criteria.startDate) {
            query.andWhere('order.created_at >= :startDate', {
                startDate: criteria.startDate,
            });
        } else if (criteria.endDate) {
            query.andWhere('order.created_at <= :endDate', {
                endDate: criteria.endDate,
            });
        }

        if (criteria.minAmount !== undefined) {
            query.andWhere('order.total_amount >= :minAmount', {
                minAmount: criteria.minAmount,
            });
        }

        if (criteria.maxAmount !== undefined) {
            query.andWhere('order.total_amount <= :maxAmount', {
                maxAmount: criteria.maxAmount,
            });
        }

        query.take(limit).skip(offset).orderBy('order.created_at', 'DESC');

        const entities = await query.getMany();
        return entities.map((entity) => OrderMapper.toDomain(entity));
    }

    public async update(order: Order): Promise<Order> {
        const entity = OrderMapper.toEntity(order);
        const updatedEntity = await this.repository.save(entity);
        return OrderMapper.toDomain(updatedEntity);
    }

    public async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    public async count(criteria?: OrderSearchCriteria): Promise<number> {
        if (!criteria) {
            return this.repository.count();
        }

        const query = this.repository.createQueryBuilder('order');

        if (criteria.userId) {
            query.andWhere('order.user_id = :userId', { userId: criteria.userId });
        }

        if (criteria.status) {
            query.andWhere('order.status = :status', { status: criteria.status });
        }

        if (criteria.paymentStatus) {
            query.andWhere('order.status IN (:...statuses)', {
                statuses: this.getStatusesForPaymentStatus(criteria.paymentStatus),
            });
        }

        if (criteria.startDate && criteria.endDate) {
            query.andWhere('order.created_at BETWEEN :startDate AND :endDate', {
                startDate: criteria.startDate,
                endDate: criteria.endDate,
            });
        }

        if (criteria.minAmount !== undefined) {
            query.andWhere('order.total_amount >= :minAmount', {
                minAmount: criteria.minAmount,
            });
        }

        if (criteria.maxAmount !== undefined) {
            query.andWhere('order.total_amount <= :maxAmount', {
                maxAmount: criteria.maxAmount,
            });
        }

        return query.getCount();
    }

    public async existsByOrderNumber(orderNumber: string): Promise<boolean> {
        const count = await this.repository.count({ where: { orderNumber } });
        return count > 0;
    }

    private getStatusesForPaymentStatus(paymentStatus: string): string[] {
        switch (paymentStatus) {
            case 'paid':
                return ['confirmed', 'processing', 'shipped', 'delivered'];
            case 'refunded':
                return ['refunded'];
            case 'pending':
                return ['pending'];
            case 'failed':
                return ['cancelled'];
            default:
                return [];
        }
    }
}