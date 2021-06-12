FROM node:14-slim as builder

RUN npm i npm@7.17.0 -g

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN NODE_ENV=production npm run web.build

FROM node:14-slim

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/build .

RUN NODE_ENV=production npm install

EXPOSE 3000

CMD [ "node", "index.js" ]