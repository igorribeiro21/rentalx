FROM node:16.13.2-alpine


WORKDIR /usr/app

COPY package.json ./

RUN npm install --save --legacy-peer-deps

COPY . .

EXPOSE 3333

CMD ["npm","run","dev"]