export interface UpdateContentDto {
    content: string;
    metadata?: Record<string, any>;
}

export interface ContentResponseDto {
    id: string;
    sectionKey: string;
    contentType: string;
    content: string;
    metadata: Record<string, any>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}