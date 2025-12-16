import { Email } from "@shared/domain/value-objects/Email";
import { BusinessDetails } from '../value-objects/BusinessDetails';

export class Merchant {
  private constructor(
    public readonly id: string,
    public name: string,
    private email: Email,
    public businessDetails: BusinessDetails,
    public isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  public static create(
    id: string,
    name: string,
    email: string,
    businessDetails: BusinessDetails
  ): Merchant {
    this.validateName(name);
    const emailVO = new Email(email);
    return new Merchant(id, name, emailVO, businessDetails);
  }

  public static reconstitute(
    id: string,
    name: string,
    email: string,
    businessDetails: BusinessDetails,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date
  ): Merchant {
    const emailVO = new Email(email);
    return new Merchant(id, name, emailVO, businessDetails, isActive, createdAt, updatedAt);
  }

  public updateName(name: string): void {
    Merchant.validateName(name);
    this.name = name.trim();
    this.updatedAt = new Date();
  }

  public updateEmail(email: string): void {
    this.email = new Email(email);
    this.updatedAt = new Date();
  }

  public updateBusinessDetails(businessDetails: BusinessDetails): void {
    this.businessDetails = businessDetails;
    this.updatedAt = new Date();
  }

  public activate(): void {
    if (this.isActive) {
      throw new Error('Merchant is already active');
    }
    this.isActive = true;
    this.updatedAt = new Date();
  }

  public deactivate(): void {
    if (!this.isActive) {
      throw new Error('Merchant is already inactive');
    }
    this.isActive = false;
    this.updatedAt = new Date();
  }

  public getEmail(): string {
    return this.email.toString();
  }

  private static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Merchant name cannot be empty');
    }
    if (name.length > 255) {
      throw new Error('Merchant name cannot exceed 255 characters');
    }
  }
}