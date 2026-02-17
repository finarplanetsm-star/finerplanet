"use client"

import React, { createContext, ReactNode, useContext, useState } from "react"
import {
  getArticlesByFiltering,
  getArticleTitles,
  getFirstNames,
  getJournalNames,
  getLastNames,
  PaginatedOptions, // Make sure to export this from articles.service.ts
} from "@/api/services/articles.service"

interface FormValues {
  firstName: string[]
  lastName: string[]
  yearStart: string
  yearEnd: string
  journal: string[]
  articleName: string[]
}

interface Author {
  firstName: string
  lastName: string
}

interface Article {
  id: number
  documentId: string
  title: string
  year: number
  volume: string
  journalName: string
  journalAbbreviation: string
  author: Author[]
}

// Re-using the structure from the service for consistency
interface PaginatedResult {
  options: { value: string; label: string }[]
  hasMore: boolean
}

interface ArticleSearchContextType {
  filters: FormValues
  setFilters: (filters: FormValues) => void
  articles: Article[]
  isLoading: boolean
  error: string | null
  fetchArticles: (
    filtersParam?: FormValues,
    loadMore?: boolean,
    isLatest?: boolean
  ) => Promise<void>
  searchClicked: boolean
  setSearchClicked: (value: boolean) => void
  hasMore: boolean
  page: number
  // UPDATED SIGNATURES
  fetchFirstNames: (query: string, page: number) => Promise<PaginatedResult>
  fetchLastNames: (query: string, page: number) => Promise<PaginatedResult>
  fetchJournals: (query: string, page: number) => Promise<PaginatedResult>
  fetchArticleNames: (query: string, page: number) => Promise<PaginatedResult>
}

const ArticleSearchContext = createContext<
  ArticleSearchContextType | undefined
>(undefined)

export function ArticleSearchProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FormValues>({
    firstName: [],
    lastName: [],
    yearStart: "1990",
    yearEnd: "2025",
    journal: [],
    articleName: [],
  })

  const [articles, setArticles] = useState<Article[]>([])
  const [currentFilters, setCurrentFilters] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchClicked, setSearchClicked] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchArticles = async (
    filtersParam?: FormValues,
    loadMore = false,
    isLatest: boolean = false
  ) => {
    try {
      setIsLoading(true)
      const currentPage = loadMore ? page + 1 : 1
      const activeFilters = filtersParam || currentFilters || filters

      if (filtersParam) setCurrentFilters(filtersParam)

      const { articles: newData, pagination } = await getArticlesByFiltering(
        activeFilters,
        currentPage,
        25,
        isLatest
      )

      setPage(currentPage)
      setHasMore(currentPage < pagination.pageCount)
      setArticles(loadMore ? [...articles, ...newData] : newData)
    } catch (err: any) {
      setError(err.message || "Error fetching articles")
      setArticles([])
    } finally {
      setIsLoading(false)
    }
  }

  // --- UPDATED DROPDOWN HELPERS ---

  const fetchFirstNames = async (
    query: string,
    page: number
  ): Promise<PaginatedResult> => {
    try {
      return await getFirstNames(query, page)
    } catch {
      return { options: [], hasMore: false }
    }
  }

  const fetchLastNames = async (
    query: string,
    page: number
  ): Promise<PaginatedResult> => {
    try {
      return await getLastNames(query, page)
    } catch {
      return { options: [], hasMore: false }
    }
  }

  const fetchJournals = async (
    query: string,
    page: number
  ): Promise<PaginatedResult> => {
    try {
      return await getJournalNames(query, page)
    } catch {
      return { options: [], hasMore: false }
    }
  }

  const fetchArticleNames = async (
    query: string,
    page: number
  ): Promise<PaginatedResult> => {
    try {
      return await getArticleTitles(query, page)
    } catch {
      return { options: [], hasMore: false }
    }
  }

  return (
    <ArticleSearchContext.Provider
      value={{
        filters,
        setFilters,
        articles,
        isLoading,
        error,
        fetchArticles,
        searchClicked,
        setSearchClicked,
        hasMore,
        page,
        fetchFirstNames,
        fetchLastNames,
        fetchJournals,
        fetchArticleNames,
      }}
    >
      {children}
    </ArticleSearchContext.Provider>
  )
}

export function useArticleSearch() {
  const context = useContext(ArticleSearchContext)
  if (!context)
    throw new Error(
      "useArticleSearch must be used within ArticleSearchProvider"
    )
  return context
}
