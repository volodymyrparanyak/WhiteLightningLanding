import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // Dark mode for moonshine vibe
    primary: {
      main: '#b0bec5', // Soft grey-blue for accents
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffca28', // Warm yellow for highlights (moonshine glow)
    },
    background: {
      default: '#212121', // Dark grey base
      paper: 'rgba(255, 255, 255, 0.05)', // Glassmorphism effect
    },
    text: {
      primary: '#ffffff', // White text
      secondary: '#b0bec5', // Lighter grey for secondary text
    },
    grey: {
      100: '#f5f5f5',
      300: '#b0bec5',
      400: '#90a4ae',
      700: '#455a64',
      800: '#37474f',
      900: '#263238',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h2: {
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    body1: {
      lineHeight: 1.6,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(5px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
        },
      },
    },
  },
});

export default theme;