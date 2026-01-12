export const PRODUCT_CATEGORIES = [
    'Tops',
    'Bottoms',
    'Dresses',
    'Outerwear',
    'Footwear',
    'Accessories',
    'Headwear',
    'Jewelry',
    'Bags',
    'Suits',
    'Jackets',
    'Formal'
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];

export const isCategoryValid = (category: string): category is ProductCategory => {
    return PRODUCT_CATEGORIES.includes(category as ProductCategory);
};

export const validateCategory = (category: string): void => {
    if (!isCategoryValid(category)) {
        throw new Error(
            `Invalid category "${category}". Must be one of: ${PRODUCT_CATEGORIES.join(', ')}`
        );
    }
};