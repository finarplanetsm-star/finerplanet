"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  applyCommonFilters,
  getAuthorRankings,
  getUniversityRankings,
} from "@/api/services/articles.service"
import { useFilters } from "@/context/filterArticleContext"
import { useNav } from "@/context/NavContext"

import type { RankingFilters } from "@/api/services/articles.service"
import type { Article } from "@/api/services/articlesCache"
import type { SnapshotRow } from "./TopSnapshotSection"

import { useInfiniteScroll } from "@/utils/infiniteScrollHook"

import { Calendar } from "../../public/common-svg"
import { SnapshotTable } from "./TopSnapshotSection"

interface JournalModalProps {
  journalName: string
  articles: Article[]
  filters: RankingFilters
  onClose: () => void
}

function JournalModal({
  journalName,
  articles,
  filters,
  onClose,
}: JournalModalProps) {
  // Calculate statistics for this specific journal
  const { totalCount, topUnis, topAuthors } = useMemo(() => {
    // 1. Create a filter context specific to this journal
    // We keep global filters (Year, Discipline) but force the journalName
    const modalFilters: RankingFilters = {
      ...filters,
      journalName: journalName, // Force specific journal
      universityName: undefined, // Clear these to see accurate "Top" stats within the journal
      authorName: undefined, // regardless of search bar input
    }

    // 2. Get articles for this journal
    const journalArticles = applyCommonFilters(articles, modalFilters)
    const total = journalArticles.length

    // 3. Helper to aggregate and sort counts
    const getTopEntities = (field: "affiliations" | "authors") => {
      const stats = new Map<string, number>()

      journalArticles.forEach((article) => {
        if (!article[field]) return
        const items = article[field]!.split(";")
        items.forEach((item) => {
          const name = item.trim()
          if (name) {
            stats.set(name, (stats.get(name) || 0) + 1)
          }
        })
      })

      // Convert to array, sort desc, take top 3
      return Array.from(stats.entries())
        .map(([name, count]) => ({
          name,
          count,
          percent: total > 0 ? ((count / total) * 100).toFixed(1) : "0.0",
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
    }

    return {
      totalCount: total,
      topUnis: getTopEntities("affiliations"),
      topAuthors: getTopEntities("authors"),
    }
  }, [journalName, articles, filters])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div
        className="bg-white rounded-[24px] w-full max-w-[440px] shadow-2xl p-8 relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-black text-2xl cursor-pointer"
        >
          &times;
        </button>

        <h2 className="text-[22px] font-black uppercase tracking-tight mb-1 text-[#101828]">
          {journalName}
        </h2>

        {/* Dynamic Year Display */}
        <p className="text-[16px] text-gray-600 mb-6">
          Total Articles
          {filters.yearStart || filters.yearEnd
            ? ` (${filters.yearStart || "2016"}–${filters.yearEnd || "2024"})`
            : ""}
          : <span className="font-bold">{totalCount}</span>
        </p>

        <div className="space-y-6">
          {/* TOP UNIVERSITIES SECTION */}
          <section>
            <h3 className="text-[19px] font-bold mb-3 text-[#101828]">
              Top Universities
            </h3>
            <ul className="space-y-2">
              {topUnis.map((uni) => (
                <li
                  key={uni.name}
                  className="text-[16px] text-[#101828] flex items-center gap-2"
                >
                  <span className="shrink-0">•</span>
                  <span>
                    {uni.name} —{" "}
                    <span className="font-bold">
                      {uni.count} ({uni.percent}%)
                    </span>
                  </span>
                </li>
              ))}
              {topUnis.length === 0 && (
                <li className="text-gray-500">
                  No affiliation data available.
                </li>
              )}
            </ul>
          </section>

          {/* TOP AUTHORS SECTION */}
          <section>
            <h3 className="text-[19px] font-bold mb-3 text-[#101828]">
              Top Authors
            </h3>
            <ul className="space-y-2">
              {topAuthors.map((auth) => (
                <li
                  key={auth.name}
                  className="text-[16px] text-[#101828] flex items-center gap-2"
                >
                  <span className="shrink-0">•</span>
                  <span>
                    {auth.name} —{" "}
                    <span className="font-bold">
                      {auth.count} ({auth.percent}%)
                    </span>
                  </span>
                </li>
              ))}
              {topAuthors.length === 0 && (
                <li className="text-gray-500">No author data available.</li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

// format "Last, First" to "First Last"
const formatAuthorName = (name: string) => {
  const [last, first] = name.split(",").map((s) => s.trim())
  return first && last ? `${first} ${last}` : name
}

function ArticleListTable({
  articles,
  active,
}: {
  articles: Article[]
  active: string
}) {
  return (
    <div className="flex flex-col bg-white rounded-[12px] overflow-hidden border border-gray-300 font-body">
      <div className="divide-y divide-gray-300">
        {articles.map((article, index) => {
          let primaryText = article.title
          let secondaryText = article.authors
          let secondaryLabel = "Authors"

          if (active === "SearchByAuthor" || active === "AuthorsRanking") {
            primaryText = article.authors
              .split(";")
              .map((author) => formatAuthorName(author.trim()))
              .join("; ")
            secondaryText = article.title
            secondaryLabel = "Article"
          } else if (
            active === "SearchByUniversity" ||
            active === "UniversityRanking"
          ) {
            primaryText = article.affiliations || "No affiliation data"
            secondaryText = article.title
            secondaryLabel = "Article"
          } else {
            secondaryText = article.authors
              .split(";")
              .map((author) => formatAuthorName(author.trim()))
              .join("; ")
          }

          return (
            <div
              key={`${article.id}-${index}`}
              className="flex flex-col gap-2 p-5 hover:bg-gray-50"
            >
              <div className="typo-desktop-body-md font-bold text-[#101828]">
                {primaryText}
              </div>

              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="text-desktop-body-xs text-[#4A5565] md:flex-1 md:mr-4">
                  <span className="font-medium text-[#2F7664]">
                    {secondaryLabel}:{" "}
                  </span>
                  {secondaryText}
                </div>

                <div className="flex items-center gap-2 text-desktop-body-xs text-[#4A5565] shrink-0">
                  <Calendar className="mt-[1.5px]" />
                  {article.year}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface JournalRowData {
  name: string
  count: number
}

// Added onSelect to props
function JournalListTable({
  journals,
  onSelect,
}: {
  journals: JournalRowData[]
  onSelect: (name: string) => void
}) {
  return (
    <div className="rounded-[12px] overflow-hidden font-body">
      <div className="grid grid-cols-1 gap-4  md:grid-cols-2 md:gap-7">
        {journals.map((journal, index) => (
          <div
            key={index}
            onClick={() => onSelect(journal.name)}
            className="p-5 hover:bg-gray-50 bg-white text-[#364D48] font-medium text-base rounded-[8px] border border-gray-100 shadow-sm cursor-pointer"
          >
            <h3 className="text-[#101828] font-['Segoe_UI'] text-[17px] font-bold leading-[19.69px] mb-2">
              {journal.name}
            </h3>
            <p className="text-[#4A5565] font-['Segoe_UI'] text-[16px] font-bold leading-normal">
              Total Articles:{" "}
              <span className="text-[#4A5565] font-normal">
                {journal.count}
              </span>
            </p>
          </div>
        ))}
        {journals.length === 0 && (
          <div className="p-5 text-gray-400 text-center col-span-1 md:col-span-2">
            No journals found matching your criteria.
          </div>
        )}
      </div>
    </div>
  )
}

interface ResultsSectionProps {
  articles: Article[]
}

export default function ResultsSection({ articles }: ResultsSectionProps) {
  const { active } = useNav()
  const { filters } = useFilters()

  const [showTopBtn, setShowTopBtn] = useState(false)
  const [visibleCount, setVisibleCount] = useState(20)
  const [selectedJournal, setSelectedJournal] = useState<string | null>(null) // Added for modal

  const MAX_RANKING_ITEMS = 100 // ✅ Cap for rankings
  const MAX_ARTICLE_ITEMS = 50 // ✅ Cap for search results

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  useEffect(() => {
    setVisibleCount(20)
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0
    }
  }, [active, filters])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      setShowTopBtn(container.scrollTop > 500)
    }
    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  const { viewType, title, fullData, totalCount, entityLabel, articleCount } =
    useMemo(() => {
      switch (active) {
        case "UniversityRanking": {
          const rankings = getUniversityRankings(articles, filters)
          const toprankings = rankings.slice(0, 100)
          return {
            viewType: "RANKING",
            title: "University Research Rankings",
            fullData: rankings as SnapshotRow[],
            totalCount: rankings.length,
            entityLabel: "Universities",
            articleCount: null,
          }
        }
        case "AuthorsRanking": {
          const rankings = getAuthorRankings(articles, filters)
          const toprankings = rankings.slice(0, 100)
          return {
            viewType: "RANKING",
            title: "Author Research Rankings",
            fullData: rankings as SnapshotRow[],
            totalCount: rankings.length,
            entityLabel: "Authors",
            articleCount: null,
          }
        }
        case "Journals": {
          const filteredList = applyCommonFilters(articles, filters)
          const stats = new Map<string, number>()
          filteredList.forEach((a) => {
            if (a.journalName) {
              stats.set(a.journalName, (stats.get(a.journalName) || 0) + 1)
            }
          })
          const journalData: JournalRowData[] = Array.from(stats.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => a.name.localeCompare(b.name))

          return {
            viewType: "JOURNALS",
            title: "Journal Summary Statistics",
            fullData: journalData,
            totalCount: journalData.length,
            entityLabel: "Journals",
            tableHeader: null,
            articleCount: null,
          }
        }
        case "SearchByUniversity":
        case "SearchByAuthor":
        case "SearchByArticles":
        case "SearchBy": {
          const hasUniversityQuery =
            active === "SearchByUniversity" && filters.universityName
          const hasAuthorQuery =
            active === "SearchByAuthor" && filters.authorName
          const hasArticleQuery =
            (active === "SearchByArticles" || active === "SearchBy") &&
            (filters.title || filters.authorName || filters.universityName)

          const hasJournalFilters =
            (filters.journals && filters.journals.length > 0) ||
            filters.journalGroup ||
            filters.discipline ||
            filters.yearStart ||
            filters.yearEnd

          const shouldShowResults =
            hasUniversityQuery ||
            hasAuthorQuery ||
            hasArticleQuery ||
            hasJournalFilters

          if (!shouldShowResults) {
            return {
              viewType: "NO_SEARCH",
              title: "",
              fullData: [],
              totalCount: 0,
              entityLabel: "",
              tableHeader: null,
              articleCount: 0,
            }
          }

          const filteredList = applyCommonFilters(articles, filters)
          // Sort by year descending (most recent first) and limit to top 50
          const sortedAndLimited = [...filteredList]
            .sort((a, b) => (b.year || 0) - (a.year || 0))
            .slice(0, 50)
          let displayTitle = "Top Articles by Research Output"

          return {
            viewType: "LIST",
            title: displayTitle,
            fullData: sortedAndLimited,
            totalCount: sortedAndLimited.length,
            entityLabel: "Articles",
            tableHeader: null,
            articleCount: sortedAndLimited.length,
          }
        }
        default:
          return {
            viewType: "EMPTY",
            title: "",
            fullData: [],
            totalCount: 0,
            entityLabel: "Items",
            tableHeader: null,
            articleCount: null,
          }
      }
    }, [active, articles, filters])

  const visibleData = fullData.slice(0, visibleCount)
  const hasMore =
    active === "UniversityRanking" || active === "AuthorsRanking"
      ? visibleCount < Math.min(fullData.length, MAX_RANKING_ITEMS)
      : viewType === "LIST"
        ? visibleCount < Math.min(fullData.length, MAX_ARTICLE_ITEMS)
        : visibleCount < fullData.length

  useInfiniteScroll({
    hasMore,
    loading: false,
    offset: 200,
    onLoadMore: () => {
      setVisibleCount((prev) => {
        // ✅ Cap at 100 for rankings
        if (active === "UniversityRanking" || active === "AuthorsRanking") {
          return Math.min(prev + 50, MAX_RANKING_ITEMS)
        }
        // ✅ Cap at 50 for search results
        if (viewType === "LIST") {
          return Math.min(prev + 50, MAX_ARTICLE_ITEMS)
        }
        return prev + 50
      })
    },
    targetRef: scrollContainerRef,
  })

  return (
    <div className="w-full">
      {/* Modal - only rendered when a journal is selected */}
      {selectedJournal && (
        <JournalModal
          journalName={selectedJournal}
          articles={articles} // Pass full data
          filters={filters} // Pass current filters (years, discipline)
          onClose={() => setSelectedJournal(null)}
        />
      )}

      {/* Result Summary Card - Only show when not in NO_SEARCH state */}
      {viewType !== "NO_SEARCH" && (
        <div className="w-full mb-[16px]">
          <div className="w-full rounded-[14px] border border-[#E5E7EB] bg-white shadow-sm px-[22px] py-[21px]">
            <div className="text-left flex-1">
              <h1 className="typo-desktop-body-lg-medium text-[#253430]">
                {title}
              </h1>

              {viewType === "LIST" ? (
                <p className="article-found-article-text text-[#44525D]">
                  Showing top 50 most recent articles matching your criteria
                </p>
              ) : viewType === "JOURNALS" ? (
                <p className="article-found-article-text text-[#44525D]">
                  Found 51 journals matching your criteria
                </p>
              ) : (
                <p className="article-found-article-text text-[#44525D]">
                  Found Top 100 {entityLabel} matching your criteria
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="relative w-full">
        <div
          ref={scrollContainerRef}
          className="w-full h-[836px] overflow-y-auto pr-2 custom-scrollbar"
        >
          {viewType === "RANKING" ? (
            <SnapshotTable
              title={active === "UniversityRanking" ? "University" : "Author"}
              rows={visibleData as SnapshotRow[]}
            />
          ) : viewType === "JOURNALS" ? (
            <JournalListTable
              journals={visibleData as JournalRowData[]}
              onSelect={setSelectedJournal}
            />
          ) : viewType === "LIST" ? (
            <ArticleListTable
              articles={visibleData as Article[]}
              active={active}
            />
          ) : viewType === "NO_SEARCH" ? (
            <div className="w-full md:p-20 p-5 bg-white rounded-[14px] border-2 border border-gray-100 text-center text-gray-500 font-medium">
              Use the filters on the left to select years and journals, and
              optionally search by article title. If you do not use the search
              line, then all articles published in the chosen journals between
              Start and End Years are returned. If no journals are selected,
              then articles from all journals in the chosen timeframe are
              returned.
            </div>
          ) : (
            <div className="w-full p-20 bg-white rounded-[14px] border-2 border-dashed border-gray-100 text-center text-gray-400 font-medium">
              Select a tab to view results
            </div>
          )}

          {hasMore && (
            <div className="py-6 text-center text-gray-400">
              Loading more results...
            </div>
          )}
        </div>

        {showTopBtn && (
          <button
            onClick={scrollToTop}
            className="absolute bottom-6 right-6 z-50 bg-[#2F7664] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            Go to Top ↑
          </button>
        )}
      </div>
    </div>
  )
}
