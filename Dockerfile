FROM node:carbon
WORKDIR /app
COPY package*.json ./
RUN npm install -g @angular/cli
RUN npm install
COPY . /app
RUN ng build --prod --env=prod
CMD npm run babel-node -- ./server.js
EXPOSE 3000
