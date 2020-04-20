FROM node:carbon
WORKDIR /app
COPY package*.json ./
RUN npm install -g @angular/cli@6.0.8
RUN npm install
COPY . /app
RUN ng build --prod --env=prod --base-href http://150.165.15.81:3000
CMD npm run babel-node -- ./server.js
EXPOSE 3000
