export default (config, { strapi }: { strapi: any }) => {
  return async (ctx, next) => {
    console.log(`[Middleware Checking]: ${ctx.request.url}`, ctx.query)
    const q = ctx.query

    // Convert whole query to a string
    const raw = JSON.stringify(q)

    // Block ANY wildcard usage
    if (raw && (raw.includes('"*"') || raw.includes("*"))) {
      return ctx.badRequest("populate=* is blocked for security reasons")
    }

    await next()
  }
}
