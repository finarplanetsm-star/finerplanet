// const fs = require("fs")
// const csv = require("csv-parser")
// const axios = require("axios")

// const STRAPI_URL = "http://72.60.102.12/api/articles"
// const CSV_FILE_PATH = "./uploadNewArticleData.csv"
// const BATCH_SIZE = 100

// // Read CSV
// function readCSV(filePath) {
//   return new Promise((resolve, reject) => {
//     const results = []
//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on("data", (data) => results.push(data))
//       .on("end", () => resolve(results))
//       .on("error", (err) => reject(err))
//   })
// }

// function chunkArray(array, size) {
//   const result = []
//   for (let i = 0; i < array.length; i += size) {
//     result.push(array.slice(i, i + size))
//   }
//   return result
// }

// // Upload function
// async function uploadArticlesInBatches() {
//   try {
//     const articles = await readCSV(CSV_FILE_PATH)
//     const batches = chunkArray(articles, BATCH_SIZE)

//     console.log(
//       `Total articles: ${articles.length}, Total batches: ${batches.length}`
//     )

//     for (let i = 0; i < batches.length; i++) {
//       const batch = batches[i]
//       console.log(`Uploading batch ${i + 1}/${batches.length}...`)

//       const batchData = batch.map((article) => {
//         const authorsArray = article["Author"]
//           ? article["Author"].split(";").map((name) => {
//               const parts = name.split(",").map((n) => n.trim())
//               const lastName = parts[0] || ""
//               const firstName = parts[1] || ""
//               return { firstName, lastName }
//             })
//           : []
//         return {
//           title: article["Article"],
//           journalName: article["Journal Name"],
//           journalAbbreviation: article["Journal Abbreviation"],
//           year: parseInt(article["Year"]) || null,
//           volume: article["Volume"] || null,
//           author: authorsArray || [],
//         }
//       })

//       // Upload each item in the batch in parallel
//       // await Promise.all(
//       //     batchData.map((data) =>
//       //         axios.post(
//       //             STRAPI_URL,
//       //             { data },
//       //             {
//       //                 headers: {
//       //                     'Content-Type': 'application/json',
//       //                 },
//       //             }
//       //         )
//       //     )
//       // );

//       await Promise.all(
//         batchData.map(async (data) => {
//           try {
//             const existing = await axios.get(
//               `${STRAPI_URL}?filters[title][$eq]=${encodeURIComponent(data.title)}`
//             )
//             if (existing.data.data.length > 0) {
//               console.log(`Skipping already uploaded article: ${data.title}`)
//               return
//             }
//             await axios.post(
//               STRAPI_URL,
//               { data },
//               { headers: { "Content-Type": "application/json" } }
//             )
//           } catch (err) {
//             console.error(
//               "Failed to upload article:",
//               data.title,
//               err.response?.data || err.message
//             )
//           }
//         })
//       )

//       console.log(`Batch ${i + 1} uploaded successfully.`)
//     }

//     console.log("All batches uploaded!")
//   } catch (err) {
//     console.error(
//       "Error uploading articles:",
//       err.response?.data || err.message
//     )
//   }
// }

// uploadArticlesInBatches()

//-----new data upload 1

// const fs = require("fs");
// const csv = require("csv-parser");
// const axios = require("axios");

// const STRAPI_URL = "http://localhost:1337/api/articles";
// const CSV_FILE_PATH = "./uploadNewArticleData.csv";
// const BATCH_SIZE = 100;

// // Read CSV
// function readCSV(filePath) {
//   return new Promise((resolve, reject) => {
//     const results = [];
//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on("data", (data) => results.push(data))
//       .on("end", () => resolve(results))
//       .on("error", (err) => reject(err));
//   });
// }

// // Split array into batches
// function chunkArray(array, size) {
//   const result = [];
//   for (let i = 0; i < array.length; i += size) {
//     result.push(array.slice(i, i + size));
//   }
//   return result;
// }

// // Upload function
// async function uploadArticlesInBatches() {
//   try {
//     const articles = await readCSV(CSV_FILE_PATH);
//     const batches = chunkArray(articles, BATCH_SIZE);

//     console.log(`Total articles: ${articles.length}, Total batches: ${batches.length}`);

//     for (let i = 0; i < batches.length; i++) {
//       const batch = batches[i];
//       console.log(`Uploading batch ${i + 1}/${batches.length}...`);

//       const batchData = batch.map((article) => ({
//         title: article["title"],
//         journalFullName: article["journalFullName"],
//         journalAbbr: article["journalAbbr"],
//         disciplineAbbr: article["disciplineAbbr"],
//         year: parseInt(article["year"]) || null,
//         authors: article["authors"] || null,
//         author_aff: article["author_aff"] || null,
//         affiliations: article["affiliations"] || null,
//         ISSN: article["ISSN"] || null,
//         openalex_id: article["openalex_id"] || null,
//         openalex_doi: article["openalex_doi"] || null,
//         openalex_article_url: article["openalex_article_url"] || null,
//         openalex_matched_title: article["openalex_matched_title"] || null,
//         doi_WOS: article["doi_WOS"] || null,
//         doi_final: article["doi_final"] || null,
//         utd24: article["utd24"] === "1" || article["utd24"] === 1,
//         ft50: article["ft50"] === "1" || article["ft50"] === 1,
//       }));

//       // Upload each item in the batch in parallel
//       await Promise.all(
//         batchData.map(async (data) => {
//           try {
//             // Skip if article already exists (by title)
//             const existing = await axios.get(
//               `${STRAPI_URL}?filters[title][$eq]=${encodeURIComponent(data.title)}`
//             );
//             if (existing.data.data.length > 0) {
//               console.log(`Skipping already uploaded article: ${data.title}`);
//               return;
//             }

