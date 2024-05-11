FROM node:22-alpine3.18

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]

