export interface ActivityLogResponseDto {
    id: string;
    adminEmail: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    details: Record<string, any>;
    createdAt: Date;
}