FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install -f

COPY . .

EXPOSE 3001

RUN npm run build property-service

WORKDIR /app

EXPOSE 3001

CMD ["node","dist/apps/property-service/main.js"]