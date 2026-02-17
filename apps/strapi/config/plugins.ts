export default ({ env }) => ({
  upload: {
    config: {
      provider: "aws-s3", // works because Cloudflare R2 is S3-compatible
      providerOptions: {
        credentials: {
          accessKeyId: env("R2_ACCESS_KEY_ID"),
          secretAccessKey: env("R2_SECRET_ACCESS_KEY"),
        },
        endpoint: env("R2_ENDPOINT"),
        region: "us-east-1",
        s3ForcePathStyle: true,

        params: {
          Bucket: env("R2_BUCKET"),
          ACL: "public-read",
        },
        baseUrl: env("R2_PUBLIC_URL"),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },

  // --- 2. Users & Permissions (The Critical Fixes) ---
  "users-permissions": {
    config: {
      jwt: {
        expiresIn: "30d",
      },
      // ✅ FIX 1: Allow custom fields during registration
      register: {
        allowedFields: [
          "username",
          "email",
          "password",
          "fullName",
          "affiliation",
          "orcidId",
          "scopusId",
          "personalWebsite",
        ],
      },
      // ✅ FIX 2: Set the frontend redirect URL for email confirmation
      email: {
        config: {
          redirectUrl: env(
            "URL_CONFIRMATION_REDIRECT",
            "https://ut-dallas1-ui.vercel.app/login"
          ),
        },
      },
    },
  },

  seo: { enabled: true },
  "config-sync": { enabled: true },
  "strapi-v5-plugin-populate-deep": { config: { defaultDepth: 5 } },
  sentry: {
    enabled: true,
    config: {
      dsn: env("NODE_ENV") === "production" ? env("SENTRY_DSN") : null,
      sendMetadata: true,
    },
  },
})
