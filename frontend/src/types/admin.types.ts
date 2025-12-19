// Carousel Types
export interface CarouselItem {
    id: string;
    imageUrl: string;
    title?: string;
    subtitle?: string;
    linkUrl?: string;
    displayOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCarouselDto {
    imageUrl: string;
    title?: string;
    subtitle?: string;
    linkUrl?: string;
    displayOrder?: number;
}

export interface UpdateCarouselDto {
    imageUrl?: string;
    title?: string;
    subtitle?: string;
    linkUrl?: string;
    displayOrder?: number;
    isActive?: boolean;
}

// Content Types

// Metadata structure for homepage content
export interface ContentMetadata {
    [key: string]: string | number | boolean | null | undefined;
}

export interface HomepageContent {
    id: string;
    sectionKey: string;
    contentType: string;
    content: string;
    metadata: ContentMetadata;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateContentDto {
    content: string;
    metadata?: ContentMetadata;
}

export type ContentSectionKey =
    | 'hero_tagline'
    | 'merchant_cta_title'
    | 'merchant_cta_subtitle'
    | 'style_quiz_title'
    | 'style_quiz_subtitle';

// Content types supported by the CMS
export type ContentType = 'text' | 'html' | 'markdown' | 'json';


// Activity Log Types

// Details structure for activity log entries
export interface ActivityLogDetails {
    [key: string]: string | number | boolean | null | undefined | string[] | number[];
}

export interface ActivityLog {
    id: string;
    adminEmail: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    details: ActivityLogDetails;
    createdAt: string;
}

// Common admin actions tracked in activity log
export type AdminAction =
    | 'create'
    | 'update'
    | 'delete'
    | 'activate'
    | 'deactivate';

// Resource types managed by admin
export type AdminResourceType =
    | 'carousel'
    | 'content'
    | 'user'
    | 'product'
    | 'order';

// Validation Constants 
export const ADMIN_VALIDATION = {
    carousel: {
        titleMaxLength: 255,
        subtitleMaxLength: 255,
        displayOrderMin: 0,
    },
} as const;