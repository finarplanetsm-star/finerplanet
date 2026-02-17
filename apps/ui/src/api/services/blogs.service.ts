import { apiClient } from "../lib/lib/apiClient"

export interface Blog {
  id: number
  documentId: string
  title: string
  content: string
  author: string
  description: string
  tags: string
  timeToRead: number
  date_of_publishing: string
  thumbnail: any
  banner: any
  authorLogoAvatar: any
  comments: any[]
  featured?: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
}

///api/proxy?path=
//blogs?filters[title][$containsi]=${searchQu8888ery}&populate=*

export interface BlogSearchResult {
  id: number
  documentId: string
  title: string
}

// 2. Add this optimized function
export const searchBlogTitles = async (
  searchQuery = ""
): Promise<BlogSearchResult[]> => {
  try {
    // OPTIMIZATION:
    // fields[0]=title -> Only fetch the title
    // fields[1]=documentId -> Only fetch the ID (for navigation)
    // We REMOVED 'populate=thumbnail' because the dropdown doesn't show images.
    const query = `blogs?filters[title][$containsi]=${encodeURIComponent(searchQuery)}&fields[0]=title&fields[1]=documentId`

    const res = await apiClient.get(query)
    return res.data.data
  } catch (error: any) {
    console.error("Error searching blog titles:", error.message)
    return []
  }
}

export const searchBlogs = async (searchQuery = ""): Promise<Blog[]> => {
  try {
    const res = await apiClient.get(
      `blogs?filters[title][$containsi]=${encodeURIComponent(searchQuery)}&populate=thumbnail`
    )

    return res.data.data
  } catch (error: any) {
    console.error(
      "Error fetching blogs:",
      error.response?.data || error.message
    )
    throw new Error(error.message || "Failed to fetch blogs")
  }
}

// export const getFeaturedBlogs = async (): Promise<Blog[]> => {
//   try {
//     const res = await apiClient.get(
//       `blogs?populate=*&filters[featured][$eq]=true`
//     )

//     return res.data.data
//   } catch (error: any) {
//     console.error(
//       "Error fetching featured blogs:",
//       error.response?.data || error.message
//     )
//     throw new Error(error.message || "Failed to fetch featured blogs")
//   }
// }
export const getFeaturedBlogs = async (): Promise<Blog[]> => {
  try {
    const res = await apiClient.get(
      `blogs?filters[featured][$eq]=true&populate=thumbnail`
    )
    return res.data.data
  } catch (error: any) {
    console.error("Error fetching featured blogs:", error.message)
    throw new Error(error.message || "Failed to fetch featured blogs")
  }
}
