# Server
FROM node:14.4.0-alpine as client
WORKDIR /usr/app/client/
COPY client/package*.json ./
RUN npm install -qy
COPY client/ ./
RUN npm run build

# Client
FROM node:14.4.0-alpine
WORKDIR /usr/app/
COPY --from=client /usr/app/client/build/ ./client/build/
WORKDIR /usr/app/server/
COPY server/package*.json ./
RUN npm install -qy
COPY server/ ./
EXPOSE 8080
CMD ["npm", "start"]