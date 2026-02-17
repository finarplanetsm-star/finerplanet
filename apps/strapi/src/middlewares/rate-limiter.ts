// src/middlewares/rate-limiter.ts

// 🚨 Use the newly installed package name
import { RateLimit } from "koa2-ratelimit"

// Define the limits
const limit = 100 // Max requests
const timePeriod = 60 * 1000 // 60 seconds (1 minute)

export default (config, { strapi }: { strapi: any }) => {
  console.log("🔥 rate-limit middleware LOADED")
  // Koa middleware to handle rate limiting
  const limiter = RateLimit.middleware({
    // Store: Use an in-memory store for now.
    // For a multi-instance production setup, switch to a Redis store.
    interval: timePeriod, // 1 minute
    max: limit, // 100 requests
    message: "Too many requests. Please try again later.",

    // Key generator: Identify the client by their IP address
    // (Ensure you have proxy: true in config/server.js for accurate IP)
    id: (ctx) => ctx.request.ip,

    // Custom header to inform the user about their remaining limit
    headers: true,
  })

  // Return the async function required by Strapi middleware factory
  return async (ctx, next) => {
    // Apply the rate limiter logic
    await limiter(ctx, next)
  }
}
