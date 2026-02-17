"use client"

import React, { createContext, ReactNode, useContext, useState } from "react"

import type { RankingFilters } from "@/api/services/articles.service"
import type { Article } from "@/api/services/articlesCache"

// Define the shape of our context
interface FilterContextType {
  filters: RankingFilters
  setFilters: (filters: RankingFilters) => void
  updateFilter: (key: keyof RankingFilters, value: any) => void
  resetFilters: () => void
  initializeYearRange: (articles: Article[]) => void
}

const getDefaultFilters = (articles?: Article[]): RankingFilters => {
  let yearStart = "2008"
  let yearEnd = "2024"

  if (articles && articles.length > 0) {
    const years = articles.map((a) => a.year).filter(Boolean)
    if (years.length > 0) {
      yearStart = String(Math.min(...years))
      yearEnd = String(Math.max(...years))
    }
  }

  return {
    universityName: "",
    authorName: "",
    title: "",
    journals: [],
    journalName: "",
    journalGroup: "",
    discipline: "",
    yearStart,
    yearEnd,
  }
}

const defaultFilters: RankingFilters = getDefaultFilters()

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<RankingFilters>(defaultFilters)

  const updateFilter = (key: keyof RankingFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
  }

  const initializeYearRange = (articles: Article[]) => {
    const years = articles.map((a) => a.year).filter(Boolean)
    if (years.length > 0) {
      const minYear = String(Math.min(...years))
      const maxYear = String(Math.max(...years))
      setFilters((prev) => ({
        ...prev,
        yearStart: prev.yearStart || minYear,
        yearEnd: prev.yearEnd || maxYear,
      }))
    }
  }

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        initializeYearRange,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider")
  }
  return context
}
