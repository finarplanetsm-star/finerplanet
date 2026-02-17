"use client"

import { useEffect } from "react"
import ArticlesLoader from "@/_components/ArticlesLoader"
import { useNav } from "@/context/NavContext"

export default function SearchPage() {
  const { setActive } = useNav()

  useEffect(() => {
    setActive("SearchBy")
  }, [setActive])

  return (
    <main className="min-h-screen">
      <ArticlesLoader />
    </main>
  )
}