//             await axios.post(STRAPI_URL, { data }, { headers: { "Content-Type": "application/json" } });
//           } catch (err) {
//             console.error("Failed to upload article:", data.title, err.response?.data || err.message);
//           }
//         })
//       );

//       console.log(`Batch ${i + 1} uploaded successfully.`);
//     }

//     console.log("All batches uploaded!");
//   } catch (err) {
//     console.error("Error uploading articles:", err.response?.data || err.message);
//   }
// }

// uploadArticlesInBatches();

//new data upload 2

const fs = require("fs")
const csv = require("csv-parser")
const axios = require("axios")

// ----------------------
// CONFIGURATION
// ----------------------
const STRAPI_URL = "http://localhost:1337/api/articles"
const CSV_FILE_PATH = "./uploadNewArticleData.csv"
const BATCH_SIZE = 100

// ----------------------
// 1. Read CSV
// ----------------------
function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = []
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", reject)
  })
}

// ----------------------
// 2. Fetch Existing Titles (FIXED)
// ----------------------
async function fetchExistingTitles() {
  // We use a Set of LOWERCASE titles for case-insensitive matching
  const titles = new Set()
  let page = 1
  // Use 100 to be safe (Strapi default max is often 100)
  const pageSize = 100

  console.log("Fetching existing article titles...")

  while (true) {
    try {
      const res = await axios.get(STRAPI_URL, {
        params: {
          publicationState: "preview",
          locale: "all",
          pagination: { page, pageSize },
        },
      })

      const data = res.data.data

      // STOP CONDITION 1: No data returned
      if (!data || data.length === 0) break

      data.forEach((item) => {
        const rawTitle = item.attributes ? item.attributes.title : item.title
        if (rawTitle) {
          // Store simplified lowercase version for better matching
          titles.add(rawTitle.trim().toLowerCase())
        }
      })

      process.stdout.write(`\r...scanned ${titles.size} titles (Page ${page})`)

      // STOP CONDITION 2: Strapi says "This is the last page" via meta
      if (res.data.meta && res.data.meta.pagination) {
        const { pageCount } = res.data.meta.pagination
        if (page >= pageCount) break
      } else {
        // Fallback: If we got fewer items than requested, we are done
        if (data.length < pageSize) break
      }

      page++
    } catch (err) {
      console.error("\n❌ Error fetching titles:", err.message)
      break
    }
  }

  console.log(`\n✅ Final Count: Found ${titles.size} existing articles in DB.`)
  return titles
}

// ----------------------
// 3. Chunk Array Helper
// ----------------------
function chunkArray(array, size) {
  const chunks = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

// ----------------------
// 4. Main Upload Function
// ----------------------
async function uploadArticlesFast() {
  try {
    const articles = await readCSV(CSV_FILE_PATH)
    const existingTitles = await fetchExistingTitles()

    // Track titles seen INSIDE this CSV to prevent self-duplicates
    const seenInCsv = new Set()

    const toUpload = articles.filter((row) => {
      const rawTitle = row["Article"] || row["title"]
      if (!rawTitle) return false

      const title = rawTitle.trim()
      const lowerTitle = title.toLowerCase()

      // 1. Check DB duplicates (Case Insensitive)
      if (existingTitles.has(lowerTitle)) return false

      // 2. Check CSV duplicates
      if (seenInCsv.has(lowerTitle)) return false

      seenInCsv.add(lowerTitle)
      return true
    })

    console.log(
      `\n📊 STATUS: Total CSV rows: ${articles.length} | Existing (Skipped): ${articles.length - toUpload.length} | New to upload: ${toUpload.length}`
    )

    if (toUpload.length === 0) {
      console.log("🎉 All articles are already uploaded! Exiting.")
      return
    }

    const batches = chunkArray(toUpload, BATCH_SIZE)

    for (let i = 0; i < batches.length; i++) {
      console.log(`Uploading batch ${i + 1}/${batches.length}...`)

      await Promise.all(
        batches[i].map(async (row) => {
          const isTrue = (val) => val === "1" || val === "true" || val === true

          const payload = {
            publishedAt: new Date(),

            title: (row["Article"] || row["title"])?.trim(),
            journalFullName: row["Journal Name"] || row["journalFullName"],
            journalAbbr: row["Journal Abbreviation"] || row["journalAbbr"],
            disciplineAbbr: row["Discipline"] || row["disciplineAbbr"],
            authors: row["authors"],
            year: parseInt(row["year"]) || null,
            author_aff: row["author_aff"],
            affiliations: row["affiliations"],
            ISSN: row["ISSN"],
            openalex_id: row["openalex_id"],
            openalex_doi: row["openalex_doi"],
            openalex_article_url: row["openalex_article_url"],
            openalex_matched_title: row["openalex_matched_title"],
            doi_WOS: row["doi_WOS"],
            doi_final: row["doi_final"],
            utd24: isTrue(row["utd24"]),
            ft50: isTrue(row["ft50"]),
          }

          try {
            await axios.post(STRAPI_URL, { data: payload })
          } catch (err) {
            console.error(
              `❌ Failed [${payload.title}]:`,
              err.response?.data?.error?.message || err.message
            )
          }
        })
      )

      console.log(`Batch ${i + 1} finished.`)
      await new Promise((r) => setTimeout(r, 100))
    }

    console.log("✅ Upload process complete")
  } catch (err) {
    console.error("Critical Script Failure:", err)
  }
}

uploadArticlesFast()
