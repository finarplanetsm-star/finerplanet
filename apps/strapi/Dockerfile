    # -------------------------- base image ---------------------------------
    FROM node:22-alpine

    # Install system dependencies
    RUN apk update && apk add --no-cache libc6-compat build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git

    # Set working directory
    WORKDIR /app

    # Copy only Strapi app and root lockfiles
    COPY package.json yarn.lock turbo.json ./
    COPY apps/strapi ./apps/strapi
    COPY packages ./packages

 

    # Install dependencies
    RUN yarn --frozen-lockfile --production

    # Build Strapi
    WORKDIR /app/apps/strapi
    RUN yarn build

    # Non-root user for security
    RUN addgroup --system --gid 1001 strapi
    RUN adduser --system --uid 1001 strapi
    USER strapi

    # Expose port
    EXPOSE 1337

    # Start Strapi
    CMD ["yarn", "start"]
