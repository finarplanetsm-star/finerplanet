import { RefObject, useEffect, useRef } from "react"

interface UseInfiniteScrollProps {
  hasMore: boolean
  loading: boolean
  offset?: number
  onLoadMore: () => Promise<void> | void
  // ✅ New prop to target a specific scrollable container
  targetRef?: RefObject<HTMLElement | null>
}

export function useInfiniteScroll({
  hasMore,
  loading,
  offset = 200,
  onLoadMore,
  targetRef,
}: UseInfiniteScrollProps) {
  const triggeredRef = useRef(false)

  useEffect(() => {
    const checkScroll = async () => {
      if (loading || !hasMore || triggeredRef.current) return

      let distanceFromBottom = 0

      if (targetRef?.current) {
        // 🟢 Logic for Container Scroll
        const element = targetRef.current
        // scrollHeight (Total content) - scrollTop (Current pos) - clientHeight (Visible window)
        distanceFromBottom =
          element.scrollHeight - element.scrollTop - element.clientHeight
      } else {
        // 🔵 Logic for Window Scroll (Fallback)
        const scrollTop = window.scrollY
        const windowHeight = window.innerHeight
        const documentHeight = document.documentElement.scrollHeight
        distanceFromBottom = documentHeight - (scrollTop + windowHeight)
      }

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
      requestAnimationFrame(() => {
        checkScroll()
      })
    }

    // Attach listener to the specific element if ref exists, otherwise window
    const element = targetRef?.current || window
    element.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      element.removeEventListener("scroll", handleScroll)
    }
  }, [hasMore, loading, offset, onLoadMore, targetRef])
}
