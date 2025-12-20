import { Money } from '@shared/domain/value-objects/Money';

export class OrderTotal {
    private readonly subtotal: Money;
    private readonly tax: Money;
    private readonly discount: Money;
    private readonly shipping: Money;
    private readonly totalAmount: Money;

    constructor(
        subtotal: Money,
        tax: Money,
        discount: Money,
        shipping: Money
    ) {
        this.subtotal = subtotal;
        this.tax = tax;
        this.discount = discount;
        this.shipping = shipping;

        // Calculate total: subtotal - discount + shipping (no tax)
        let total = subtotal;

        if (discount.getAmount() > 0) {
            total = total.subtract(discount);
        }

        if (shipping.getAmount() > 0) {
            total = total.add(shipping);
        }

        this.totalAmount = total;
    }

    public static reconstitute(
        subtotal: Money,
        tax: Money,
        discount: Money,
        totalAmount: Money
    ): OrderTotal {
        // Assume all Money objects use the same currency; add checks if needed
        const shippingAmount = totalAmount.getAmount() - subtotal.getAmount() + discount.getAmount();
        const shipping = new Money(shippingAmount, subtotal.getCurrency());

        // Instantiate using the constructor, which will recalculate totalAmount internally
        return new OrderTotal(subtotal, tax, discount, shipping);
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

    public getShipping(): Money {
        return this.shipping;
    }

    public getTotalAmount(): Money {
        return this.totalAmount;
    }

    public toJSON() {
        return {
            subtotal: {
                amount: this.subtotal.getAmount(),
                currency: this.subtotal.getCurrency()
            },
            tax: {
                amount: this.tax.getAmount(),
                currency: this.tax.getCurrency()
            },
            discount: {
                amount: this.discount.getAmount(),
                currency: this.discount.getCurrency()
            },
            shipping: {
                amount: this.shipping.getAmount(),
                currency: this.shipping.getCurrency()
            },
            totalAmount: {
                amount: this.totalAmount.getAmount(),
                currency: this.totalAmount.getCurrency()
            }
        };
    }
}