FROM node:14-alpine as builder

RUN npm install -g npm@7.19.1

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN NODE_ENV=production npm run web.build

FROM node:14-alpine

RUN npm install -g npm@7.19.1

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/build .

RUN NODE_ENV=production npm install

EXPOSE 3000

CMD [ "node", "index.js" ]