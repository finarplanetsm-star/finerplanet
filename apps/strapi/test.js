// This script simulates a rapid stream of requests to test the Strapi rate limiter.
// It now sends requests sequentially with a small delay to prevent crashing the Nginx proxy (502 errors).

const API_ENDPOINT =
  "https://cms.webflow-js.cloud/api/articles?pagination[page]=1&pagination[pageSize]=1"
const MAX_REQUESTS_TO_SEND = 110
const LIMIT_THRESHOLD = 100 // The expected limit set in your middleware

// 50ms delay between requests to avoid overloading the Node.js event loop/Nginx buffer.
const REQUEST_DELAY_MS = 50

/**
 * Executes requests sequentially with a delay and counts the status codes.
 */
async function runRateLimitTest() {
  console.log(`--- Starting Rate Limit Test (Sequential) ---`)
  console.log(`Target URL: ${API_ENDPOINT}`)
  console.log(
    `Sending ${MAX_REQUESTS_TO_SEND} requests with ${REQUEST_DELAY_MS}ms delay...`
  )

  const results = {
    200: 0, // OK/Success
    429: 0, // Too Many Requests (Expected block)
    502: 0, // Bad Gateway (Server/Proxy Crash)
    other: 0, // Any other error code
  }

  for (let i = 1; i <= MAX_REQUESTS_TO_SEND; i++) {
    try {
      // Introduce the delay
      await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY_MS))

      const response = await fetch(API_ENDPOINT)
      const status = response.status.toString()

      // Track the status code
      if (status === "200") {
        results["200"]++
      } else if (status === "429") {
        results["429"]++
      } else if (status === "502") {
        results["502"]++
      } else {
        results["other"]++
      }

      // Log when the block is expected to start
      if (i === LIMIT_THRESHOLD) {
        console.log(
          `\n--- BLOCK EXPECTED AFTER THIS REQUEST (#${LIMIT_THRESHOLD}) ---\n`
        )
      }
    } catch (error) {
      console.error(
        `Request ${i} failed due to network error: ${error.message}`
      )
      results["other"]++
    }
  }

  console.log(`\n--- Test Results ---`)
  console.log(`Sent: ${MAX_REQUESTS_TO_SEND} requests`)
  console.log(`----------------------`)

  // We consider the test successful if 429 errors occurred and 502 errors are minimal.
  if (results["429"] > 0 && results["502"] < 5) {
    // Allowing for minor network hiccups
    console.log("✅ SUCCESS: Rate Limiter is enforced!")
    console.log(`   - Allowed (200 OK): ${results["200"]} requests`)
    console.log(`   - Blocked (429): ${results["429"]} requests`)
    console.log(`   - Server Error (502): ${results["502"]} requests`)
  } else {
    console.log("❌ FAILURE: Rate Limiter is NOT working as expected.")
    console.log(`   - 200 OK Count: ${results["200"]}`)
    console.log(`   - 429 Blocked Count: ${results["429"]}`)
    console.log(`   - Server Error (502): ${results["502"]}`)
    if (results["502"] > 10) {
      console.log(
        "   --> CRITICAL: The server is still crashing (502). Re-verify 'proxy: true' in config/server.js and restart Strapi."
      )
    } else if (results["429"] === 0) {
      console.log(
        "   --> ACTION: The middleware is likely not active. Re-verify the installation and placement in config/middlewares.ts."
      )
    }
  }
}

runRateLimitTest()
