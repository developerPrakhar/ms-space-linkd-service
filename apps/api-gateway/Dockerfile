FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install -f

COPY . .

EXPOSE 3002

RUN npm run build api-gateway

WORKDIR /app

EXPOSE 3002

CMD ["node","dist/apps/api-gateway/main.js"]