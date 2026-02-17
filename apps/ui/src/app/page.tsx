import ArticlesLoader from "@/_components/ArticlesLoader"

import type { Metadata } from "next"

// ✅ SEO works perfectly (Server Component)
export const metadata: Metadata = {
  title: "UT Dallas Project - Article Database",
  description: "Search and filter 65,000+ academic articles.",
}

export default function Home() {
  return (
    <main className="min-h-screen ">
      {/* The Loader handles fetching the huge file on the client */}
      <ArticlesLoader />
    </main>
  )
}
