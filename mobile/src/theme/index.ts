export const theme = {
    colors: {
        background: '#0a0a0a', // OLED Black
        surface: '#171717', // Darker surface
        surfaceHighlight: '#262626',
        primary: '#ca8a04', // Gold Accent (from DS)
        text: '#f5f5f5',
        textSecondary: '#a3a3a3',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        // Macros colors (vibrant for dataviz)
        protein: '#8b5cf6', // Violet
        carbs: '#3b82f6',   // Blue
        fat: '#ec4899',     // Pink
    },
    typography: {
        fontFamily: 'Inter',
        sizes: {
            xs: 12,
            sm: 14,
            md: 16,
            lg: 20,
            xl: 24,
            xxl: 32,
        },
        weights: {
            regular: '400',
            medium: '500',
            bold: '700',
        }
    },
    roundness: {
        sm: 8,
        md: 16,
        lg: 24,
        full: 9999,
    }
};
