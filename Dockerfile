FROM mcr.microsoft.com/playwright:v1.48.0-jammy

WORKDIR /app

COPY . .

RUN npm install --production

EXPOSE 8787

CMD ["node", "server.js"]
