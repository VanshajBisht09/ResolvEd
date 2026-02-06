import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';

type ThemePreset = 'classic' | 'ocean' | 'forest' | 'sunset' | 'nebula' | 'midnight';

interface ThemeContextType {
  toggleColorMode: () => void;
  setPreset: (preset: ThemePreset, save?: boolean) => void;
  mode: 'light' | 'dark';
  preset: ThemePreset;
}

const ColorModeContext = createContext<ThemeContextType>({ 
  toggleColorMode: () => {}, 
  setPreset: () => {},
  mode: 'light',
  preset: 'classic'
});

export const useColorMode = () => useContext(ColorModeContext);

const PRESETS = {
  classic: {
    primary: { main: '#4338ca', light: '#6366f1', dark: '#312e81' }, // Indigo 700/500/900
    secondary: { main: '#059669', light: '#34d399', dark: '#064e3b' }, // Emerald
    background: {
      light: { default: '#f8fafc', paper: '#ffffff' }, // Slate 50
      dark: { default: '#0f172a', paper: '#1e293b' }   // Slate 900
    }
  },
  ocean: {
    primary: { main: '#0284c7', light: '#38bdf8', dark: '#0c4a6e' }, // Sky 600
    secondary: { main: '#4f46e5', light: '#818cf8', dark: '#312e81' }, // Indigo
    background: {
      light: { default: '#f0f9ff', paper: '#ffffff' }, // Sky 50
      dark: { default: '#0c1427', paper: '#111827' }   // Deep Navy
    }
  },
  forest: {
    primary: { main: '#047857', light: '#34d399', dark: '#064e3b' }, // Emerald 600
    secondary: { main: '#65a30d', light: '#a3e635', dark: '#3f6212' }, // Lime
    background: {
      light: { default: '#f0fdf4', paper: '#ffffff' }, // Green 50
      dark: { default: '#022c22', paper: '#064e3b' }   // Deep Jungle
    }
  },
  sunset: {
    primary: { main: '#c2410c', light: '#fb923c', dark: '#7c2d12' }, // Orange 700
    secondary: { main: '#be185d', light: '#f472b6', dark: '#831843' }, // Pink
    background: {
      light: { default: '#fff7ed', paper: '#ffffff' }, // Orange 50
      dark: { default: '#2a1205', paper: '#431407' }   // Deep Brown
    }
  },
  nebula: {
    primary: { main: '#7c3aed', light: '#a78bfa', dark: '#4c1d95' }, // Violet 600
    secondary: { main: '#c026d3', light: '#e879f9', dark: '#701a75' }, // Fuchsia
    background: {
      light: { default: '#faf5ff', paper: '#ffffff' }, // Purple 50
      dark: { default: '#1a0b2e', paper: '#2e1065' }   // Deep Violet
    }
  },
  midnight: {
    primary: { main: '#6366f1', light: '#818cf8', dark: '#4338ca' }, // Indigo 500
    secondary: { main: '#a855f7', light: '#c084fc', dark: '#9333ea' }, // Purple 500
    background: {
      light: { default: '#f3f4f6', paper: '#ffffff' }, // Gray 100
      dark: { default: '#020617', paper: '#0f172a' }   // Slate 950 / Slate 900
    }
  }
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const [preset, setPresetState] = useState<ThemePreset>('midnight');

  // Load saved preferences
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') as 'light' | 'dark';
    const savedPreset = localStorage.getItem('themePreset') as ThemePreset;
    
    if (savedMode) setMode(savedMode);
    if (savedPreset && PRESETS[savedPreset]) setPresetState(savedPreset);
  }, []);

  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      setMode((prevMode) => {
        const newMode = prevMode === 'light' ? 'dark' : 'light';
        localStorage.setItem('themeMode', newMode);
        return newMode;
      });
    },
    setPreset: (newPreset: ThemePreset, save: boolean = true) => {
      setPresetState(newPreset);
      if (save) {
        localStorage.setItem('themePreset', newPreset);
      }
    },
    mode,
    preset
  }), [mode, preset]);

  const theme = useMemo(() => {
    const palette = PRESETS[preset];
    const bg = palette.background[mode];
    
    return createTheme({
      palette: {
        mode,
        primary: {
          ...palette.primary,
          contrastText: '#ffffff',
        },
        secondary: {
          ...palette.secondary,
          contrastText: '#ffffff',
        },
        background: {
          default: bg.default,
          paper: bg.paper,
        },
        text: {
          primary: mode === 'light' ? '#0f172a' : '#f8fafc', // Slate 900 / 50
          secondary: mode === 'light' ? '#475569' : '#cbd5e1', // Slate 600 / 300 - Higher contrast
        }
      },
      typography: {
        fontFamily: '"Inter", sans-serif',
        h1: { fontFamily: '"Outfit", sans-serif', fontWeight: 800, letterSpacing: '-0.025em' },
        h2: { fontFamily: '"Outfit", sans-serif', fontWeight: 700, letterSpacing: '-0.025em' },
        h3: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
        h4: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
        h5: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
        h6: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
        button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
      },
      shape: {
        borderRadius: 10, // Radius 10px as requested
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: { 
              borderRadius: 10,
              boxShadow: 'none',
              padding: '10px 20px',
              transition: 'all 0.2s ease-in-out',
              '&:hover': { 
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
              }
            },
            containedPrimary: {
              background: `linear-gradient(135deg, ${palette.primary.main}, ${palette.primary.dark})`,
            }
          },
        },
        MuiCard: {
          styleOverrides: {
            root: { 
              borderRadius: 10,
              boxShadow: mode === 'light' 
                ? '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)' 
                : '0 10px 15px -3px rgb(0 0 0 / 0.4)',
              border: `1px solid ${mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
              backgroundImage: 'none'
            },
          },
        },
        MuiPaper: {
            styleOverrides: {
                root: { backgroundImage: 'none', borderRadius: 10 }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : `rgba(${parseInt(bg.default.slice(1,3), 16)}, ${parseInt(bg.default.slice(3,5), 16)}, ${parseInt(bg.default.slice(5,7), 16)}, 0.8)`,
                    backdropFilter: 'blur(12px)',
                    borderBottom: `1px solid ${mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
                    boxShadow: 'none',
                    color: mode === 'light' ? '#0f172a' : '#f8fafc'
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: { fontWeight: 600, borderRadius: 10 }
            }
        }
      },
    });
  }, [mode, preset]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ColorModeContext.Provider>
  );
};
