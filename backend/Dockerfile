FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod

COPY . .

RUN pnpm build

CMD ["node", "dist/main"]
