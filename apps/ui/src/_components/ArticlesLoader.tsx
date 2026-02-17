"use client"

import { useEffect, useState } from "react"
import Hero_Section from "@/_components/Hero_Section"

// We import the TYPE only (no code/data)
import type { Article } from "@/api/services/articlesCache"

import Loading from "@/app/loading"

export default function ArticlesLoader() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Fetch the static JSON file from the public folder
    console.log("📥 Downloading article database...")

    fetch("/articles-db.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load data")
        return res.json()
      })
      .then((data) => {
        console.log(`✅ Loaded ${data.length} articles into RAM.`)
        setArticles(data)
        setLoading(false)
      })
      .catch((err) => console.error("Client load error:", err))
  }, [])

  if (loading) {
    return <Loading />
  }

  // 2. Pass the data to your existing UI
  return (
    <>
      <Hero_Section initialArticles={articles} />
    </>
  )
}
