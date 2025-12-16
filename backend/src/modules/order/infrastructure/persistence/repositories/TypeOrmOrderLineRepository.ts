import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../../config/database';
import { IOrderLineRepository } from '../../../domain/repositories/IOrderLineRepository';
import { OrderLine } from '../../../domain/entities/OrderLine';
import { OrderLineEntity } from '../../entities/OrderLineEntity';
import { OrderLineMapper } from '../mappers/OrderLineMapper';

export class TypeOrmOrderLineRepository implements IOrderLineRepository {
    private readonly repository: Repository<OrderLineEntity>;

    constructor() {
        this.repository = AppDataSource.getRepository(OrderLineEntity);
    }

    public async save(orderLine: OrderLine): Promise<OrderLine> {
        const entity = OrderLineMapper.toEntity(orderLine);
        const savedEntity = await this.repository.save(entity);
        return OrderLineMapper.toDomain(savedEntity);
    }

    public async saveMany(orderLines: OrderLine[]): Promise<OrderLine[]> {
        const entities = orderLines.map((line) => OrderLineMapper.toEntity(line));
        const savedEntities = await this.repository.save(entities);
        return savedEntities.map((entity) => OrderLineMapper.toDomain(entity));
    }

    public async findById(id: string): Promise<OrderLine | null> {
        const entity = await this.repository.findOne({ where: { id } });
        return entity ? OrderLineMapper.toDomain(entity) : null;
    }

    public async findByOrderId(orderId: string): Promise<OrderLine[]> {
        const entities = await this.repository.find({
            where: { orderId },
        });
        return entities.map((entity) => OrderLineMapper.toDomain(entity));
    }

    public async update(orderLine: OrderLine): Promise<OrderLine> {
        const entity = OrderLineMapper.toEntity(orderLine);
        const updatedEntity = await this.repository.save(entity);
        return OrderLineMapper.toDomain(updatedEntity);
    }

    public async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }

    public async deleteByOrderId(orderId: string): Promise<void> {
        await this.repository.delete({ orderId });
    }
}