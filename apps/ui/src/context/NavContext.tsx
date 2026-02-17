"use client"

import React, { createContext, useContext, useState } from "react"

type NavContextType = {
  active: string
  setActive: (value: string) => void
}

const NavContext = createContext<NavContextType | undefined>(undefined)

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState("Author")

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
