FROM node:20-alpine
WORKDIR /app
COPY package.json ./
COPY src ./src
COPY migrations ./migrations
RUN npm install
EXPOSE 4000
CMD ["sh", "-c", "npm run migrate && npm run start"]
