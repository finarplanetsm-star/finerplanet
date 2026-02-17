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

// const fs = require("fs")
// const csv = require("csv-parser")
// const axios = require("axios")

// // ----------------------
// // CONFIGURATION
// // ----------------------
// const STRAPI_URL = "http://localhost:1337/api/articles"
// const CSV_FILE_PATH = "./uploadNewArticleData.csv"
// const BATCH_SIZE = 100

// // ----------------------
// // 1. Read CSV
// // ----------------------
// function readCSV(filePath) {
//   return new Promise((resolve, reject) => {
//     const results = []
//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on("data", (data) => results.push(data))
//       .on("end", () => resolve(results))
//       .on("error", reject)
//   })
// }

// // ----------------------
// // 2. Fetch Existing Titles (FIXED)
// // ----------------------
// async function fetchExistingTitles() {
//   // We use a Set of LOWERCASE titles for case-insensitive matching
//   const titles = new Set()
//   let page = 1
//   // Use 100 to be safe (Strapi default max is often 100)
//   const pageSize = 100

//   console.log("Fetching existing article titles...")

//   while (true) {
//     try {
//       const res = await axios.get(STRAPI_URL, {
//         params: {
//           publicationState: "preview",
//           locale: "all",
//           pagination: { page, pageSize },
//         },
//       })

//       const data = res.data.data

//       // STOP CONDITION 1: No data returned
//       if (!data || data.length === 0) break

//       data.forEach((item) => {
//         const rawTitle = item.attributes ? item.attributes.title : item.title
//         if (rawTitle) {
//           // Store simplified lowercase version for better matching
//           titles.add(rawTitle.trim().toLowerCase())
//         }
//       })

//       process.stdout.write(`\r...scanned ${titles.size} titles (Page ${page})`)

//       // STOP CONDITION 2: Strapi says "This is the last page" via meta
//       if (res.data.meta && res.data.meta.pagination) {
//         const { pageCount } = res.data.meta.pagination
//         if (page >= pageCount) break
//       } else {
//         // Fallback: If we got fewer items than requested, we are done
//         if (data.length < pageSize) break
//       }

//       page++
//     } catch (err) {
//       console.error("\n❌ Error fetching titles:", err.message)
//       break
//     }
//   }

//   console.log(`\n✅ Final Count: Found ${titles.size} existing articles in DB.`)
//   return titles
// }

// // ----------------------
// // 3. Chunk Array Helper
// // ----------------------
// function chunkArray(array, size) {
//   const chunks = []
//   for (let i = 0; i < array.length; i += size) {
//     chunks.push(array.slice(i, i + size))
//   }
//   return chunks
// }

// // ----------------------
// // 4. Main Upload Function
// // ----------------------
// async function uploadArticlesFast() {
//   try {
//     const articles = await readCSV(CSV_FILE_PATH)
//     const existingTitles = await fetchExistingTitles()

//     // Track titles seen INSIDE this CSV to prevent self-duplicates
//     const seenInCsv = new Set()

//     const toUpload = articles.filter((row) => {
//       const rawTitle = row["Article"] || row["title"]
//       if (!rawTitle) return false

//       const title = rawTitle.trim()
//       const lowerTitle = title.toLowerCase()

//       // 1. Check DB duplicates (Case Insensitive)
//       if (existingTitles.has(lowerTitle)) return false

//       // 2. Check CSV duplicates
//       if (seenInCsv.has(lowerTitle)) return false

//       seenInCsv.add(lowerTitle)
//       return true
//     })

//     console.log(
//       `\n📊 STATUS: Total CSV rows: ${articles.length} | Existing (Skipped): ${articles.length - toUpload.length} | New to upload: ${toUpload.length}`
//     )

//     if (toUpload.length === 0) {
//       console.log("🎉 All articles are already uploaded! Exiting.")
//       return
//     }

//     const batches = chunkArray(toUpload, BATCH_SIZE)

//     for (let i = 0; i < batches.length; i++) {
//       console.log(`Uploading batch ${i + 1}/${batches.length}...`)

//       await Promise.all(
//         batches[i].map(async (row) => {
//           const isTrue = (val) => val === "1" || val === "true" || val === true

//           const payload = {
//             publishedAt: new Date(),

//             title: (row["Article"] || row["title"])?.trim(),
//             journalFullName: row["Journal Name"] || row["journalFullName"],
//             journalAbbr: row["Journal Abbreviation"] || row["journalAbbr"],
//             disciplineAbbr: row["Discipline"] || row["disciplineAbbr"],
//             authors: row["authors"],
//             year: parseInt(row["year"]) || null,
//             author_aff: row["author_aff"],
//             affiliations: row["affiliations"],
//             ISSN: row["ISSN"],
//             openalex_id: row["openalex_id"],
//             openalex_doi: row["openalex_doi"],
//             openalex_article_url: row["openalex_article_url"],
//             openalex_matched_title: row["openalex_matched_title"],
//             doi_WOS: row["doi_WOS"],
//             doi_final: row["doi_final"],
//             utd24: isTrue(row["utd24"]),
//             ft50: isTrue(row["ft50"]),
//           }

//           try {
//             await axios.post("http://localhost:1337/api/articles", { data: payload })
//           } catch (err) {
//             console.error(
//               `❌ Failed [${payload.title}]:`,
//               err.response?.data?.error?.message || err.message
//             )
//           }
//         })
//       )

//       console.log(`Batch ${i + 1} finished.`)
//       await new Promise((r) => setTimeout(r, 100))
//     }

//     console.log("✅ Upload process complete")
//   } catch (err) {
//     console.error("Critical Script Failure:", err)
//   }
// }

// uploadArticlesFast()

