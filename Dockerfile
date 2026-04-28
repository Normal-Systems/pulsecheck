FROM node:20-slim

# Install native build tools for better-sqlite3
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./
RUN npm install --production

COPY server.js ./
COPY public/ ./public/

ENV NODE_ENV=production
EXPOSE 8080

USER node
CMD ["node", "server.js"]
