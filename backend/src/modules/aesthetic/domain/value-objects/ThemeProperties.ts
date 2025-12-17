export interface ThemePropertiesData {
    colors: string[];
    style: string;
    mood?: string;
    patterns?: string[];
    textures?: string[];
    keywords?: string[];
}

export class ThemeProperties {
    private readonly properties: ThemePropertiesData;

    constructor(properties: ThemePropertiesData) {
        this.validateProperties(properties);
        this.properties = properties;
    }

    private validateProperties(properties: ThemePropertiesData): void {
        if (!properties.colors || properties.colors.length === 0) {
            throw new Error('Theme must have at least one color');
        }

        if (!properties.style || properties.style.trim().length === 0) {
            throw new Error('Theme must have a style');
        }

        // Validate color format; allow hex colors (#FFFFFF) or named colors (red, neon-blue, etc.)
        properties.colors.forEach((color) => {
            const isHexColor = /^#[0-9A-F]{6}$/i.test(color) || /^#[0-9A-F]{3}$/i.test(color);
            const isNamedColor = /^[a-z-]+$/i.test(color); // Allow letters and hyphens
            
            if (!isHexColor && !isNamedColor) {
                throw new Error(`Invalid color format: ${color}. Must be hex (#fff or #ffffff) or named color (red, neon-blue)`);
            }
        });
    }

    public getColors(): string[] {
        return [...this.properties.colors];
    }

    public getStyle(): string {
        return this.properties.style;
    }

    public getMood(): string | undefined {
        return this.properties.mood;
    }

    public getPatterns(): string[] {
        return this.properties.patterns ? [...this.properties.patterns] : [];
    }

    public getTextures(): string[] {
        return this.properties.textures ? [...this.properties.textures] : [];
    }

    public getKeywords(): string[] {
        return this.properties.keywords ? [...this.properties.keywords] : [];
    }

    public toJSON(): ThemePropertiesData {
        return {
            colors: this.getColors(),
            style: this.getStyle(),
            mood: this.getMood(),
            patterns: this.getPatterns(),
            textures: this.getTextures(),
            keywords: this.getKeywords(),
        };
    }

    public hasColor(color: string): boolean {
        return this.properties.colors.includes(color.toLowerCase());
    }

    public hasKeyword(keyword: string): boolean {
        return this.properties.keywords
            ? this.properties.keywords.some(
                (k) => k.toLowerCase() === keyword.toLowerCase()
            )
            : false;
    }
}