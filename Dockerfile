FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
ARG API_BASE_URL=http://localhost:8080
ARG SITE_URL=http://localhost:3000
ARG SESSION_COOKIE_NAME=beautyra_session
ENV API_BASE_URL=$API_BASE_URL \
    SITE_URL=$SITE_URL \
    SESSION_COOKIE_NAME=$SESSION_COOKIE_NAME \
    AUTH_PROVIDER=real \
    PAYMENT_RETURN_FORWARD_TO_BACKEND=false
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
