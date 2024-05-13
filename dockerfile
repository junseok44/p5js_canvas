FROM node:22-alpine3.18

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

COPY entrypoint.sh /app/entrypoint.sh

RUN ["chmod", "+x", "/app/entrypoint.sh"]

ENTRYPOINT [ "/app/entrypoint.sh" ]



# ENTRYPOINT [ "/app/entrypoint.sh"]

# command: bash -c './wait-for-it.sh -h db -p 3306 && ./wait-for-it.sh -h redis -p 6379 && cd ./client && npm install && npm run build && cd .. && npx prisma migrate dev && npm prisma generate && npm run start'


