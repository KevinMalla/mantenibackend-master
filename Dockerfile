FROM node:14 as ts-compiler

WORKDIR /app

COPY package*.json ./

COPY tsconfig*.json ./

RUN npm install

RUN npm install typescript -g

COPY . .

RUN tsc

RUN npm run build

CMD [ "npm", "start" ]