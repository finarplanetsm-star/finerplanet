"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useNav } from "@/context/NavContext"

import { LinkIcon, SearchByChevron } from "../../public/common-svg"

interface NavbarProps {
  mobileMenuOpen: boolean
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Navbar({
  mobileMenuOpen,
  setMobileMenuOpen,
}: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { active, setActive } = useNav()

  const [user, setUser] = useState<any>(null)

  const [searchByDropdownOpen, setSearchByDropdownOpen] = useState(false)
  const [mobileSearchByOpen, setMobileSearchByOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")

      if (token && userData) {
        setUser(JSON.parse(userData))
      } else {
        setUser(null)
      }
    } catch (error) {
      setUser(null)
      localStorage.removeItem("user")
    }
  }, [pathname]) // Re-check when the URL changes (e.g. after login redirect)

  useEffect(() => {
    if (pathname === "/") {
      if (
        active === "Blogs" ||
        active === "Methodology" ||
        active === "SignIn" ||
        active === "SignUp"
      ) {
        setActive("Home")
      }
    }
  }, [pathname, active, setActive])
  // 3. Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login") // Or router.push("/")hbcdhb
    setMobileMenuOpen(false)
  }

  const searchByOptions = [
    { label: "SEARCH BY AUTHORS", key: "SearchByAuthor" },
    { label: "SEARCH BY ARTICLES", key: "SearchByArticles" },
    { label: "SEARCH BY UNIVERSITIES", key: "SearchByUniversity" },
  ]

  const leftNav = [
    { id: 0, name: "HOME", key: "Home", href: "/" },
    { id: 1, name: "AUTHOR RANKING", key: "AuthorsRanking" },
    { id: 2, name: "UNIVERSITY RANKING", key: "UniversityRanking" },
    { id: 3, name: "SEARCH BY", key: "SearchBy" },
  ]

  const rightNav = [
    { id: 4, name: "JOURNALS", key: "Journals" },
    { id: 5, name: "METHODOLOGY", key: "Methodology", href: "/methodology" },
    { id: 6, name: "BLOGS", key: "Blogs", href: "/blogs" },
  ]

  const mobileNavItems = [...leftNav, ...rightNav]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSearchByDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleClick = (item: { key: string; href?: string }) => {
    window.scrollTo({ top: 0, behavior: "smooth" })

    // 1. Check if it's a link (Home, Blogs, Methodology, Login, etc.)
    if (item.href) {
      if (item.href === "/") {
        setActive("Home")
        if (pathname !== "/") {
          router.push("/")
        }
      }
      // Standard Case: Going to other pages (Blogs, Methodology)
      else {
        if (pathname !== item.href) {
          router.push(item.href)
        }
      }
    }
    // 2. Handle Dashboard Tabs (AuthorsRanking, etc. - no href)
    else {
      setActive(item.key)
      if (pathname !== "/") {
        router.push("/")
      }
    }

    setMobileMenuOpen(false)
    setSearchByDropdownOpen(false)
    setMobileSearchByOpen(false)
  }

  const handleSearchByOptionClick = (key: string) => {
    setActive(key)
    setSearchByDropdownOpen(false)
    setMobileSearchByOpen(false)
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: "smooth" })

    if (pathname !== "/") {
      setTimeout(() => {
        router.push("/")
      }, 0)
    }
  }

  return (
    <>
      <div className="bg-[#E7FFF2] h-[59px] w-full flex justify-center sticky top-0 z-40">
        <div className="max-w-[1440px] w-full h-full flex items-center text-[#2B2B2B]">
          {/* LEFT NAV for desktop */}
          <div className="items-center gap-6 justify-evenly flex-1 hidden lg:flex pl-2">
            {leftNav.map((item) => (
              <div
                key={item.id}
                className="relative"
                ref={item.key === "SearchBy" ? dropdownRef : null}
              >
                <button
                  onClick={() => {
                    if (item.key === "SearchBy") {
                      setSearchByDropdownOpen((open) => !open)
                      return
                    }
                    handleClick(item)
                  }}
                  className="md:font-Forma-DJR-500 text-nowrap max-[1100px]:text-[13px] text-[14px] hover:cursor-pointer uppercase tracking-[0.15px] hover:opacity-80 transition-opacity"
                >
                  <span className="relative" suppressHydrationWarning>
                    {item.name}
                    {item.key === "SearchBy" && (
                      <SearchByChevron className="ml-1 h-4 w-4 inline-block align-middle" />
                    )}
                    {(active === item.key ||
                      (item.key === "SearchBy" &&
                        searchByOptions.some((opt) => opt.key === active))) && (
                      <span
                        className="absolute left-0 -bottom-0.5 h-0.5 w-full bg-[#2F7664]"
                        suppressHydrationWarning
                      />
                    )}
                  </span>
                </button>
                {item.key === "SearchBy" && searchByDropdownOpen && (
                  <div className="absolute top-full left-0 mt-4 w-[220px] rounded-xl bg-[#E7FFF2] shadow-lg overflow-hidden z-50">
                    <div className="flex flex-col py-3">
                      {searchByOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearchByOptionClick(option.key)}
                          className="text-left px-4 py-3 hover:bg-[#d1f5e8] transition-colors text-[#2B2B2B] uppercase tracking-[0.15px] typo-mobile-body-xs-medium md:typo-desktop-body-xs-medium font-medium hover:cursor-pointer"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CENTER LOGO */}
          <div className="shrink-0 px-4 lg:px-0 flex-1 lg:flex-none flex justify-start cursor-pointer">
            <div onClick={() => handleClick({ key: "Home" })}>
              <Image
                src="/Adobe%20Express%20-%20file%202.svg"
                alt="Finerplanet"
                width={159}
                height={44.476}
                priority
                className="h-6 w-[119px] h-[33.36px] min-[1100px]:w-[159px] min-[1100px]:h-[44.476px]"
              />
            </div>
          </div>

          {/* RIGHT NAV (DESKTOP) */}
          <div className="flex items-center lg:gap-6 flex-1 lg:justify-evenly justify-end">
            <div className="items-center gap-6 flex-1 justify-evenly hidden lg:flex">
              {rightNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleClick(item)}
                  className="md:font-Forma-DJR-500 text-nowrap max-[1100px]:text-[13px] text-[14px] hover:cursor-pointer uppercase tracking-[0.15px] hover:opacity-80 transition-opacity"
                >
                  <span className="relative" suppressHydrationWarning>
                    {item.name}
                    {active === item.key && (
                      <span
                        className="absolute left-0 -bottom-0.5 h-0.5 w-full bg-[#2F7664]"
                        suppressHydrationWarning
                      />
                    )}
                  </span>
                </button>
              ))}

              {/* 4. CONDITIONAL RENDERING (Desktop) */}
              <div className="flex items-center gap-4 ">
                {user ? (
                  // LOGGED IN STATE
                  <button
                    onClick={handleLogout}
                    className="max-[1100px]:text-[13px] text-[14px] font-Forma-DJR-500 hover:cursor-pointer uppercase tracking-[0.15px] text-[#2B2B2B] hover:text-red-600 transition-opacity"
                  >
                    LOG OUT
                  </button>
                ) : (
                  // GUEST STATE
                  <>
                    <button
                      onClick={() =>
                        handleClick({ key: "SignIn", href: "/login" })
                      }
                      className="max-[1100px]:text-[13px] text-[14px] font-Forma-DJR-500 hover:cursor-pointer uppercase tracking-[0.15px] text-[#2B2B2B] hover:opacity-80 transition-opacity"
                    >
                      LOGIN
                    </button>
                    <button
                      onClick={() =>
                        handleClick({ key: "SignUp", href: "/sign-up" })
                      }
                      className="max-[1100px]:text-[13px] text-[14px] font-Forma-DJR-500 hover:cursor-pointer uppercase tracking-[0.15px] bg-[#2F7664] text-white px-4 py-2 rounded-[9px] hover:brightness-90 transition"
                    >
                      SIGN UP
                    </button>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden flex flex-col items-end gap-[5px] p-2"
            >
              <span className="w-6 h-[1.8px] bg-[#3A6E63]"></span>
              <span className="w-4 h-[1.8px] bg-[#3A6E63]"></span>
              <span className="w-6 h-[1.8px] bg-[#3A6E63]"></span>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MODAL */}
      <div
        className={`fixed inset-0 z-50 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6 pt-10">
          <div className="flex justify-end">
            <button onClick={() => setMobileMenuOpen(false)} className="p-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#02463B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-6 mt-4">
            {mobileNavItems.map((item) => (
              <div key={item.id} className="flex flex-col">
                <button
                  onClick={() => {
                    if (item.key === "SearchBy") {
                      setMobileSearchByOpen(!mobileSearchByOpen)
                    } else {
                      handleClick(item)
                    }
                  }}
                  className={`text-left font-Forma-DJR-500 text-desktop-h4-size tracking-[0.15px] uppercase flex items-center gap-1 ${
                    active === item.key ||
                    (item.key === "SearchBy" &&
                      searchByOptions.some((opt) => opt.key === active))
                      ? "text-[#2F7664] underline underline-offset-4"
                      : "text-[#475467]"
                  }`}
                >
                  {item.name}
                  {item.key === "SearchBy" && (
                    <SearchByChevron
                      className={`h-5 w-5 opacity-70 transition-transform ${mobileSearchByOpen ? "rotate-180" : ""}`}
                    />
                  )}
                </button>

                {item.key === "SearchBy" && mobileSearchByOpen && (
                  <div className="flex flex-col gap-4 mt-4 ml-4">
                    {searchByOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          handleSearchByOptionClick(option.key)
                          setMobileSearchByOpen(false)
                        }}
                        className={`text-left table-head-mobile tracking-[0.15px] uppercase ${
                          active === option.key
                            ? "text-[#2F7664] underline underline-offset-4"
                            : "text-[#475467]"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* 5. CONDITIONAL RENDERING (Mobile) */}
            <div className="border-t border-gray-100 pt-6 mt-2 flex flex-col gap-4">
              {user ? (
                // LOGGED IN (Mobile)
                <button
                  onClick={handleLogout}
                  className="text-left table-head-mobile tracking-[0.15px] uppercase text-[#2B2B2B] hover:text-red-600"
                >
                  LOG OUT
                </button>
              ) : (
                // GUEST (Mobile)
                <>
                  <button
                    onClick={() =>
                      handleClick({ key: "SignIn", href: "/login" })
                    }
                    className="text-left table-head-mobile tracking-[0.15px] uppercase text-[#475467]"
                  >
                    LOGIN
                  </button>
                  <button
                    onClick={() =>
                      handleClick({ key: "SignUp", href: "/sign-up" })
                    }
                    className="text-left table-head-mobile tracking-[0.15px] uppercase text-[#2F7664] font-bold"
                  >
                    SIGN UP
                  </button>
                </>
              )}
            </div>
          </nav>

          <div className="mt-auto mb-10">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.google.com/forms/d/e/1FAIpQLSfVwX7Yff1nSb0dIK75cT1vryZMCx2g-w1bnD1KkQ77sA9wWg/viewform?pli=1"
              className="md:col-span-3 flex items-center gap-2 cursor-pointer duration-300 ease-in-out"
            >
              <h2 className="typo-mobile-h4 md:typo-desktop-h4"> Contact Us</h2>
              <LinkIcon />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
