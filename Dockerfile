FROM node:16-alpine as node-builder

RUN apk add --no-cache python3 g++ make zlib-dev
RUN npm install -g npm@8.4.0

WORKDIR /app

FROM node-builder as builder

COPY package*.json ./
RUN npm install

ARG DATABASE_URL=https://api.quantu.app
ENV DATABASE_URL=$DATABASE_URL

RUN echo "DATABASE_URL=$DATABASE_URL" >> .env

COPY . .

RUN npm run prisma generate
RUN NODE_ENV=production npm run build

FROM node-builder

COPY --from=builder /app/package*.json ./
RUN NODE_ENV=production npm install

COPY --from=builder /app/build .
RUN npm run prisma generate

EXPOSE 3000

CMD [ "node", "index.js" ]