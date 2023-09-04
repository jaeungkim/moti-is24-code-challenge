FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN  npm install

FROM node:18-alpine AS builder
WORKDIR /app

COPY frontend/ .

RUN npm run build

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "run", "start"]
