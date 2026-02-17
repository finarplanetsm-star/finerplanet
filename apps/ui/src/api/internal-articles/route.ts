import { NextResponse } from "next/server"

import { Article, getCachedArticles } from "../services/articlesCache"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")

  // 1. Get Data from RAM (Already parsed into Arrays!)
  const allArticles = await getCachedArticles()

  if (type === "options") {
    return handleOptionsRequest(searchParams, allArticles)
  } else {
    return handleSearchRequest(searchParams, allArticles)
  }
}

function handleSearchRequest(params: URLSearchParams, articles: Article[]) {
  const page = parseInt(params.get("page") || "1")
  const pageSize = parseInt(params.get("pageSize") || "25")

  // Extract Filters
  const yearStart = parseInt(params.get("yearStart") || "0")
  const yearEnd = parseInt(params.get("yearEnd") || "9999")
  const journals = params.getAll("journal[]")
  const articleNames = params.getAll("articleName[]")

  const firstNames = params.getAll("firstName[]").map((s) => s.toLowerCase())
  const lastNames = params.getAll("lastName[]").map((s) => s.toLowerCase())
  const disciplines = params.get("discipline")
  const journalGroup = params.get("journalGroup") // Handle if you have logic for this

  // Filter
  let filtered = articles.filter((a) => {
    // 1. Year Check
    if (a.year < yearStart || a.year > yearEnd) return false

    // 2. Exact Matches (using 'includes' for arrays)
    if (journals.length && !journals.includes(a.journalName)) return false
    if (articleNames.length && !articleNames.includes(a.title)) return false
    if (disciplines && a.disciplineAbbr !== disciplines) return false

    // 3. Author Logic (Checks against the PARSED array)
    // "Does ANY author in this article match ONE OF the selected last names?"
    if (lastNames.length > 0) {
      const hasMatch = a.author.some((auth) =>
        lastNames.includes(auth.lastName.toLowerCase())
      )
      if (!hasMatch) return false
    }

    if (firstNames.length > 0) {
      const hasMatch = a.author.some((auth) =>
        firstNames.includes(auth.firstName.toLowerCase())
      )
      if (!hasMatch) return false
    }

    return true
  })

  // Pagination
  const total = filtered.length
  const pageCount = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const paginated = filtered.slice(start, start + pageSize)

  return NextResponse.json({
    articles: paginated,
    pagination: { page, pageSize, pageCount, total },
  })
}

function handleOptionsRequest(params: URLSearchParams, articles: Article[]) {
  const field = params.get("field") || ""
  const query = (params.get("query") || "").toLowerCase()
  const page = parseInt(params.get("page") || "1")

  const values = new Set<string>()

  // Iterate over 64k articles to find unique values
  articles.forEach((a) => {
    if (field === "firstName") {
      a.author.forEach((auth) => {
        if (auth.firstName && auth.firstName.toLowerCase().includes(query)) {
          values.add(auth.firstName)
        }
      })
    } else if (field === "lastName") {
      a.author.forEach((auth) => {
        if (auth.lastName && auth.lastName.toLowerCase().includes(query)) {
          values.add(auth.lastName)
        }
      })
    } else if (field === "title") {
      if (a.title && a.title.toLowerCase().includes(query)) values.add(a.title)
    } else if (field === "journalName") {
      if (a.journalName && a.journalName.toLowerCase().includes(query))
        values.add(a.journalName)
    }
  })

  const allOptions = Array.from(values).sort()
  const PAGE_SIZE = 25
  const start = (page - 1) * PAGE_SIZE
  const sliced = allOptions.slice(start, start + PAGE_SIZE)

  return NextResponse.json({
    options: sliced.map((v) => ({ label: v, value: v })),
    hasMore: start + PAGE_SIZE < allOptions.length,
  })
}
