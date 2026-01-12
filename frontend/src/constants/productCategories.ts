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

// Category display information
export const CATEGORY_INFO: Record<ProductCategory, { label: string; description?: string }> = {
    'Tops': { label: 'Tops', description: 'T-shirts, blouses, shirts' },
    'Bottoms': { label: 'Bottoms', description: 'Pants, skirts, shorts' },
    'Dresses': { label: 'Dresses', description: 'All types of dresses' },
    'Outerwear': { label: 'Outerwear', description: 'Coats, jackets, blazers' },
    'Footwear': { label: 'Footwear', description: 'Shoes, boots, sandals' },
    'Accessories': { label: 'Accessories', description: 'Belts, scarves, etc.' },
    'Headwear': { label: 'Headwear', description: 'Hats, caps, beanies' },
    'Jewelry': { label: 'Jewelry', description: 'Necklaces, rings, earrings' },
    'Bags': { label: 'Bags', description: 'Handbags, backpacks, clutches' },
    'Suits': { label: 'Suits', description: 'Full suits and suit separates' },
    'Jackets': { label: 'Jackets', description: 'Casual and formal jackets' },
    'Formal': { label: 'Formal', description: 'Formal wear and attire' }
};