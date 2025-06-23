FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install -f

COPY . .

RUN npm run build auth-service

WORKDIR /app

EXPOSE 3000

CMD ["node","dist/apps/auth-service/main.js"]