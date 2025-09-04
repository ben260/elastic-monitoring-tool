FROM node:latest
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install --legacy-peer-deps
EXPOSE 3000
CMD ["sh", "-c", "npm run build && npm run start"]


