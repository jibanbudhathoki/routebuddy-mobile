import { StyleSheet } from 'react-native-unistyles';

const lightTheme = {
  colors: {
    background: '#F7F9FC',
    surface: '#FFFFFF',
    text: '#102D56',
    muted: '#7B89A3',
    primary: '#102D56',
    primaryRaised: '#173B6C',
    secondary: '#D6A83D',
    onPrimary: '#FFFFFF',
    primarySoft: '#E7EDF5',
    secondarySoft: '#E7D9A9',
    border: '#DCE4EF',
    error: '#B42318',
    google: '#4285F4',
    facebook: '#1877F2',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 10,
    md: 16,
    lg: 24,
  },
} as const;

const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: '#0B1729',
    surface: '#142642',
    text: '#F4F7FC',
    muted: '#AAB7CC',
    primary: '#2B568A',
    primaryRaised: '#315B8F',
    secondary: '#D6A83D',
    onPrimary: '#FFFFFF',
    primarySoft: '#203A5D',
    secondarySoft: '#67592B',
    border: '#2D4464',
    error: '#F97066',
    google: '#7AA7FF',
    facebook: '#6FA8FF',
  },
} as const;

const themes = {
  light: lightTheme,
  dark: darkTheme,
};

const breakpoints = {
  compact: 0,
  medium: 500,
  expanded: 800,
};

type AppThemes = typeof themes;
type AppBreakpoints = typeof breakpoints;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

StyleSheet.configure({
  themes,
  breakpoints,
  settings: {
    adaptiveThemes: true,
  },
});
