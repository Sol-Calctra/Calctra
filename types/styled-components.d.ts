import 'styled-components';
import { theme } from '../app/styles/theme';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: typeof theme.colors;
    spacing: typeof theme.spacing;
    borderRadius: typeof theme.borderRadius;
    boxShadow: typeof theme.boxShadow;
    transition: typeof theme.transition;
    typography: typeof theme.typography;
    breakpoints: typeof theme.breakpoints;
    container: typeof theme.container;
    zIndex: typeof theme.zIndex;
  }
} 