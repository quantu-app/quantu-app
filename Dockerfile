FROM node:14-alpine as builder

RUN npm install -g npm@7.20.0

WORKDIR /app

COPY package*.json ./
RUN npm install

ARG VITE_QUANTU_API_URL=https://api.quantu.app
ENV VITE_QUANTU_API_URL=$VITE_QUANTU_API_URL

ARG VITE_QUANTU_WS_URL=wss://api.quantu.app
ENV VITE_QUANTU_WS_URL=$VITE_QUANTU_WS_URL

COPY . .
RUN echo "VITE_QUANTU_API_URL=$VITE_QUANTU_API_URL" >> .env && \
  echo "VITE_QUANTU_WS_URL=$VITE_QUANTU_WS_URL" >> .env

RUN NODE_ENV=production npm run web.build

FROM node:14-alpine

RUN npm install -g npm@7.20.0

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/build .

RUN NODE_ENV=production npm install

EXPOSE 3000

CMD [ "node", "index.js" ]