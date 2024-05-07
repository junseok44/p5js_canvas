FROM node:22-alpine3.18

WORKDIR /app

COPY . .

RUN npm install && npx prisma migrate dev && npx prisma generate

EXPOSE 3000


ENTRYPOINT [ "npm", "start" ]

