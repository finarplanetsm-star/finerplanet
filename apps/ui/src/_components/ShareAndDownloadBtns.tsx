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
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)

    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href)
    }

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

  const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`
  const twitterShare = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`

  const baseBtn =
    "h-[44px] md:h-[52px] flex items-center justify-center whitespace-nowrap rounded-[9px] shadow-[0_0_10px_0_rgba(0,0,0,0.1)] transform transition-all duration-300 ease-in-out"

  return (
    <div className="flex flex-col gap-3 items-end w-full relative">
      {/* --- TOP ROW: Download Button --- */}
      <div className="relative group">
        <button
          onClick={isLoggedIn ? handleDownload : undefined}
          disabled={!isLoggedIn}
          className={`${baseBtn} px-3 md:px-5 hover:opacity-65 text-white ${
            isLoggedIn
              ? "bg-[#3A6E63] cursor-pointer"
              : "bg-gray-400 opacity-80 cursor-not-allowed"
          }`}
        >
          Download PDF / Doc
        </button>

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
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>
        )}
      </div>

      {/* --- BOTTOM ROW: Share and Comments --- */}
      <div className="flex flex-wrap gap-3 justify-end items-center w-full">
        {/* Share Button */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className={`${baseBtn} gap-2 border border-black bg-white hover:opacity-65 px-3 md:px-5 cursor-pointer`}
          >
            <p className=" xl:text-[14px] 2xl:text-[17px]">Share</p>
            <Image src="/share-icon.svg" alt="share" width={15} height={15} />
          </button>

          {showShareMenu && (
            <div className="absolute top-full mt-2 right-0 w-max bg-white border border-gray-200 shadow-xl rounded-lg p-3 z-20 flex gap-3 animate-in fade-in zoom-in-95 duration-200">
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

        {/* Comments & Corrections */}
        <div className="relative group">
          <a
            href={
              isLoggedIn
                ? "https://docs.google.com/forms/d/e/1FAIpQLSfVwX7Yff1nSb0dIK75cT1vryZMCx2g-w1bnD1KkQ77sA9wWg/viewform"
                : "#"
            }
            target={isLoggedIn ? "_blank" : undefined}
            rel={isLoggedIn ? "noopener noreferrer" : undefined}
            onClick={(e) => {
              if (!isLoggedIn) e.preventDefault()
            }}
            className={`${baseBtn} border border-black px-3 md:px-5 hover:opacity-65 ${
              isLoggedIn
                ? "bg-white text-black cursor-pointer"
                : "bg-gray-400 text-white opacity-80 cursor-not-allowed"
            }`}
          >
            Comments &amp; Corrections
          </a>

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
                to submit corrections or feedback
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
