FROM nginx

COPY /src/ /usr/share/nginx/html/
WORKDIR /usr/share/nginx/html
EXPOSE 80
RUN apt-get update && apt-get install -y vim
