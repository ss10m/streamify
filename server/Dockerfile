FROM node:14.1.0-alpine

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]