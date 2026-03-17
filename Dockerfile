FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN npm prune --omit=dev

FROM node:24-alpine

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
ENV DATA_DIR=/app/runtime-data

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/public ./public
COPY --from=build /app/src/data ./src/data

RUN mkdir -p /app/runtime-data/uploads

EXPOSE 8080

CMD ["node", "server/index.mjs"]
