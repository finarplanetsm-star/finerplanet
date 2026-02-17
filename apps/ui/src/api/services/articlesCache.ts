import { apiClient } from "../lib/lib/apiClient" // Reuse your existing client

// --- 1. Define the "Clean" Shape (What your App wants) ---

export interface Article {
  id: number
  documentId: string
  title: string
  year: number
  journalName: string
  journalAbbreviation: string
  disciplineAbbr: string
  authors: string
}

// --- 2. Global Cache Variables ---
declare global {
  var articleCache: Article[] | undefined
  var articleFetchPromise: Promise<Article[]> | undefined
}

let CACHE = global.articleCache || null
let FETCH_PROMISE = global.articleFetchPromise || null

// --- 4. The Cache Function ---
export const getCachedArticles = async (): Promise<Article[]> => {
  if (CACHE) return CACHE
  if (FETCH_PROMISE) return FETCH_PROMISE

  console.log(
    "🚀 Server: Starting Cold Start - Fetching & Parsing 64k Articles..."
  )

  FETCH_PROMISE = (async () => {
    let allArticles: Article[] = []
    let page = 1
    const pageSize = 100
    let hasMore = true

    try {
      while (hasMore) {
        // Fetch the raw fields from your specific data structure
        const res = await apiClient.get(
          `articles?fields[0]=title&fields[1]=year&fields[2]=journalFullName&fields[3]=journalAbbr&fields[4]=authors&fields[5]=disciplineAbbr&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
        )

        const rawData = res.data.data
        const meta = res.data.meta

        // Transform Raw Data -> Clean Article Type
        const cleanChunk = rawData.map((item: any) => ({
          id: item.id,
          documentId: item.documentId,
          title: item.title,
          year: item.year,
          // Map "journalFullName" to "journalName" to match your Frontend types
          journalName: item.journalFullName,
          journalAbbreviation: item.journalAbbr,
          disciplineAbbr: item.disciplineAbbr,
          rawAuthors: item.authors,
        }))

        allArticles.push(...cleanChunk)
        hasMore = page < meta.pagination.pageCount
        page++
      }

      console.log(`✅ Server: Cached & Parsed ${allArticles.length} articles.`)
      CACHE = allArticles
      global.articleCache = allArticles
      return allArticles
    } catch (err) {
      console.error("❌ Server: Cache failed", err)
      return []
    }
  })()

  global.articleFetchPromise = FETCH_PROMISE
  return FETCH_PROMISE
}
