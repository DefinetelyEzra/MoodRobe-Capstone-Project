import { ThemePropertiesData } from '../../domain/value-objects/ThemeProperties';

export interface UpdateAestheticDto {
    name?: string;
    description?: string;
    themeProperties?: ThemePropertiesData;
    imageUrl?: string;
}