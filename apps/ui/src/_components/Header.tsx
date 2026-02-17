"use client"

import React, { useState } from "react"

import Navbar from "./Navbar"

export default function Header() {
  // Keep only the navbar visible
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <Navbar
      mobileMenuOpen={mobileMenuOpen}
      setMobileMenuOpen={setMobileMenuOpen}
    />
  )
}
