import { Money } from "@shared/domain/value-objects/Money";
import { OrderTotal } from '../value-objects/OrderTotal';

export interface OrderItem {
  unitPrice: Money;
  quantity: number;
}

export class OrderCalculationService {
  private readonly taxRate: number;

  constructor(taxRate: number = 0.08) {
    // Default 8% tax rate
    if (taxRate < 0 || taxRate > 1) {
      throw new Error('Tax rate must be between 0 and 1');
    }
    this.taxRate = taxRate;
  }

  public calculateSubtotal(items: OrderItem[]): Money {
    if (items.length === 0) {
      return new Money(0);
    }

    const currency = items[0].unitPrice.getCurrency();
    let total = new Money(0, currency);

    for (const item of items) {
      const lineTotal = item.unitPrice.multiply(item.quantity);
      total = total.add(lineTotal);
    }

    return total;
  }

  public calculateTax(subtotal: Money): Money {
    return subtotal.multiply(this.taxRate);
  }

  public calculateDiscount(subtotal: Money, discountPercentage: number): Money {
    if (discountPercentage < 0 || discountPercentage > 100) {
      throw new Error('Discount percentage must be between 0 and 100');
    }
    return subtotal.multiply(discountPercentage / 100);
  }

  public calculateTotal(
    items: OrderItem[],
    discountPercentage: number = 0
  ): OrderTotal {
    const subtotal = this.calculateSubtotal(items);
    const tax = this.calculateTax(subtotal);
    const discount = this.calculateDiscount(subtotal, discountPercentage);

    return OrderTotal.create(subtotal, tax, discount);
  }
}