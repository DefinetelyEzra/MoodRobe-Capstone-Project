import { Money } from "@shared/domain/value-objects/Money";

export class OrderTotal {
    private constructor(
        private readonly subtotal: Money,
        private readonly tax: Money,
        private readonly discount: Money,
        private readonly totalAmount: Money
    ) { }

    public static create(
        subtotal: Money,
        tax: Money = new Money(0),
        discount: Money = new Money(0)
    ): OrderTotal {
        // Calculate total: subtotal + tax - discount
        const totalAmount = subtotal.add(tax).subtract(discount);
        return new OrderTotal(subtotal, tax, discount, totalAmount);
    }

    public static reconstitute(
        subtotal: Money,
        tax: Money,
        discount: Money,
        totalAmount: Money
    ): OrderTotal {
        return new OrderTotal(subtotal, tax, discount, totalAmount);
    }

    public getSubtotal(): Money {
        return this.subtotal;
    }

    public getTax(): Money {
        return this.tax;
    }

    public getDiscount(): Money {
        return this.discount;
    }

    public getTotalAmount(): Money {
        return this.totalAmount;
    }
}