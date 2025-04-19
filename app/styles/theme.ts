// Define theme without styled-components imports
// We'll use plain JavaScript/TypeScript for this

export const theme = {
  colors: {
    // Primary Colors
    primary: '#4a6cf7',
    primaryDark: '#3a5cf7',
    primaryLight: '#e9f0ff',
    
    // Secondary Colors
    secondary: '#14F195',
    secondaryDark: '#0cb376',
    secondaryLight: '#e6fffa',
    
    // Accent Colors
    accent: '#9945FF',
    accentDark: '#7e37d5',
    accentLight: '#f5ebff',
    
    // Status Colors
    success: '#2ecc71',
    warning: '#f39c12',
    error: '#e74c3c',
    info: '#3498db',
    
    // Gray Shades
    gray50: '#f8f9fa',
    gray100: '#f1f3f5',
    gray200: '#e9ecef',
    gray300: '#dee2e6',
    gray400: '#ced4da',
    gray500: '#adb5bd',
    gray600: '#6c757d',
    gray700: '#495057',
    gray800: '#343a40',
    gray900: '#212529',
    
    // Text Colors
    textPrimary: '#212529',
    textSecondary: '#495057',
    textTertiary: '#6c757d',
    textLight: '#ffffff',
    
    // Background Colors
    bgPrimary: '#ffffff',
    bgSecondary: '#f8f9fa',
    bgTertiary: '#f1f3f5',
    
    // Border Colors
    border: '#dee2e6',
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    round: '50%',
  },
  
  boxShadow: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  },
  
  transition: {
    fast: '0.2s',
    normal: '0.3s',
    slow: '0.5s',
  },
  
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    fontFamilyMono: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
    
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xxl: '1.5rem',
      xxxl: '1.875rem',
      xxxxl: '2.25rem',
      xxxxxl: '3rem',
    },
    
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      loose: 1.75,
    },
  },
  
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px',
  },
  
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

export type Theme = typeof theme;

export default theme; 