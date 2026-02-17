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
    <div className="relative ">
      <div className="relative w-full">
        <MagnifyingSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white" />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search blogs..."
          className="searchbar-text w-full h-[50px]  placeholder-[#F8F8FA] rounded-xl bg-[#4D5056] pl-12 p-4"
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
        <div className="absolute bg-white border border-black mt-1 w-full z-50 max-h-64 overflow-y-auto rounded">
          {/* Loading state */}
          {loading && <div className="px-4 py-2 text-gray-500 italic">...</div>}

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
                  className={`cursor-pointer px-4 py-2 ${
                    highlightIndex === index
                      ? "bg-gray-300"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {parts.map((part, i) =>
                    part.toLowerCase() === debouncedQuery.toLowerCase() ? (
                      <span key={i} className="bg-yellow-300">
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
