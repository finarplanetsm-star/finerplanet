/**
 * blog controller
 */

import { factories } from "@strapi/strapi"
import axios from "axios"

export default factories.createCoreController(
  "api::blog.blog",
  ({ strapi }) => ({
    async update(ctx) {
      try {
        const { data } = ctx.request.body

        // 1️⃣ Extract the CAPTCHA token sent from frontend
        const captchaToken = data?.captchaToken

        if (!captchaToken) {
          return ctx.badRequest("Captcha token missing")
        }

        // 2️⃣ Verify it with Google reCAPTCHA API
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`
        const response = await axios.post(verifyUrl, null, {
          params: {
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: captchaToken,
          },
        })

        if (!response.data.success) {
          return ctx.badRequest("Captcha verification failed")
        }

        // 3️⃣ Remove token before saving to database
        delete data.captchaToken

        // 4️⃣ Continue with Strapi’s default update logic
        const updatedEntry = await super.update(ctx)
        return updatedEntry
      } catch (error) {
        strapi.log.error("Error verifying captcha or updating blog:", error)
        return ctx.internalServerError(
          "Something went wrong while posting comment"
        )
      }
    },
  })
)
