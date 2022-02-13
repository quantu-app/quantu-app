FROM node:16-alpine as node-builder

RUN apk add --no-cache python3 g++ make zlib-dev
RUN npm install -g npm@8.4.0

WORKDIR /app

FROM node-builder as builder

COPY package*.json ./
RUN npm install

ARG VITE_API_URL=https://api.quantu.app
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_WS_URL=wss://api.quantu.app
ENV VITE_WS_URL=$VITE_WS_URL

RUN echo "VITE_API_URL=$VITE_API_URL" >> .env && \
  echo "VITE_WS_URL=$VITE_WS_URL" >> .env

COPY . .

RUN NODE_ENV=production npm run build

FROM node-builder

COPY --from=builder /app/package*.json ./
RUN NODE_ENV=production npm install

COPY --from=builder /app/build .

EXPOSE 3000

CMD [ "node", "index.js" ]