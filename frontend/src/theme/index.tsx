
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material'
import { createContext, useMemo, useState, useContext, ReactNode, useEffect } from 'react'

type Mode = 'light' | 'dark'
const ColorModeCtx = createContext<{ mode: Mode, toggle: ()=>void }>({ mode: 'light', toggle: () => {} })

export function useColorMode(){ return useContext(ColorModeCtx) }

export function ColorModeProvider({ children }: { children: ReactNode }){
  const [mode, setMode] = useState<Mode>(() => (localStorage.getItem('mode') as Mode) || 'light')
  useEffect(()=>{ localStorage.setItem('mode', mode) }, [mode])
  const theme = useMemo(() => createTheme({ palette: { mode }, shape: { borderRadius: 12 } }), [mode])
  const value = useMemo(() => ({ mode, toggle: () => setMode(m => m === 'light' ? 'dark' : 'light') }), [mode])
  return <ColorModeCtx.Provider value={value}><ThemeProvider theme={theme}><CssBaseline />{children}</ThemeProvider></ColorModeCtx.Provider>
}
