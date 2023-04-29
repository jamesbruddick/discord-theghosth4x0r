FROM node:alpine

RUN apk add g++ make py3-pip

WORKDIR /discord-theghosth4x0r

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]