import { ThemePropertiesData } from '../../domain/value-objects/ThemeProperties';

export interface CreateAestheticDto {
    name: string;
    description: string;
    themeProperties: ThemePropertiesData;
    imageUrl?: string;
}

export interface AestheticResponseDto {
    id: string;
    name: string;
    description: string;
    themeProperties: ThemePropertiesData;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}