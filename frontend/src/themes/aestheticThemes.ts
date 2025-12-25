export interface AestheticTheme {
    name: string;
    colors: {
        canvas: string;
        surface: string;
        textPrimary: string;
        textSecondary: string;
        accent: string;
        accentLight: string;
        accentDark: string;
        border: string;
        input: string;
    };
    fonts: {
        primary: string;
        secondary?: string;
    };
}

export const aestheticThemes: Record<string, AestheticTheme> = {
    // Default/Curator's Canvas theme
    default: {
        name: 'Curator\'s Canvas',
        colors: {
            canvas: '#F9F9F7',
            surface: '#FFFFFF',
            textPrimary: '#222222',
            textSecondary: '#6B6B6B',
            accent: '#BC6C4A',
            accentLight: '#D4856A',
            accentDark: '#9A5738',
            border: '#EAEAE7',
            input: '#F0F0F0',
        },
        fonts: {
            primary: 'Inter, system-ui, sans-serif',
        },
    },

    // Minimalist
    minimalist: {
        name: 'Minimalist',
        colors: {
            canvas: '#FAFAFA',
            surface: '#FFFFFF',
            textPrimary: '#1A1A1A',
            textSecondary: '#8C8C8C',
            accent: '#000000',
            accentLight: '#404040',
            accentDark: '#000000',
            border: '#E5E5E5',
            input: '#F5F5F5',
        },
        fonts: {
            primary: 'Helvetica Neue, Arial, sans-serif',
        },
    },

    // Streetwear
    streetwear: {
        name: 'Streetwear',
        colors: {
            canvas: '#1A1A1A',
            surface: '#242424',
            textPrimary: '#FFFFFF',
            textSecondary: '#B0B0B0',
            accent: '#FF3B3B',
            accentLight: '#FF6B6B',
            accentDark: '#CC0000',
            border: '#333333',
            input: '#2C2C2C',
        },
        fonts: {
            primary: 'Bebas Neue, Impact, sans-serif',
            secondary: 'Inter, sans-serif',
        },
    },

    // Cottagecore
    cottagecore: {
        name: 'Cottagecore',
        colors: {
            canvas: '#FFF9F0',
            surface: '#FFFEF9',
            textPrimary: '#4A5D3F',
            textSecondary: '#8B9A7E',
            accent: '#C9A86A',
            accentLight: '#E5C896',
            accentDark: '#A68B54',
            border: '#E8DFC5',
            input: '#FFF5E8',
        },
        fonts: {
            primary: 'Crimson Text, Georgia, serif',
        },
    },

    // Athleisure
    athleisure: {
        name: 'Athleisure',
        colors: {
            canvas: '#F0F2F5',
            surface: '#FFFFFF',
            textPrimary: '#1E293B',
            textSecondary: '#64748B',
            accent: '#0EA5E9',
            accentLight: '#38BDF8',
            accentDark: '#0284C7',
            border: '#E2E8F0',
            input: '#F8FAFC',
        },
        fonts: {
            primary: 'Roboto, system-ui, sans-serif',
        },
    },

    // Dark Academia
    'dark-academia': {
        name: 'Dark Academia',
        colors: {
            canvas: '#2B2419',
            surface: '#3D3228',
            textPrimary: '#F5E6D3',
            textSecondary: '#C4B5A0',
            accent: '#8B4513',
            accentLight: '#A0522D',
            accentDark: '#654321',
            border: '#4A4035',
            input: '#352D24',
        },
        fonts: {
            primary: 'Libre Baskerville, Georgia, serif',
        },
    },

    // Y2K
    y2k: {
        name: 'Y2K',
        colors: {
            canvas: '#E6F0FF',
            surface: '#FFFFFF',
            textPrimary: '#1A0F2E',
            textSecondary: '#6B5B95',
            accent: '#FF69EB',
            accentLight: '#FF99F5',
            accentDark: '#E040FB',
            border: '#D0C5E8',
            input: '#F5F0FF',
        },
        fonts: {
            primary: 'Arial Rounded MT Bold, Verdana, sans-serif',
        },
    },

    // Bohemian
    bohemian: {
        name: 'Bohemian',
        colors: {
            canvas: '#FFF8F0',
            surface: '#FFFDF7',
            textPrimary: '#5C4033',
            textSecondary: '#9B8B7E',
            accent: '#D4784E',
            accentLight: '#E69F7C',
            accentDark: '#B85A2B',
            border: '#E8D9C5',
            input: '#FFF5EB',
        },
        fonts: {
            primary: 'Merriweather, Georgia, serif',
        },
    },

    // Grunge
    grunge: {
        name: 'Grunge',
        colors: {
            canvas: '#2D2D2D',
            surface: '#3A3A3A',
            textPrimary: '#E8E8E8',
            textSecondary: '#A0A0A0',
            accent: '#8B0000',
            accentLight: '#A52A2A',
            accentDark: '#660000',
            border: '#4D4D4D',
            input: '#333333',
        },
        fonts: {
            primary: 'Courier New, monospace',
            secondary: 'Arial, sans-serif',
        },
    },

    // Coastal Grandmother
    'coastal-grandmother': {
        name: 'Coastal Grandmother',
        colors: {
            canvas: '#F8FAFB',
            surface: '#FFFFFF',
            textPrimary: '#1E3A5F',
            textSecondary: '#6B8CAE',
            accent: '#4A90A4',
            accentLight: '#6FB3C9',
            accentDark: '#2E6B7F',
            border: '#D9E8F0',
            input: '#F0F7FA',
        },
        fonts: {
            primary: 'Playfair Display, Georgia, serif',
            secondary: 'Lato, sans-serif',
        },
    },

    // Gorpcore
    gorpcore: {
        name: 'Gorpcore',
        colors: {
            canvas: '#F0EDE5',
            surface: '#FDFCFA',
            textPrimary: '#3D4A2C',
            textSecondary: '#6B7D5C',
            accent: '#7A6B3A',
            accentLight: '#9D8B54',
            accentDark: '#5C502B',
            border: '#D4CCBB',
            input: '#F5F3ED',
        },
        fonts: {
            primary: 'Work Sans, sans-serif',
        },
    },

    // Old Money
    'old-money': {
        name: 'Old Money',
        colors: {
            canvas: '#F9F8F6',
            surface: '#FFFFFF',
            textPrimary: '#1A2332',
            textSecondary: '#5B6B7C',
            accent: '#2C4A6B',
            accentLight: '#4A6D91',
            accentDark: '#1A3651',
            border: '#E3E1DC',
            input: '#F5F4F1',
        },
        fonts: {
            primary: 'Garamond, Georgia, serif',
        },
    },

    // Cyberpunk
    cyberpunk: {
        name: 'Cyberpunk',
        colors: {
            canvas: '#0A0E1A',
            surface: '#131824',
            textPrimary: '#E0E7FF',
            textSecondary: '#8B92B8',
            accent: '#00F0FF',
            accentLight: '#4DFFFF',
            accentDark: '#00B8CC',
            border: '#1E2638',
            input: '#0F1420',
        },
        fonts: {
            primary: 'Orbitron, monospace',
            secondary: 'Rajdhani, sans-serif',
        },
    },

    // Soft Girl
    'soft-girl': {
        name: 'Soft Girl',
        colors: {
            canvas: '#FFF5F9',
            surface: '#FFFFFF',
            textPrimary: '#4A2C3E',
            textSecondary: '#9B7B8F',
            accent: '#FFB5D8',
            accentLight: '#FFD4E8',
            accentDark: '#FF8BC3',
            border: '#FFE5F0',
            input: '#FFF9FC',
        },
        fonts: {
            primary: 'Quicksand, sans-serif',
        },
    },

    // Avant Garde
    'avant-garde': {
        name: 'Avant Garde',
        colors: {
            canvas: '#FAFAFA',
            surface: '#FFFFFF',
            textPrimary: '#0D0D0D',
            textSecondary: '#666666',
            accent: '#E63946',
            accentLight: '#FF5964',
            accentDark: '#C72C3B',
            border: '#CCCCCC',
            input: '#F2F2F2',
        },
        fonts: {
            primary: 'Futura, sans-serif',
            secondary: 'Helvetica Neue, sans-serif',
        },
    },

    // Vintage Americana
    'vintage-americana': {
        name: 'Vintage Americana',
        colors: {
            canvas: '#F5EFE6',
            surface: '#FFFEF9',
            textPrimary: '#2C1810',
            textSecondary: '#6B5B4F',
            accent: '#A23B2E',
            accentLight: '#C85946',
            accentDark: '#7A2B20',
            border: '#D9CEC1',
            input: '#FAF6F0',
        },
        fonts: {
            primary: 'American Typewriter, Courier, monospace',
            secondary: 'Inter, sans-serif',
        },
    },

    // Balletcore
    balletcore: {
        name: 'Balletcore',
        colors: {
            canvas: '#FFF5F7',
            surface: '#FFFFFF',
            textPrimary: '#2D1B2E',
            textSecondary: '#8B7E8F',
            accent: '#E8A0BF',
            accentLight: '#F5C6D9',
            accentDark: '#D4749E',
            border: '#F0E0E6',
            input: '#FFF9FB',
        },
        fonts: {
            primary: 'Cormorant Garamond, Georgia, serif',
            secondary: 'Montserrat, sans-serif',
        },
    },

    // Normcore
    normcore: {
        name: 'Normcore',
        colors: {
            canvas: '#F5F5F5',
            surface: '#FFFFFF',
            textPrimary: '#333333',
            textSecondary: '#808080',
            accent: '#5A5A5A',
            accentLight: '#7A7A7A',
            accentDark: '#404040',
            border: '#DDDDDD',
            input: '#F0F0F0',
        },
        fonts: {
            primary: 'Arial, sans-serif',
        },
    },

    // Techwear
    techwear: {
        name: 'Techwear',
        colors: {
            canvas: '#0D0D0D',
            surface: '#1A1A1A',
            textPrimary: '#F0F0F0',
            textSecondary: '#999999',
            accent: '#00D9FF',
            accentLight: '#4DFFFF',
            accentDark: '#00A8CC',
            border: '#262626',
            input: '#141414',
        },
        fonts: {
            primary: 'Share Tech Mono, monospace',
            secondary: 'Inter, sans-serif',
        },
    },

    // Romantic Academia
    'romantic-academia': {
        name: 'Romantic Academia',
        colors: {
            canvas: '#FFF9F5',
            surface: '#FFFEFB',
            textPrimary: '#3D2E2E',
            textSecondary: '#8B7E7D',
            accent: '#C9938A',
            accentLight: '#E6B8AF',
            accentDark: '#A67168',
            border: '#F0E4E0',
            input: '#FFF5F0',
        },
        fonts: {
            primary: 'Crimson Pro, Georgia, serif',
        },
    },

    // Skater
    skater: {
        name: 'Skater',
        colors: {
            canvas: '#F2F2F2',
            surface: '#FFFFFF',
            textPrimary: '#1F1F1F',
            textSecondary: '#6B6B6B',
            accent: '#FF4500',
            accentLight: '#FF6B3D',
            accentDark: '#CC3700',
            border: '#DBDBDB',
            input: '#F7F7F7',
        },
        fonts: {
            primary: 'Oswald, sans-serif',
            secondary: 'Inter, sans-serif',
        },
    },
};

// Helper function to get theme by aesthetic name
export const getThemeByAesthetic = (aestheticName: string): AestheticTheme => {
    const normalizedName = aestheticName.toLowerCase().replaceAll(/\s+/g, '-');
    return aestheticThemes[normalizedName] || aestheticThemes.default;
};

// Apply theme to document root
export const applyTheme = (theme: AestheticTheme): void => {
    const root = document.documentElement;

    // Apply CSS custom properties
    root.style.setProperty('--color-canvas', theme.colors.canvas);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text-primary', theme.colors.textPrimary);
    root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-accent-light', theme.colors.accentLight);
    root.style.setProperty('--color-accent-dark', theme.colors.accentDark);
    root.style.setProperty('--color-border', theme.colors.border);
    root.style.setProperty('--color-input', theme.colors.input);

    // Apply fonts
    root.style.setProperty('--font-primary', theme.fonts.primary);
    if (theme.fonts.secondary) {
        root.style.setProperty('--font-secondary', theme.fonts.secondary);
    }

    // Update body background
    document.body.style.backgroundColor = theme.colors.canvas;
    document.body.style.fontFamily = theme.fonts.primary;
};