// config/admin.js

export default ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET"),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT"),
  },
  transfer: {
    token: {
      salt: env("TRANSFER_TOKEN_SALT"),
    },
  },
  watchIgnoreFiles: ["**/config/sync/**"],

  // ------------------------------------------------------------------
  //  << ADD THIS NEW 'config' OBJECT >>
  // ------------------------------------------------------------------
  //lets check if hostinger server is pulling and taking the latest commit

  config: {
    contentTypes: {
      // The key MUST match the API ID of your content type
      "api::blog.blog": {
        // This is the property Strapi uses to define the preview link
        previewUrl: env(
          "PREVIEW_URL",
          "https://ut-dallas1-ui.vercel.app/blog/{slug}"
        ),
      },
    },
  },
  // ------------------------------------------------------------------
})
