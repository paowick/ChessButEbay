FROM node:23.11.1-alpine3.21
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install
RUN apk update
COPY . /usr/src/app
CMD ["npm","start"]
