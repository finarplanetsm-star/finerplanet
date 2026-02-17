"use client"

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import {
  Blog,
  getFeaturedBlogs,
  searchBlogs,
} from "@/api/services/blogs.service"

interface BlogContextType {
  blogs: Blog[]
  featuredBlogs: Blog[]
  isLoading: boolean
  error: string | null
}

const BlogContext = createContext<BlogContextType | undefined>(undefined)

export function BlogProvider({ children }: { children: ReactNode }) {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBlogs = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [allBlogs, featured] = await Promise.all([
        searchBlogs(),
        getFeaturedBlogs(),
      ])

      setBlogs(allBlogs)
      setFeaturedBlogs(featured)
    } catch (err: any) {
      setError(err.message || "Error fetching blogs")
      setBlogs([])
      setFeaturedBlogs([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  return (
    <BlogContext.Provider value={{ blogs, featuredBlogs, isLoading, error }}>
      {children}
    </BlogContext.Provider>
  )
}

export function useBlogs() {
  const context = useContext(BlogContext)
  if (!context) {
    throw new Error("useBlogs must be used within BlogProvider")
  }
  return context
}
