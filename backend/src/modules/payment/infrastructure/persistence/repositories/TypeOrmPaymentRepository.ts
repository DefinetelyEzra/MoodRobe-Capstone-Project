import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../../config/database';
import {
    IPaymentRepository,
    PaymentSearchCriteria
} from '../../../domain/repositories/IPaymentRepository';
import { Payment } from '../../../domain/entities/Payment';
import { PaymentEntity } from '../../entities/PaymentEntity';
import { PaymentMapper } from '../mappers/PaymentMapper';

export class TypeOrmPaymentRepository implements IPaymentRepository {
    private readonly repository: Repository<PaymentEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(PaymentEntity);
    }

    public async save(payment: Payment): Promise<Payment> {
        const entity = PaymentMapper.toEntity(payment);
        const savedEntity = await this.repository.save(entity);
        return PaymentMapper.toDomain(savedEntity);
    }

    public async findById(id: string): Promise<Payment | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? PaymentMapper.toDomain(entity) : null;
    }

    public async findByOrderId(orderId: string): Promise<Payment[]> {
        const entities = await this.repository.find({
            where: { orderId },
            order: { createdAt: 'DESC' }
        });
        return entities.map(entity => PaymentMapper.toDomain(entity));
    }

    public async findByTransactionId(transactionId: string): Promise<Payment | null> {
        const entity = await this.repository.findOne({
            where: { transactionId }
        });
        return entity ? PaymentMapper.toDomain(entity) : null;
    }

    public async search(
        criteria: PaymentSearchCriteria,
        limit: number = 20,
        offset: number = 0
    ): Promise<Payment[]> {
        const query = this.repository.createQueryBuilder('payment');

        if (criteria.orderId) {
            query.andWhere('payment.order_id = :orderId', { orderId: criteria.orderId });
        }

        if (criteria.status) {
            query.andWhere('payment.status = :status', { status: criteria.status });
        }

        if (criteria.provider) {
            query.andWhere('payment.provider = :provider', { provider: criteria.provider });
        }

        if (criteria.startDate && criteria.endDate) {
            query.andWhere('payment.created_at BETWEEN :startDate AND :endDate', {
                startDate: criteria.startDate,
                endDate: criteria.endDate
            });
        } else if (criteria.startDate) {
            query.andWhere('payment.created_at >= :startDate', {
                startDate: criteria.startDate
            });
        } else if (criteria.endDate) {
            query.andWhere('payment.created_at <= :endDate', {
                endDate: criteria.endDate
            });
        }

        if (criteria.minAmount !== undefined) {
            query.andWhere('payment.amount >= :minAmount', {
                minAmount: criteria.minAmount
            });
        }

        if (criteria.maxAmount !== undefined) {
            query.andWhere('payment.amount <= :maxAmount', {
                maxAmount: criteria.maxAmount
            });
        }

        query
            .take(limit)
            .skip(offset)
            .orderBy('payment.created_at', 'DESC');

        const entities = await query.getMany();
        return entities.map(entity => PaymentMapper.toDomain(entity));
    }

    public async update(payment: Payment): Promise<Payment> {
        const entity = PaymentMapper.toEntity(payment);
        const updatedEntity = await this.repository.save(entity);
        return PaymentMapper.toDomain(updatedEntity);
    }

    public async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    public async count(criteria?: PaymentSearchCriteria): Promise<number> {
        if (!criteria) {
            return this.repository.count();
        }

        const query = this.repository.createQueryBuilder('payment');

        if (criteria.orderId) {
            query.andWhere('payment.order_id = :orderId', { orderId: criteria.orderId });
        }

        if (criteria.status) {
            query.andWhere('payment.status = :status', { status: criteria.status });
        }

        if (criteria.provider) {
            query.andWhere('payment.provider = :provider', { provider: criteria.provider });
        }

        if (criteria.startDate && criteria.endDate) {
            query.andWhere('payment.created_at BETWEEN :startDate AND :endDate', {
                startDate: criteria.startDate,
                endDate: criteria.endDate
            });
        }

        if (criteria.minAmount !== undefined) {
            query.andWhere('payment.amount >= :minAmount', {
                minAmount: criteria.minAmount
            });
        }

        if (criteria.maxAmount !== undefined) {
            query.andWhere('payment.amount <= :maxAmount', {
                maxAmount: criteria.maxAmount
            });
        }

        return query.getCount();
    }

    public async existsByTransactionId(transactionId: string): Promise<boolean> {
        const count = await this.repository.count({
            where: { transactionId }
        });
        return count > 0;
    }
}