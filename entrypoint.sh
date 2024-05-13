#!/bin/sh


chmod +x ./wait-for-it.sh
# wait-for-it.sh 스크립트를 실행하여 DB와 Redis가 준비될 때까지 대기
./wait-for-it.sh -h db -p 3306 && ./wait-for-it.sh -h redis -p 6379

# client 폴더로 이동하여 npm install 및 빌드 실행
cd ./client
npm install --force
npm run build
cd ..

# Prisma 마이그레이션 실행
npx prisma migrate dev
npx prisma generate

# 서버 시작
npm run start
