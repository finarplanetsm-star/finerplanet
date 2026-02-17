import type { Article } from "./articlesCache"

// --- 1. TYPES ---
export type RankingFilters = {
  universityName?: string
  authorName?: string
  title?: string
  journalName?: string
  journals?: string[]
  journalGroup?: string
  discipline?: string
  yearStart?: string
  yearEnd?: string
  query?: string
}

// --- 2. THE BRAIN: CENTRAL FILTERING LOGIC ---
export function applyCommonFilters(
  articles: Article[],
  filters: RankingFilters
) {
  return articles?.filter((a) => {
    // A. Year Range
    if (filters.yearStart && a.year < parseInt(filters.yearStart)) return false
    if (filters.yearEnd && a.year > parseInt(filters.yearEnd)) return false

    // B. Discipline
    if (
      filters.discipline &&
      filters.discipline !== "All" &&
      a.disciplineAbbr !== filters.discipline
    )
      return false

    // C. Journal Group
    if (filters.journalGroup === "UTD24" && !a.utd24) return false
    if (filters.journalGroup === "FT50" && !a.ft50) return false

    // D. Specific Journals
    if (filters.journals && filters.journals.length > 0) {
      if (!filters.journals.includes(a.journalName)) return false
    }

    // E. Author Name Search (Article Level)
    if (filters.authorName) {
      if (
        !a.authors ||
        !a.authors.toLowerCase().includes(filters.authorName.toLowerCase())
      ) {
        return false
      }
    }

    // F. University Name Search (Article Level)
    if (filters.universityName) {
      if (
        !a.affiliations ||
        !a.affiliations
          .toLowerCase()
          .includes(filters.universityName.toLowerCase())
      ) {
        return false
      }
    }

    if (filters.title) {
      if (
        !a.title ||
        !a.title.toLowerCase().includes(filters.title.toLowerCase())
      ) {
        return false
      }
    }

    if (filters.journalName) {
      if (
        !a.journalName ||
        !a.journalName.toLowerCase().includes(filters.journalName.toLowerCase())
      ) {
        return false
      }
    }

    return true
  })
}
// --- 3. FEATURE: UNIVERSITY & AUTHOR RANKINGS ---
export function getUniversityRankings(
  articles: Article[],
  filters: RankingFilters
) {
  // 1. Apply filters first
  const filtered = applyCommonFilters(articles, filters)

  // 2. Count universities in filtered data
  const filteredStats = new Map<string, number>()

  filtered.forEach((a) => {
    if (!a.affiliations) return

    const unis = a.affiliations.split(";")
    unis.forEach((u) => {
      const name = u.trim()
      if (!name) return

      if (
        filters.universityName &&
        !name.toLowerCase().includes(filters.universityName.toLowerCase())
      ) {
        return
      }

      filteredStats.set(name, (filteredStats.get(name) || 0) + 1)
    })
  })

  // 3. Sort by count DESC
  const sorted = Array.from(filteredStats.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  // 4. Assign ranks with standard competition ranking (ties share rank, then skip)
  let currentRank = 1

  return sorted.map((item, index) => {
    if (index > 0 && item.count < sorted[index - 1].count) {
      currentRank = index + 1 // Standard competition ranking: next rank = position
    }

    return {
      name: item.name,
      count: item.count,
      rank: currentRank,
    }
  })
}

// --- 3. FEATURE: AUTHOR RANKINGS ---
export function getAuthorRankings(
  articles: Article[],
  filters: RankingFilters
) {
  // 1. Apply filters first
  const filtered = applyCommonFilters(articles, filters)

  // 2. Count authors in filtered data
  const filteredStats = new Map<string, number>()

  filtered.forEach((a) => {
    if (!a.authors) return

    const authorList = a.authors.split(";")
    authorList.forEach((auth) => {
      const name = auth.trim()
      if (!name) return

      if (
        filters.authorName &&
        !name.toLowerCase().includes(filters.authorName.toLowerCase())
      ) {
        return
      }

      filteredStats.set(name, (filteredStats.get(name) || 0) + 1)
    })
  })

  // 3. Sort by count DESC
  const sorted = Array.from(filteredStats.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  // 4. Assign ranks with standard competition ranking (ties share rank, then skip)
  let currentRank = 1

  return sorted.map((item, index) => {
    if (index > 0 && item.count < sorted[index - 1].count) {
      currentRank = index + 1 // Standard competition ranking: next rank = position
    }

    return {
      name: item.name,
      count: item.count,
      rank: currentRank,
    }
  })
}

// --- 4. UTILITY: DYNAMIC DROPDOWN OPTIONS ---
export function getFilterOptions(articles: Article[], discipline?: string) {
  const journals = new Set<string>()
  const disciplines = new Set<string>()

  articles.forEach((a) => {
    if (a.disciplineAbbr) disciplines.add(a.disciplineAbbr)

    if (
      !discipline ||
      discipline === "All" ||
      a.disciplineAbbr === discipline
    ) {
      if (a.journalName) journals.add(a.journalName)
    }
  })

  return {
    journals: Array.from(journals).sort(),
    disciplines: Array.from(disciplines).sort(),
  }
}

// --- 5. UTILITY: GET ALL UNIVERSITIES ---
export function getAllUniversities(articles: Article[]): string[] {
  const universities = new Set<string>()

  articles.forEach((a) => {
    if (!a.affiliations) return

    const unis = a.affiliations.split(";")
    unis.forEach((u) => {
      const name = u.trim()
      if (name) universities.add(name)
    })
  })

  return Array.from(universities).sort()
}
