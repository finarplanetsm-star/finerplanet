"use client"

import React, { useRef } from "react"
import { useRouter } from "next/navigation"
import { useArticleSearch } from "@/context/articleContext"
import { useNav } from "@/context/NavContext"

import Searchbar from "./Searchbar"

interface NavbarProps {
  mobileMenuOpen: boolean
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Navbar({
  mobileMenuOpen,
  setMobileMenuOpen,
}: NavbarProps) {
  const router = useRouter()
  const { active, setActive } = useNav()
  const { setSearchClicked } = useArticleSearch()

  const navElements = [
    { id: 0, name: "Search by Author", key: "Author" },
    { id: 1, name: "Search by Article", key: "Article" },
    { id: 2, name: "Search by Universities", key: "Universities" },
    { id: 3, name: "Search by Collaboration", key: "Collaboration" },
    { id: 4, name: "Advanced Search", key: "AdvancedSearch" },
    { id: 5, name: "Rankings", key: "Rankings" },
    { id: 6, name: "Blogs", key: "Blogs" },
  ]

  const handleClick = async (key: string) => {
    setActive(key)

    if (key === "Blogs") {
      setMobileMenuOpen(false)
      return router.push("/blogs")
    }

    setSearchClicked(false)

    const scrollToForm = () => {
      const formSection = document.getElementById("form-section")
      if (formSection) {
        const yOffset = -250
        const y =
          formSection.getBoundingClientRect().top + window.pageYOffset + yOffset

        window.scrollTo({ top: y, behavior: "smooth" })
      }
    }

    if (window.location.pathname !== "/") {
      router.push("/")
      setTimeout(scrollToForm, 350)
    } else {
      scrollToForm()
    }

    setMobileMenuOpen(false)
  }

  // -----------------------------------
  // 🔥 DRAGGABLE SCROLL FUNCTIONALITY
  // -----------------------------------
  const scrollRef = useRef<HTMLDivElement>(null)
  const isDown = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const onMouseDown = (e: React.MouseEvent) => {
    isDown.current = true
    startX.current = e.pageX - scrollRef.current!.offsetLeft
    scrollLeft.current = scrollRef.current!.scrollLeft
  }

  const stopDrag = () => {
    isDown.current = false
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current!.offsetLeft
    const walk = x - startX.current
    scrollRef.current!.scrollLeft = scrollLeft.current - walk
  }

  return (
    <>
      {/* main navbar */}
      <div className="bg-[#1B212E] flex md:flex-row items-center justify-between h-[71px] px-4 gap-2">
        {/* Navigation buttons - SCROLLABLE + DRAGGABLE */}
        <div
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseLeave={stopDrag}
          onMouseUp={stopDrag}
          onMouseMove={onMouseMove}
          className="hidden md:flex items-center flex-[2] lg:ml-[60px]
            overflow-x-auto scrollbar-hide whitespace-nowrap
            gap-6 px-2 mask-linear-fade select-none cursor-grab active:cursor-grabbing"
        >
          {navElements.map((element) => (
            <button
              key={element.id}
              className="navbar-element md:text-[14px] lg:text-[18px] cursor-pointer hover:scale-105 hover:font-bold transition-transform duration-200 shrink-0"
              onClick={() => handleClick(element.key)}
            >
              <span className="relative text-white">
                {element.name}
                {active === element.key && (
                  <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-gray-400"></span>
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Searchbar section */}
        <div className="w-full md:w-[240px] md:flex-[1.2] lg:w=[300px] xl:w=[380px] 2xl:w=[440px] lg:mr-[70px] shrink-0">
          <Searchbar />
        </div>
      </div>

      {/* mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-[13%] left-0 w-full bg-white text-[#2A2A2A] z-[999] md:hidden px-[16px] py-[18px] flex flex-col gap-4 animate-slideDown shadow-xl">
          {navElements.map((element) => (
            <button
              key={element.id}
              className="text-left text-sm border-b border-[#E5E7EB] py-2 hover:bg-gray-50"
              onClick={() => handleClick(element.key)}
            >
              {element.name}
            </button>
          ))}
        </div>
      )}
    </>
  )
}
