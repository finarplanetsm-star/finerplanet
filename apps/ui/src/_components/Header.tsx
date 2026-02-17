"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useArticleSearch } from "@/context/articleContext"
import { useNav } from "@/context/NavContext"

import { FinerPlanetLogo } from "../../public/articleSvg/article-svg"
import { CloseBtn, HamburgerIcon } from "../../public/common-svg"
import Navbar from "./Navbar"

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { searchClicked } = useArticleSearch()
  const { setActive } = useNav()
  const [windowWidth, setWindowWidth] = useState<number | null>(null)

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")

  // --- Combined Logic to Check Auth & Resize ---
  useEffect(() => {
    // A. Define the Auth Check Logic
    const checkAuth = () => {
      const token = localStorage.getItem("token")
      const userStr = localStorage.getItem("user")

      if (token && userStr) {
        setIsLoggedIn(true)
        try {
          const user = JSON.parse(userStr)
          setUsername(user.username || user.fullName || "User")
        } catch (e) {
          console.error("Error parsing user", e)
        }
      } else {
        setIsLoggedIn(false)
        setUsername("")
      }
    }

    // B. Resize Logic
    const handleResize = () => setWindowWidth(window.innerWidth)

    // C. Run immediately
    checkAuth()
    handleResize()

    // D. Add Event Listeners
    window.addEventListener("resize", handleResize)
    window.addEventListener("storage", checkAuth)
    window.addEventListener("auth-change", checkAuth)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("storage", checkAuth)
      window.removeEventListener("auth-change", checkAuth)
    }
  }, [pathname])

  // --- Logout Handler ---
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.dispatchEvent(new Event("auth-change"))
    setIsLoggedIn(false)
    setUsername("")
    router.refresh()
    router.push("/login")
  }

  // --- Scale Logic ---
  let scaleValue = 1
  if (searchClicked && windowWidth !== null) {
    if (windowWidth >= 1536) scaleValue = 0.9
    else if (windowWidth >= 1280) scaleValue = 0.7
    else if (windowWidth >= 1024) scaleValue = 0.6
    else if (windowWidth >= 837) scaleValue = 0.5
    else scaleValue = 0
  } else if (windowWidth === null) {
    scaleValue = 1
  }

  return (
    <div>
      <div className="flex justify-between items-center h-[124px] px-6 bg-white relative">
        {/* Left: Logo */}
        {/* FIX: Added z-50, bg-white, and pr-4 to create a mask over the center text */}
        <div className="relative w-[180px] md:w-[222px]  shrink-0  bg-white pr-4">
          <Link
            href="/"
            className="flex items-center h-full cursor-pointer"
            onClick={() => setActive("Author")}
          >
            <FinerPlanetLogo />
          </Link>
        </div>

        {/* Center: Search Text (Conditional) */}
        {/* FIX: Increased width check to 1024px to prevent collision on tablets */}
        {searchClicked && windowWidth !== null && windowWidth >= 1024 && (
          <div
            style={{ transform: `scale(${scaleValue})` }}
            className="absolute left-1/2 -translate-x-1/2 z-0 pointer-events-none" // FIX: z-0 and pointer-events-none
          >
            <h1 className="text-[20px] md:text-[36px] font-bold text-center z-0 w-full mx-auto whitespace-nowrap">
              The Finerplanet Top 100 Business School Research Rankings™
            </h1>
            <div className="bg-gradient-to-r from-[#3B3098] to-[#00A649] w-[60px] h-0.5 mx-auto mt-1" />
          </div>
        )}

        {/* Mobile: Hamburger */}
        <div className="md:hidden flex items-center gap-4 z-50">
          {!isLoggedIn && (
            <Link href="/login" className="text-sm font-bold text-[#3B3098]">
              Login
            </Link>
          )}

          {mobileMenuOpen ? (
            <CloseBtn
              className="cursor-pointer"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            />
          ) : (
            <HamburgerIcon
              className="cursor-pointer"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            />
          )}
        </div>

        {/* Desktop: Right Side (Sponsor + Auth) */}
        {/* FIX: Added z-50, bg-white, and pl-4. If center text is too long, it goes BEHIND this white box. */}
        <div className="hidden md:flex items-center gap-6 h-full z-50 bg-white pl-4 relative">
          {/* Auth Buttons */}
          <div className="flex flex-col items-end gap-1 min-w-[100px]">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-gray-600 font-medium">
                  Hello,{" "}
                  <span className="font-semibold text-gray-800 z-20">
                    {username}
                  </span>
                </span>

                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 z-20 rounded-full border border-[#3B3098] text-[#3B3098] text-sm font-semibold hover:bg-[#3B3098] cursor-pointer hover:text-white transition-all duration-200 shadow-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-[#3B3098] font-semibold text-sm hover:text-[#2a226b] transition-colors z-20"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  className="px-5 py-2 z-20 rounded-lg bg-[#3B3098] text-white text-sm font-semibold shadow-sm hover:bg-[#2a226b] transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Sponsor Image */}
          <div className="relative w-[180px] lg:w-[222px] h-[100px] lg:h-[124px]">
            <Image
              src="/best-business-research.svg"
              alt="Sponsor"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <Navbar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
    </div>
  )
}
