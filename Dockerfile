FROM node:16.13.2-alpine
COPY . /var/www
WORKDIR /var/www

RUN npm install --sillent

ENTRYPOINT npm run dev

EXPOSE 3333