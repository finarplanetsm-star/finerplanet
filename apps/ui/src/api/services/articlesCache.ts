// import { apiClient } from "../lib/lib/apiClient"

// export interface Article {
//   id: number
//   documentId: string
//   title: string
//   year: number
//   journalName: string
//   journalAbbreviation: string
//   disciplineAbbr: string
//   authors: string
//   affiliations: string
//   utd24: boolean
//   ft50: boolean
// }

// declare global {
//   var articleCache: Article[] | undefined
//   var articleFetchPromise: Promise<Article[]> | undefined
// }

// export const getCachedArticles = async (): Promise<Article[]> => {
//   if (global.articleCache) return global.articleCache
//   if (global.articleFetchPromise) return global.articleFetchPromise

//   console.log("🚀 Cold start: fetching articles into RAM...")

//   global.articleFetchPromise = (async () => {
//     const allArticles: Article[] = []
//     let page = 1
//     const pageSize = 100

//     const fieldsToRequest = [
//       "title",
//       "year",
//       "journalFullName",
//       "journalAbbr",
//       "authors",
//       "disciplineAbbr",
//       "affiliations",
//       "utd24",
//       "ft50",
//     ]

//     try {
//       while (true) {
//         const params = new URLSearchParams()

//         // We are NOT appending "fields" here anymore.
//         // This forces Strapi to return all fields, bypassing the "Invalid Key" error.

//         fieldsToRequest.forEach((field, index) => {
//           params.append(`fields[${index}]`, field)
//         })

//         params.append("pagination[page]", page.toString())
//         params.append("pagination[pageSize]", pageSize.toString())

//         const res = await apiClient.get(`articles?${params.toString()}`)

//         const { data, meta } = res.data

//         if (!data || !Array.isArray(data)) break

//         const chunk: Article[] = data.map((item: any) => ({
//           id: item.id,
//           documentId: item.documentId,
//           title: item.title ?? "",
//           year: item.year ?? 0,
//           journalName: item.journalFullName ?? "N/A",
//           journalAbbreviation: item.journalAbbr ?? "N/A",
//           disciplineAbbr: item.disciplineAbbr ?? "",
//           authors: item.authors ?? "",
//           affiliations: item.affiliations ?? "",
//           utd24: !!item.utd24,
//           ft50: !!item.ft50,
//         }))

//         allArticles.push(...chunk)

//         if (page % 5 === 0)
//           console.log(`   ...cached ${allArticles.length} articles`)
//         if (page >= meta.pagination.pageCount) break
//         page++
//       }

//       console.log(
//         `✅ Success! Cached ${allArticles.length} articles in memory.`
//       )
//       global.articleCache = allArticles
//       return allArticles
//     } catch (error: any) {
//       console.error("❌ Article cache failed!")
//       const msg = error.response?.data?.error?.message || error.message
//       console.error("Reason:", msg)

//       global.articleFetchPromise = undefined
//       throw error
//     }
//   })()

//   return global.articleFetchPromise
// }

import { apiClient } from "../lib/lib/apiClient"

export interface Article {
  id: number
  documentId: string
  title: string
  year: number
  journalName: string
  journalAbbreviation: string
  disciplineAbbr: string
  authors: string
  affiliations: string
  utd24: boolean
  ft50: boolean
}

// Browser-compatible cache using module-level variables
let articleCache: Article[] | undefined
let articleFetchPromise: Promise<Article[]> | undefined

// Server-side global cache for SSR/SSG
declare global {
  var articleCache: Article[] | undefined
  var articleFetchPromise: Promise<Article[]> | undefined
}

// 1. HELPER: Sleep function to prevent DDOS-ing your own server
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Helper to get/set cache in both browser and server environments
const getCache = () => {
  if (typeof window !== "undefined") {
    return articleCache
  }
  return global.articleCache
}

const setCache = (data: Article[]) => {
  if (typeof window !== "undefined") {
    articleCache = data
  } else {
    global.articleCache = data
  }
}

const getPromise = () => {
  if (typeof window !== "undefined") {
    return articleFetchPromise
  }
  return global.articleFetchPromise
}

const setPromise = (promise: Promise<Article[]> | undefined) => {
  if (typeof window !== "undefined") {
    articleFetchPromise = promise
  } else {
    global.articleFetchPromise = promise
  }
}

export const getCachedArticles = async (): Promise<Article[]> => {
  if (getCache()) return getCache()!
  if (getPromise()) return getPromise()!

  console.log("🚀 Cold start: fetching articles into RAM...")

  const fetchPromise = (async () => {
    const allArticles: Article[] = []
    let page = 1

    // 2. OPTIMIZATION: Try 250 to reduce total HTTP requests
    // (If Strapi returns 400 or 500, lower this back to 100)
    const pageSize = 100

    const fieldsToRequest = [
      "title",
      "year",
      "journalFullName",
      "journalAbbr",
      "authors",
      "disciplineAbbr",
      "affiliations",
      "utd24",
      "ft50",
    ]

    try {
      while (true) {
        // 3. SAFETY VALVE: Wait 200ms between requests
        await sleep(200)

        const params = new URLSearchParams()

        fieldsToRequest.forEach((field, index) => {
          params.append(`fields[${index}]`, field)
        })

        params.append("pagination[page]", page.toString())
        params.append("pagination[pageSize]", pageSize.toString())

        const res = await apiClient.get(`articles?${params.toString()}`)

        const { data, meta } = res.data

        if (!data || !Array.isArray(data) || data.length === 0) break

        const chunk: Article[] = data.map((item: any) => ({
          id: item.id,
          documentId: item.documentId,
          title: item.title ?? "",
          year: item.year ?? 0,
          journalName: item.journalFullName ?? "N/A",
          journalAbbreviation: item.journalAbbr ?? "N/A",
          disciplineAbbr: item.disciplineAbbr ?? "",
          authors: item.authors ?? "",
          affiliations: item.affiliations ?? "",
          utd24: !!item.utd24,
          ft50: !!item.ft50,
        }))

        allArticles.push(...chunk)

        // Log every page so you can see progress in the build logs
        console.log(`   ...page ${page}: cached ${allArticles.length} articles`)

        if (page >= meta.pagination.pageCount) break
        page++
      }

      console.log(
        `✅ Success! Cached ${allArticles.length} articles in memory.`
      )
      setCache(allArticles)
      return allArticles
    } catch (error: any) {
      console.error("❌ Article cache failed!")
      const msg = error.response?.data?.error?.message || error.message
      console.error("Reason:", msg)

      setPromise(undefined)
      throw error
    }
  })()

  setPromise(fetchPromise)
  return fetchPromise
}
