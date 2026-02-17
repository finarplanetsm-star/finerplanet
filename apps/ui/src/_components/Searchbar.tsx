"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Blog,
  BlogSearchResult,
  searchBlogTitles,
} from "@/api/services/blogs.service"

import { MagnifyingSearch } from "../../public/common-svg"

export default function Searchbar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<BlogSearchResult[]>([])
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [highlightIndex, setHighlightIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const inputTextSize =
    "text-[8px] md:text-[9px] lg:text-[12px] xl:text-[14px] 2xl:text-[16px]"
  // Debounce input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(handler)
  }, [query])

  // Fetch results
  useEffect(() => {
    const fetchBlogs = async () => {
      if (!debouncedQuery.trim()) {
        setResults([])
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        const blogs = await searchBlogTitles(debouncedQuery)
        setResults(blogs)
        setHighlightIndex(0)
      } catch (err) {
        console.error("Search error:", err)
        setResults([])
      }

      setLoading(false)
    }

    fetchBlogs()
  }, [debouncedQuery])

  const handleEnter = () => {
    if (results.length === 0) return

    const selected = results[highlightIndex]

    router.push(`/blogs/${encodeURIComponent(selected.title)}`)

    setQuery("")
    setResults([])
  }

  return (
    <div className="relative z-10">
      <div className="relative w-full">
        <MagnifyingSearch
          className="absolute
          left-3 md:left-3 lg:left-3 xl:left-4 2xl:left-4
          top-1/2 -translate-y-1/2 text-black
          w-3 h-3 md:w-3 md:h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-5 2xl:h-5"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search blogs..."
          className={`searchbar-text w-full ${inputTextSize}
             h-[30px] md:h-[32px] lg:h-[38px] xl:h-[44px] 2xl:h-[48px]
             border
             text-[8px] md:text-[9px] lg:text-[12px] xl:text-[14px] 2xl:text-[16px]
             rounded-md md:rounded-lg lg:rounded-xl
             pl-7 md:pl-7 lg:pl-9 xl:pl-11 2xl:pl-12
             pr-3 md:pr-3 lg:pr-3 xl:pr-4 2xl:pr-4
             focus:outline-none focus:ring-1 focus:ring-white/20
             transition-all`}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setHighlightIndex((prev) =>
                Math.min(prev + 1, results.length - 1)
              )
            }
            if (e.key === "ArrowUp") {
              e.preventDefault()
              setHighlightIndex((prev) => Math.max(prev - 1, 0))
            }
            if (e.key === "Enter") {
              e.preventDefault()
              handleEnter()
            }
            if (e.key === "Escape") {
              setResults([])
            }
          }}
        />
      </div>

      {/* Dropdown */}
      {(loading || results.length > 0) && (
        <div className="absolute top-full bg-white border border-gray-300 mt-1 w-full z-20 max-h-64 overflow-y-auto rounded-lg shadow-lg">
          {/* Loading state */}
          {loading && (
            <div className="px-4 py-2 text-gray-500 text-sm italic">
              Searching...
            </div>
          )}

          {/* Results */}
          {!loading &&
            results.map((blog, index) => {
              const parts = blog.title.split(
                new RegExp(`(${debouncedQuery})`, "gi")
              )

              return (
                <div
                  id={`result-${index}`}
                  key={blog.id}
                  onClick={() => {
                    router.push(`/blogs/${encodeURIComponent(blog.title)}`)
                    setQuery("")
                    setResults([])
                  }}
                  className={`cursor-pointer px-3 md:px-4 py-2 text-sm md:text-base transition-colors ${inputTextSize} ${
                    highlightIndex === index
                      ? "bg-gray-200"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {parts.map((part, i) =>
                    part.toLowerCase() === debouncedQuery.toLowerCase() ? (
                      <span key={i} className="bg-yellow-300 font-semibold">
                        {part}
                      </span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}
