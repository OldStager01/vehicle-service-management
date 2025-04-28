"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useColorScheme } from "react-native"

type ThemeType = "light" | "dark" | "system"

interface ThemeContextType {
  theme: ThemeType
  setTheme: (theme: ThemeType) => void
  isDark: boolean
  colors: {
    primary: string
    background: string
    card: string
    text: string
    border: string
    notification: string
    error: string
    success: string
    warning: string
    info: string
    muted: string
  }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const colorScheme = useColorScheme()
  const [themeType, setThemeType] = useState<ThemeType>("system")

  const isDark = themeType === "system" ? colorScheme === "dark" : themeType === "dark"

  const lightColors = {
    primary: "#3b82f6",
    background: "#f8fafc",
    card: "#ffffff",
    text: "#0f172a",
    border: "#e2e8f0",
    notification: "#ef4444",
    error: "#ef4444",
    success: "#22c55e",
    warning: "#f59e0b",
    info: "#3b82f6",
    muted: "#64748b",
  }

  const darkColors = {
    primary: "#60a5fa",
    background: "#0f172a",
    card: "#1e293b",
    text: "#f8fafc",
    border: "#334155",
    notification: "#ef4444",
    error: "#ef4444",
    success: "#22c55e",
    warning: "#f59e0b",
    info: "#3b82f6",
    muted: "#94a3b8",
  }

  const colors = isDark ? darkColors : lightColors

  const value = {
    theme: themeType,
    setTheme: setThemeType,
    isDark,
    colors,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
