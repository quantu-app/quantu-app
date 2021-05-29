FROM node:14-slim

RUN npm i npm@7.15.0 -g

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run web.build

EXPOSE 3000

CMD [ "node", "build/index.js" ]