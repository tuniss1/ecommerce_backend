FROM node:16-alpine
WORKDIR /usr/bke
COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nest-cli.json ./
COPY . .
RUN npm install 
RUN npm run build
CMD npm run start:prod