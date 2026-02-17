import { apiClient } from "../lib/lib/apiClient"

type Filters = {
  firstName?: string[]
  lastName?: string[]
  yearStart?: string
  yearEnd?: string
  journal?: string[]
  articleName?: string[]
  universityName?: string[]
  authorsName?: string[]
}

interface Pagination {
  page: number
  pageSize: number
  pageCount: number
  total: number
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

export const getArticlesByFiltering = async (
  filters: Filters = {},
  page = 1,
  pageSize = 25,
  isLatest = false
): Promise<{ articles: Article[]; pagination: Pagination }> => {
  try {
    const {
      firstName = [],
      lastName = [],
      yearStart,
      yearEnd,
      journal = [],
      articleName = [],
    } = filters

    const query = []

    query.push("populate=author")
    query.push(`pagination[page]=${page}`)
    query.push(`pagination[pageSize]=${pageSize}`)

    if (yearStart) query.push(`filters[year][$gte]=${yearStart}`)
    if (yearEnd) query.push(`filters[year][$lte]=${yearEnd}`)
    if (journal.length) {
      journal.forEach((j, index) => {
        query.push(
          `filters[journalName][$in][${index}]=${encodeURIComponent(j)}`
        )
      })
    }
    if (articleName.length) {
      articleName.forEach((a, index) => {
        query.push(`filters[title][$in][${index}]=${encodeURIComponent(a)}`)
      })
    }
    if (lastName.length) {
      lastName.forEach((l, index) => {
        query.push(
          `filters[author][lastName][$in][${index}]=${encodeURIComponent(l)}`
        )
      })
    }

    if (firstName.length) {
      firstName.forEach((f, index) => {
        query.push(
          `filters[author][firstName][$in][${index}]=${encodeURIComponent(f)}`
        )
      })
    }

    isLatest ? query.push("sort[0]=year:desc") : query.push("sort[0]=year:asc")

    const queryString = query.join("&")

    const strapiPath = `articles?${queryString}`

    const res = await apiClient.get(strapiPath)

    const articlesData = res.data.data
    const pagination = res.data.meta.pagination

    return {
      articles: articlesData,
      pagination,
    }
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message || "Failed to fetch articles")
  }
}

export interface PaginatedOptions {
  options: { label: string; value: string }[]
  hasMore: boolean
}

let defaultOptionsPromise: Promise<any> | null = null

//options functionality

interface CurrentFilters {
  firstName?: string
  lastName?: string
  journalName?: string
  title?: string
}

export async function fetchOptionsFromArticles(
  field: string,
  query: string = "",
  page: number = 1,
  currentFilters: CurrentFilters = {}
): Promise<PaginatedOptions> {
  try {
    const filterMap: Record<string, string> = {
      firstName: "author][firstName",
      lastName: "author][lastName",
      journalName: "journalName",
      title: "title",
    }

    const filterField = filterMap[field]

    const queryParams = []

    // 1. BASE PARAMETERS: Pagination
    queryParams.push(`pagination[page]=${page}`)
    queryParams.push(`pagination[pageSize]=25`)

    // 2. LAYER 1 OPTIMIZATION (The Article Layer)
    // We ALWAYS fetch 'id' and explicitly ignore everything else (abstract, volume, etc.)
    // This dramatically reduces payload size from ~50KB to ~1KB.
    queryParams.push(`fields[0]=id`)

    Object.keys(currentFilters).forEach((filterKey) => {
      const value = currentFilters[filterKey as keyof CurrentFilters]

      // Only apply the filter if:
      // a) It has a value (is not empty)
      // b) It is NOT the field we are currently searching for (don't filter First Name by First Name)
      if (value && filterKey !== field) {
        const strapiFilterPath = filterMap[filterKey]
        // Add exact match filter: filters[author][firstName][$eq]=John
        queryParams.push(
          `filters[${strapiFilterPath}][$eq]=${encodeURIComponent(value)}`
        )
      }
    })

    // 3. SPECIFIC DATA FETCHING based on the requested dropdown
    switch (field) {
      case "firstName":
        // Layer 2: Populate Author component, but ONLY fetch firstName
        queryParams.push(`populate[author][fields][0]=firstName`)
        break
      case "lastName":
        // Layer 2: Populate Author component, but ONLY fetch lastName
        queryParams.push(`populate[author][fields][0]=lastName`)
        break
      case "journalName":
        // Layer 1: We need Journal Name.
        // We use index [1] because index [0] is already taken by 'id' above.
        // We DO NOT populate authors here, saving a database join.
        queryParams.push(`fields[1]=journalName`)
        break
      case "title":
        // Layer 1: We need Title.
        // We use index [1] because index [0] is 'id'.
        // No authors needed.
        queryParams.push(`fields[1]=title`)
        break
    }

    // 4. SEARCH FILTER (If user is typing)
    if (query && query.trim().length > 0) {
      queryParams.push(
        `filters[${filterField}][$containsi]=${encodeURIComponent(query)}`
      )
    }

    // 5. EXECUTE REQUEST
    const strapiPath = `articles?${queryParams.join("&")}`
    const res = await apiClient.get(strapiPath)

    return processArticlesForField(
      res.data.data,
      res.data.meta.pagination,
      field,
      query
    )
  } catch (err: any) {
    console.error(`Error fetching ${field} options:`, err.message)
    return { options: [], hasMore: false }
  }
}

function processArticlesForField(
  articles: any[],
  pagination: any,
  field: string,
  query: string
) {
  const values = new Set<string>()

  articles.forEach((article: any) => {
    if (field === "firstName" || field === "lastName") {
      // Handle Author Array
      article.author?.forEach((a: any) => {
        // If searching, only add matches. If no search (default load), add all valid names.
        if (
          !query ||
          (a[field] && a[field].toLowerCase().includes(query.toLowerCase()))
        ) {
          if (a[field]) values.add(a[field])
        }
      })
    } else {
      // Handle Top-level fields (Journal, Title)
      if (article[field]) {
        // If searching, only add matches.
        if (
          !query ||
          article[field].toLowerCase().includes(query.toLowerCase())
        ) {
          values.add(article[field])
        }
      }
    }
  })

  const options = Array.from(values).map((v) => ({ value: v, label: v }))

  // Determine if more pages exist
  const hasMore = pagination.page < pagination.pageCount

  return { options, hasMore }
}

// Updated wrappers to accept 'query' and 'page'
export const getFirstNames = (
  query: string,
  page: number,
  filters: CurrentFilters
) => fetchOptionsFromArticles("firstName", query, page, filters)

export const getLastNames = (
  query: string,
  page: number,
  filters: CurrentFilters
) => fetchOptionsFromArticles("lastName", query, page, filters)

export const getJournalNames = (
  query: string,
  page: number,
  filters: CurrentFilters
) => fetchOptionsFromArticles("journalName", query, page, filters)

export const getArticleTitles = (
  query: string,
  page: number,
  filters: CurrentFilters
) => fetchOptionsFromArticles("title", query, page, filters)
