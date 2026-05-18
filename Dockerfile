FROM oven/bun:1

WORKDIR /app

COPY package.json ./
RUN bun install

COPY . .

ARG REACT_APP_API_BASE_URL
ARG REACT_APP_AUTH_URL
ARG REACT_APP_USERS_URL

RUN bun run build

EXPOSE 3000

CMD ["bunx", "serve", "-s", "build", "-l", "3000"]
