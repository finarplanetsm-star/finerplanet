/**
 * comment controller
 */

import { factories } from "@strapi/strapi"

export default factories.createCoreController(
  "api::comment.comment",
  ({ strapi }) => ({
    async create(ctx) {
      // 1. Get user from token
      const user = ctx.state.user

      // 2. Security Check
      if (!user) {
        return ctx.unauthorized("You must be logged in to comment.")
      }

      // 3. Extract data from request body
      const { data } = ctx.request.body

      // 4. Create directly via Entity Service (Bypassing API Validation)
      const newComment = await strapi.entityService.create(
        "api::comment.comment",
        {
          data: {
            ...data,
            user: user.id, // Securely inject user ID
            publishedAt: null, // Force draft state
          },
        }
      )

      // 5. Return formatted response
      // TS FIX: Cast 'this' to 'any' because TypeScript doesn't know 'this' is the Controller
      return (this as any).transformResponse(newComment)
    },
  })
)
