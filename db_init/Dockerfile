FROM mariadb
COPY init.sql /docker-entrypoint-initdb.d/init.sql
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["mariadbd"]