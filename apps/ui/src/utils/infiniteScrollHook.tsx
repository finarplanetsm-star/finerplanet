import { useEffect, useRef } from "react"

interface UseInfiniteScrollProps {
  hasMore: boolean
  loading: boolean
  offset?: number
  onLoadMore: () => Promise<void> | void
}

export function useInfiniteScroll({
  hasMore,
  loading,
  offset = 200,
  onLoadMore,
}: UseInfiniteScrollProps) {
  const triggeredRef = useRef(false)

  useEffect(() => {
    let ticking = false

    const checkScroll = async () => {
      if (loading || !hasMore || triggeredRef.current) return

      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      const distanceFromBottom = documentHeight - (scrollTop + windowHeight)

      if (distanceFromBottom <= offset) {
        triggeredRef.current = true
        try {
          await onLoadMore()
        } finally {
          triggeredRef.current = false
        }
      }
    }

    const handleScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          checkScroll()
          ticking = false
        })
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [hasMore, loading, offset, onLoadMore])
}
