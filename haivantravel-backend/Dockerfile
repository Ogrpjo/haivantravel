FROM node:20

WORKDIR /app

COPY package*.json ./

RUN apt-get update && \
    apt-get install -y graphicsmagick imagemagick && \
    rm -rf /var/lib/apt/lists/*

RUN npm ci

COPY . .

RUN npm run build

RUN rm -rf ./src

ENV NODE_ENV=production
ENV PORT=2031

EXPOSE 2031

CMD ["npm", "run", "start:prod"]
