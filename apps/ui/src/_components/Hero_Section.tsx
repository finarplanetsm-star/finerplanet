"use client"

import { useEffect, useState } from "react"
import { FilterProvider } from "@/context/filterArticleContext"
import { useNav } from "@/context/NavContext"

import type { Article } from "@/api/services/articlesCache"

import {
  PublicationLogo,
  ResearchLogo,
  UpdatedAtLogo,
} from "../../public/articleSvg/article-svg"
import ResearchImpactSection from "./ResearchImpactSection"
import ResultsSection from "./ResultsSection"
import SearchByForm from "./SearchByForm"
import TopSnapshotSection from "./TopSnapshotSection"

interface HeroSectionProps {
  initialArticles: Article[]
}

export default function Hero_Section({ initialArticles }: HeroSectionProps) {
  const { active } = useNav()
  console.log(active)

  // State for Mobile Overlay visibility
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)
  const [hasAutoOpened, setHasAutoOpened] = useState(false)

  useEffect(() => {
    const isSearchByPage =
      active === "SearchByAuthor" ||
      active === "SearchByArticles" ||
      active === "SearchByUniversity"

    // Check if on mobile device (screen width < 1024px which is the lg breakpoint)
    const isMobile = typeof window !== "undefined" && window.innerWidth < 1024

    if (isSearchByPage && isMobile) {
      setIsOverlayOpen(true)
      setHasAutoOpened(true)
    } else {
      setHasAutoOpened(false)
    }
  }, [active])

  // Prevent background scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = isOverlayOpen ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOverlayOpen])

  const sectionTitles: Record<string, string> = {
    AuthorsRanking: "AUTHORS RANKING",
    UniversityRanking: "UNIVERSITY RANKING",
    SearchByAuthor: "SEARCH BY AUTHOR",
    SearchByArticles: "SEARCH BY ARTICLE",
    SearchByUniversity: "SEARCH BY UNIVERSITY",
    Journals: "JOURNALS",
    Methodology: "METHODOLOGY",
    Blogs: "BLOGS",
  }

  const displayTitle = sectionTitles[active]

  return (
    <FilterProvider>
      <div className="relative w-full">
        {/* --- MOBILE OVERLAY (Using SearchByForm) --- */}
        {isOverlayOpen && (
          <div className="lg:hidden fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Overlay Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
              <h2 className="typo-mobile-h5">Filters</h2>
              <button
                onClick={() => setIsOverlayOpen(false)}
                className="typo-mobile-body-md text-[#44525D] font-medium text-lg"
              >
                Close ✕
              </button>
            </div>

            {/* Overlay Body - REUSING YOUR FORM */}
            <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-4">
              <SearchByForm articles={initialArticles} />
            </div>

            {/* Overlay Footer */}
            <div className="p-4 border-t bg-white flex justify-end">
              <button
                onClick={() => setIsOverlayOpen(false)}
                className="text-desktop-body-md text-right font-bold text-[#2A424B]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* --- MAIN HERO CONTENT --- */}
        <section className="relative w-full bg-no-repeat bg-cover bg-center">
          <div className="flex flex-col items-center justify-center pt-6 md:pt-[78px] px-4">
            <div className="hidden md:flex h-6 items-center justify-center mb-2">
              {displayTitle && (
                <p className="typo-desktop-body-xs-heading uppercase tracking-[0.15px] text-[#253430]">
                  <span className="relative inline-block whitespace-nowrap">
                    {displayTitle}
                    {/* ✅ FIXED: Underline only on md and above devices */}
                    <span className="absolute left-0 bottom-0 h-0.5 w-full bg-[#2F7664]" />
                  </span>
                </p>
              )}
            </div>

            <h1 className="article-title typo-mobile-h1 md:typo-desktop-h1 text-center text-[#253430]">
              The Finerplanet™
              <br />
              <span className="">Business School Research Rankings</span>
            </h1>

            <div className="flex w-full text-[#44525D] max-w-[900px] justify-between flex-wrap gap-y-6 mt-[10px]">
              <div className="flex flex-1 flex-col lg:flex-row gap-[10px] justify-center items-center text-center">
                <PublicationLogo />
                <p className="article-info typo-mobile-body-sm md:typo-desktop-body-lg ">
                  15,000+ <br className="lg:hidden" /> Publications
                </p>
              </div>

              <div className="flex flex-1 flex-col lg:flex-row gap-[10px] justify-center items-center text-center">
                <ResearchLogo />
                <p className="article-info typo-mobile-body-sm md:typo-desktop-body-lg">
                  500+ <br className="lg:hidden" /> Researchers
                </p>
              </div>

              <div className="flex flex-1 flex-col lg:flex-row gap-[10px] justify-center items-center text-center">
                <UpdatedAtLogo />
                <p className="article-info typo-mobile-body-sm md:typo-desktop-body-lg ">
                  Updated <br className="lg:hidden" /> 2025
                </p>
              </div>
            </div>
          </div>
        </section>

        {active === "Home" ? (
          <>
            <TopSnapshotSection articles={initialArticles} />
            <ResearchImpactSection />
          </>
        ) : (
          <div className="w-full max-w-[1440px] mx-auto px-6 md:pt-[24px]">
            {/* MOBILE: Trigger Button */}
            <div className="lg:hidden mt-6">
              <button
                className="w-full h-[52px] flex items-center justify-center gap-3 bg-[#DDE7E1] border border-[#2F7664] rounded-lg text-[#253430] font-medium"
                onClick={() => setIsOverlayOpen(true)}
              >
                Search filter
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-[21px] mt-[40px] pb-24">
              {/* DESKTOP: Sidebar (Hidden on mobile) */}
              <div className="hidden lg:block w-full lg:w-[528px] lg:shrink-0">
                <SearchByForm articles={initialArticles} />
              </div>

              {/* Results Area */}
              <div className="flex-1">
                <ResultsSection articles={initialArticles} />
              </div>
            </div>
          </div>
        )}
      </div>
    </FilterProvider>
  )
}
