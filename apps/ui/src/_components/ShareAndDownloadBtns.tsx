"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"

// Inline Icons for the Share Menu
const LinkedinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="#0077b5"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)
const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
)

interface Props {
  pdfUrl: string
}

export default function ShareAndDownloadButtons({ pdfUrl }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [currentUrl, setCurrentUrl] = useState("")
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 1. Check Auth
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)

    // 2. Get URL
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href)
    }

    // 3. Close share menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleDownload = () => {
    if (!pdfUrl) return alert("PDF not available.")
    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = pdfUrl.split("/").pop() || "article.pdf"
    link.click()
  }

  // Share Links
  const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`
  const twitterShare = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`

  return (
    <div className="flex flex-nowrap gap-3 justify-between md:justify-end items-center w-full relative">
      {/* --- Share Button (Original Design) --- */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="flex items-center gap-2 cursor-pointer hover:scale-105 transform transition-all duration-300 ease-in-out py-2 px-3 md:py-3 md:px-5 rounded-[9px] border border-black shadow-[0_0_10px_0_rgba(0,0,0,0.1)] bg-white"
        >
          <p className="text-sm md:text-base xl:text-[14px] 2xl:text-[20px]">
            Share
          </p>
          <Image src="/share-icon.svg" alt="share" width={15} height={15} />
        </button>

        {/* Share Popup Menu (Shows LinkedIn & X) */}
        {showShareMenu && (
          <div className="absolute top-full mt-2 left-0 w-max bg-white border border-gray-200 shadow-xl rounded-lg p-3 z-20 flex gap-3 animate-in fade-in zoom-in-95 duration-200">
            <a
              href={linkedinShare}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium hover:bg-gray-50 p-2 rounded transition-colors"
            >
              <LinkedinIcon />
              <span className="hidden md:inline">LinkedIn</span>
            </a>
            <div className="w-[1px] bg-gray-200"></div>
            <a
              href={twitterShare}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium hover:bg-gray-50 p-2 rounded transition-colors"
            >
              <XIcon />
              <span className="hidden md:inline">X</span>
            </a>
          </div>
        )}
      </div>

      {/* --- Download Button (Original Design + Gated Logic) --- */}
      <div className="relative group">
        <button
          onClick={isLoggedIn ? handleDownload : undefined}
          disabled={!isLoggedIn}
          className={`
            flex items-center justify-center cursor-pointer whitespace-nowrap 
            hover:scale-105 transform transition-all duration-300 ease-in-out 
            py-2 px-3 md:py-3 md:px-5 
            text-sm md:text-base xl:text-[14px] 2xl:text-[20px] 
            text-white rounded-[9px] shadow-[0_0_10px_0_rgba(0,0,0,0.1)]
            ${isLoggedIn ? "bg-[#3B3098]" : "bg-gray-400 cursor-not-allowed opacity-80"}
          `}
        >
          Download PDF / Doc
        </button>

        {/* Tooltip for Non-Logged In Users */}
        {!isLoggedIn && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max z-10">
            <div className="bg-gray-800 text-white text-xs rounded py-2 px-3 shadow-lg relative">
              Please{" "}
              <Link
                href="/login"
                className="underline text-blue-300 font-bold hover:text-blue-200"
              >
                login
              </Link>{" "}
              to download
              {/* Tooltip Triangle */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
