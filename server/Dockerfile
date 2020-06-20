FROM node:14.4.0-alpine

WORKDIR /server

COPY package*.json ./

RUN npm install

RUN npm install -g nodemon

COPY . .
