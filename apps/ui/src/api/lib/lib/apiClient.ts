import axios from "axios"

const strapiBase =
  process.env.NEXT_PUBLIC_API_BASE_PATH?.replace(/\/$/, "") ||
  "https://cms.webflow-js.cloud"

export const apiClient = axios.create({
  baseURL: `${strapiBase}/api/`,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
})

// 👇 FIX: Add this check to prevent server-side crash
if (typeof window !== "undefined") {
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token")
      const isAuthRoute = config.url?.includes("/auth/local")

      if (token && !isAuthRoute) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
}

export const basePath = strapiBase
