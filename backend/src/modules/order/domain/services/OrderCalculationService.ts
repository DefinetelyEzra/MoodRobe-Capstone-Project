import { Money } from '@shared/domain/value-objects/Money';
import { OrderTotal } from '../value-objects/OrderTotal';

interface OrderItem {
    unitPrice: Money;
    quantity: number;
}

export class OrderCalculationService {
    // Shipping configuration
    private static readonly DEFAULT_SHIPPING_FEE = 500; // 500 NGN
    private static readonly FREE_SHIPPING_THRESHOLD = 50000; // Free shipping above 50,000 NGN

    private getShippingFee(): Money {
        // Get from env or use default
        const feeFromEnv = process.env.DEFAULT_SHIPPING_FEE 
            ? Number.parseInt(process.env.DEFAULT_SHIPPING_FEE) / 100 // Convert from kobo to naira
            : OrderCalculationService.DEFAULT_SHIPPING_FEE;

        return new Money(feeFromEnv, 'NGN');
    }

    private isFreeShippingEligible(subtotal: Money): boolean {
        const threshold = new Money(OrderCalculationService.FREE_SHIPPING_THRESHOLD, 'NGN');
        return subtotal.isGreaterThan(threshold) || subtotal.equals(threshold);
    }

    // Remove tax calculation completely
    public calculateTotal(
        items: OrderItem[],
        discountPercentage: number = 0,
        shippingDestination?: string
    ): OrderTotal {
        // Calculate subtotal
        const subtotal = items.reduce((total, item) => {
            const lineTotal = item.unitPrice.multiply(item.quantity);
            return total.add(lineTotal);
        }, new Money(0, 'NGN'));

        // Calculate discount
        const discountAmount = discountPercentage > 0
            ? subtotal.multiply(discountPercentage / 100)
            : new Money(0, 'NGN');

        // NO TAX for Nigerian market
        const tax = new Money(0, 'NGN');

        // Calculate shipping
        const shipping = this.isFreeShippingEligible(subtotal)
            ? new Money(0, 'NGN')
            : this.getShippingFee();

        return new OrderTotal(
            subtotal,
            tax, // Always 0
            discountAmount,
            shipping
        );
    }

    public recalculateWithDiscount(
        currentTotal: OrderTotal,
        discountPercentage: number
    ): OrderTotal {
        const discountAmount = discountPercentage > 0
            ? currentTotal.getSubtotal().multiply(discountPercentage / 100)
            : new Money(0, 'NGN');

        return new OrderTotal(
            currentTotal.getSubtotal(),
            new Money(0, 'NGN'), // No tax
            discountAmount,
            currentTotal.getShipping()
        );
    }
}