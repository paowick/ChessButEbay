FROM node:alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install
RUN apk update
COPY . /usr/src/app
CMD ["npm","start"]