// import fs from "fs";
// import csv from "csv-parser";
// import axios from "axios";

// const STRAPI_URL = "http://localhost:1337"; // or your server IP

// // 1️⃣ Find article by title + year
// async function findArticle(title, year) {
//   const res = await axios.get(`${STRAPI_URL}/api/articles`, {
//     params: {
//       "filters[title][$containsi]": title.trim(),
//       "filters[year][$eq]": year,
//       "pagination[pageSize]": 1,
//     },
//   });

//   return res.data.data[0] || null;
// }

// // 2️⃣ Update article
// async function updateArticle(id, data) {
//   return axios.put(`${STRAPI_URL}/api/articles/${id}`, {
//     data,
//   });
// }

// // 3️⃣ Process CSV
// fs.createReadStream("uploadNewArticleData.csv")
//   .pipe(csv())
//   .on("data", async (row) => {
//     const { title, year, ...fieldsToUpdate } = row;

//     if (!title || !year) return;

//     try {
//       const article = await findArticle(title.trim(), Number(year));

//       if (!article) {
//         console.log(`❌ Not found: ${title} (${year})`);
//         return;
//       }

//       // Remove empty values so we don't overwrite existing data
//       Object.keys(fieldsToUpdate).forEach((key) => {
//         if (fieldsToUpdate[key] === "" || fieldsToUpdate[key] == null) {
//           delete fieldsToUpdate[key];
//         }
//       });

//       if (Object.keys(fieldsToUpdate).length === 0) {
//         console.log(`⏭️ No updates needed: ${title}`);
//         return;
//       }

//       await updateArticle(article.documentId, fieldsToUpdate);
//       console.log(`✅ Updated: ${title} (${year})`);
//     } catch (err) {
//       console.error(`⚠️ Error for ${title}: ${err.message}`, err.message);
//     }
//   })
//   .on("end", () => {
//     console.log("🎉 CSV update completed");
//   });

// import fs from "fs";
// import csv from "csv-parser";
// import axios from "axios";

// const STRAPI_URL = "http://localhost:1337";

// async function findArticle(title, year) {
//   const res = await axios.get(`${STRAPI_URL}/api/articles`, {
//     params: {
//       "filters[title][$containsi]": title,
//       "filters[year][$eq]": year,
//       "pagination[pageSize]": 100,
//     },
//   });

//   return res.data.data[0] || null;
// }

// async function updateArticle(id, data) {
//   return axios.put(`${STRAPI_URL}/api/articles/${id}`, { data });
// }

// async function processCSV() {
//   const rows = [];

//   // 1️⃣ Read entire CSV first
//   await new Promise((resolve) => {
//     fs.createReadStream("uploadNewArticleData.csv")
//       .pipe(csv())
//       .on("data", (row) => rows.push(row))
//       .on("end", resolve);
//   });

//   console.log(`📄 Total rows: ${rows.length}`);

//   // 2️⃣ Process ONE row at a time
//   for (const row of rows) {
//     const { title, year, ...fields } = row;

//     if (!title || !year) continue;

//     try {
//       const article = await findArticle(title.trim(), Number(year));

//       if (!article) {
//         console.log(`❌ Not found: ${title}`);
//         continue;
//       }

//       // Remove empty values
//       Object.keys(fields).forEach((k) => {
//         if (!fields[k]) delete fields[k];
//       });

//       if (!Object.keys(fields).length) {
//         console.log(`⏭️ No update needed: ${title}`);
//         continue;
//       }

//       await updateArticle(article.documentId, fields);
//       console.log(`✅ Updated: ${title}`);
//     } catch (err) {
//       console.error(`⚠️ Error for ${title}`);
//       console.error(err.response?.data || err.message);
//     }
//   }

//   console.log("🎉 All updates completed safely");
// }

// processCSV();

import fs from "fs"

import axios from "axios"
import csv from "csv-parser"
import pLimit from "p-limit"

const STRAPI_URL = "http://localhost:1337"
const limit = pLimit(5) // ⚠️ Lower this to 5! Slow and steady wins the race.

// Helper to wait for a few milliseconds (prevents crashing the DB)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function processCSV() {
  console.log("🚀 Starting Safe Import (Concurrency: 5)...")
  const stream = fs.createReadStream("uploadNewArticleData.csv").pipe(csv())
  const tasks = []

  for await (const row of stream) {
    tasks.push(
      limit(async () => {
        const title = (row.title || row.Article || "").trim()
        const year = row.year

        if (!title || !year) return

        try {
          // 1. Give the server 100ms of rest before each search
          await sleep(100)

          const res = await axios.get(`${STRAPI_URL}/api/articles`, {
            params: {
              "filters[title][$eq]": title, // $eq is much lighter on the DB than $containsi
              "filters[year][$eq]": Number(year),
              publicationState: "preview",
            },
          })

          const article = res.data.data[0]
          if (!article) return

          // Data mapping (keep your existing field list)
          const cleanData = {}
          const allowedFields = [
            "journalFullName",
            "journalAbbr",
            "authors",
            "utd24",
            "ft50",
          ]
          allowedFields.forEach((key) => {
            if (row[key]) cleanData[key] = row[key]
          })

          // 2. Update and Publish
          await axios.put(
            `${STRAPI_URL}/api/articles/${article.documentId}?status=published`,
            {
              data: cleanData,
            }
          )

          console.log(`✅ ${title}`)
        } catch (err) {
          // This will now show the actual reason instead of just "Error"
          console.error(
            `❌ ${title}: ${err.code === "ECONNRESET" ? "Server Overloaded" : err.message}`
          )
        }
      })
    )
  }

  await Promise.all(tasks)
  console.log("🎉 Process Finished.")
}

processCSV()
