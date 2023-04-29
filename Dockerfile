FROM node:alpine

WORKDIR /discord-theghosth4x0r

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]