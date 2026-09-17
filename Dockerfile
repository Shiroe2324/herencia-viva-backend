FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS install
RUN mkdir -p /temp/dev /temp/prod

COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS build
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

RUN bun run build

FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
COPY dataset.jsonl ./dataset.jsonl

ENV NODE_ENV=production
ENV BACKEND_PORT=4000
ENV PORT=4000
EXPOSE 4000

CMD ["sh", "-c", "bun run typeorm -- migration:run && node dist/main.js"]