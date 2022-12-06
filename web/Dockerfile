FROM nginx:alpine
COPY . /usr/share/nginx/html/
WORKDIR /usr/share/nginx/html/
EXPOSE 80
RUN apk add --update nodejs npm
RUN apk add --update npm
RUN npm install
RUN apk update
RUN apk add vim
