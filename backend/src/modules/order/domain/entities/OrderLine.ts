import { Money } from "@shared/domain/value-objects/Money";

export interface VariantDetails {
    size?: string;
    color?: string;
    sku: string;
}

export interface OrderLineProps {
    id: string;
    orderId: string;
    productVariantId: string;
    productName: string;
    variantDetails: VariantDetails;
    quantity: number;
    unitPrice: Money;
    lineTotal: Money;
}

export class OrderLine {
    private constructor(
        public readonly id: string,
        public readonly orderId: string,
        public readonly productVariantId: string,
        public readonly productName: string,
        public readonly variantDetails: VariantDetails,
        public readonly quantity: number,
        public readonly unitPrice: Money,
        public readonly lineTotal: Money
    ) { }

    public static create(
        id: string,
        orderId: string,
        productVariantId: string,
        productName: string,
        variantDetails: VariantDetails,
        quantity: number,
        unitPrice: Money
    ): OrderLine {
        OrderLine.validateQuantity(quantity);
        const lineTotal = unitPrice.multiply(quantity);

        return new OrderLine(
            id,
            orderId,
            productVariantId,
            productName,
            variantDetails,
            quantity,
            unitPrice,
            lineTotal
        );
    }

    public static reconstitute(props: OrderLineProps): OrderLine {
        const {
            id,
            orderId,
            productVariantId,
            productName,
            variantDetails,
            quantity,
            unitPrice,
            lineTotal
        } = props;

        return new OrderLine(
            id,
            orderId,
            productVariantId,
            productName,
            variantDetails,
            quantity,
            unitPrice,
            lineTotal
        );
    }

    public getUnitPrice(): Money {
        return this.unitPrice;
    }

    public getLineTotal(): Money {
        return this.lineTotal;
    }

    private static validateQuantity(quantity: number): void {
        if (quantity <= 0) {
            throw new TypeError('Quantity must be positive'); 
        }
        if (!Number.isInteger(quantity)) {
            throw new TypeError('Quantity must be an integer');
        }
    }
}