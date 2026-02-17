// scripts/generate-articles.ts
// npx tsx scripts/generate-articles-json.ts

// 👇 1. Load environment variables immediately
import fs from "fs"
import path from "path"

import dotenv from "dotenv"

// 👇 2. Use relative path (go up one level to find src)
import { getCachedArticles } from "../src/api/services/articlesCache"

dotenv.config()

async function run() {
  console.log("🏗️  Fetching data from:", process.env.NEXT_PUBLIC_STRAPI_URL) // Debug check

  try {
    const allArticles = await getCachedArticles()

    // Check if public folder exists, make it if not
    const publicDir = path.join(process.cwd(), "public")
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir)
    }

    const outputPath = path.join(publicDir, "articles-db.json")
    fs.writeFileSync(outputPath, JSON.stringify(allArticles))

    console.log(
      `✅ generated ${allArticles.length} articles to public/articles-db.json`
    )
  } catch (error) {
    console.error("❌ Generation failed:", error)
    process.exit(1) // Fail the build if data is missing
  }
}

run()
