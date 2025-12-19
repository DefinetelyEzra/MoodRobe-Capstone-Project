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

export interface CarouselResponseDto {
    id: string;
    imageUrl: string;
    title?: string;
    subtitle?: string;
    linkUrl?: string;
    displayOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}