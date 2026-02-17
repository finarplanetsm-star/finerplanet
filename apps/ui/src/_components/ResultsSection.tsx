"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useArticleSearch } from "@/context/articleContext"

import { useInfiniteScroll } from "@/utils/infiniteScrollHook"

import { PublishedTime } from "../../public/common-svg"

export default function ResultsSection() {
  const [isLatest, setIsLatest] = useState(false)
  const [showTopBtn, setShowTopBtn] = useState(false)

  const { articles, fetchArticles, hasMore, isLoading } = useArticleSearch()

  useInfiniteScroll({
    hasMore,
    loading: isLoading,
    onLoadMore: () => fetchArticles(undefined, true),
  })

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 700) {
        setShowTopBtn(true)
      } else {
        setShowTopBtn(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {articles.length > 0 && (
        <div className=" flex flex-col justify-center items-center mx-auto max-w-[80%] mt-[10em]">
          <div className="md:flex w-full sticky top-0 z-10 rounded-[14px] border border-gray-200 bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)] px-[21.889px] pt-[20.935px] pb-[21.9px]">
            <div className="text-left flex-1 ">
              <h1 className="article-results-search md:text-[17.5px] text-[16px]">
                Search Results
              </h1>
              <p className="article-found-article-text">
                Found {articles.length} articles matching your criteria
              </p>
            </div>
            <div className="w-full md:flex-[0.3] flex items-center justify-between gap-2 mt-2 md:justify-end md:mt-0">
              <p className="text-center article-found-article-text text-[12.3px]">
                Sort By:
              </p>
              <select
                onChange={(e) => {
                  const selected = e.target.value === "latest"
                  setIsLatest(selected)
                  fetchArticles(undefined, false, selected)
                }}
                value={isLatest ? "latest" : "oldest"}
                className="cursor-pointer articles-sorted-by bg-white px-[14.94px] py-[7.889px] "
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>

          {articles.map((article, index) => (
            <div
              key={index}
              className="rounded-[14px] border w-full  border-[#E5E7EB] bg-white mt-3 mb-3 pt-[21.22px] pr-[21.889px] pb-[21.89px] pl-[21.889px] "
            >
              <div className="md:flex flex-col gap-3">
                <h1 className="article-journal-title">{article.journalName}</h1>
                <div className="flex md:flex-row flex-col md:gap-9 article-details">
                  <p className="max-w-[450px]">Article : {article.title}</p>
                  <p>Journal Abbreviation : {article.journalAbbreviation}</p>
                  <div className="flex gap-2 items-center h-5 ">
                    <PublishedTime />
                    <p>{article.year}</p>
                  </div>
                  <p>Volume: {article.volume}</p>
                </div>

                <div className="flex flex-wrap gap-2 text-[#4A5565] text-[14px]">
                  <p className="font-medium">Authors:</p>
                  {article.author.map((a, i) => (
                    <span key={i} className="flex gap-1">
                      <p>{a.firstName}</p>
                      <p>
                        {a.lastName}
                        {i < article.author.length - 1 && ","}
                      </p>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center items-center py-5">
              <p className="text-gray-500 text-[14px]">
                Loading more articles...
              </p>
            </div>
          )}
        </div>
      )}
      {isLoading && articles.length === 0 && (
        <div className="flex justify-center items-center py-10">
          <p className="text-gray-500 text-[14px]">Loading articles...</p>
        </div>
      )}

      {!isLoading && articles.length === 0 && (
        <h1 className="text-center mt-10 text-gray-600">No results found</h1>
      )}

      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="cursor-pointer fixed bottom-5 right-5 z-50 text-white text-xl px-4 py-2 rounded bg-green-900 hover:bg-green-800 transform transition-all duration-300 ease-in-out hover:scale-105"
        >
          Go to Top
        </button>
      )}
    </>
  )
}
