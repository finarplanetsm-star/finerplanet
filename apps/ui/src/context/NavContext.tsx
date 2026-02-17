"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { usePathname } from "next/navigation"

type NavContextType = {
  active: string
  setActive: (value: string) => void
}

const NavContext = createContext<NavContextType | undefined>(undefined)

const STORAGE_KEY = "nav_active_state"

// Map pathnames to nav keys
const getNavKeyFromPathname = (pathname: string): string => {
  if (pathname === "/") {
    return "Home" // Don't read from sessionStorage here, let the state handle it
  }
  if (pathname === "/methodology") return "Methodology"
  if (pathname === "/blogs") return "Blogs"
  if (pathname === "/login") return "SignIn"
  if (pathname === "/sign-up") return "SignUp"
  return "Home"
}

export function NavProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Initialize based on actual browser pathname AND sessionStorage
  const [active, setActiveState] = useState(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname
      // If we're on home page, restore from sessionStorage
      if (currentPath === "/") {
        const stored = sessionStorage.getItem(STORAGE_KEY)
        return stored || "Home"
      }
      // For other pages, use pathname to set correct nav key
      const navKeyFromPath = getNavKeyFromPathname(currentPath)
      // Also sync sessionStorage with the pathname
      sessionStorage.setItem(STORAGE_KEY, navKeyFromPath)
      return navKeyFromPath
    }
    return "Home"
  })

  // Wrapper to save to sessionStorage whenever active changes
  const setActive = (value: string) => {
    setActiveState(value)
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, value)
    }
  }

  // Sync active state when pathname changes (e.g., browser back/forward, navigation)
  useEffect(() => {
    if (pathname === "/") {
      // When navigating to home, restore from sessionStorage if available
      if (typeof window !== "undefined") {
        const stored = sessionStorage.getItem(STORAGE_KEY)
        if (stored && stored !== active) {
          setActiveState(stored)
        }
      }
    } else {
      // For external pages, update based on pathname
      const navKeyFromPath = getNavKeyFromPathname(pathname)
      if (active !== navKeyFromPath) {
        setActiveState(navKeyFromPath)
        sessionStorage.setItem(STORAGE_KEY, navKeyFromPath)
      }
    }
  }, [pathname])

  return (
    <NavContext.Provider value={{ active, setActive }}>
      {children}
    </NavContext.Provider>
  )
}

export function useNav() {
  const context = useContext(NavContext)
  if (!context) throw new Error("useNav must be used inside NavProvider")
  return context
}
