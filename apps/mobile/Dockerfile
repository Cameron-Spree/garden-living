FROM node:20-alpine
WORKDIR /app
COPY package.json app.json App.js ./
COPY src ./src
RUN npm install
EXPOSE 8081
CMD ["npm", "run", "start"]
