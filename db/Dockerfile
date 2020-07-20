FROM redis:6.0.4-alpine

WORKDIR /data

VOLUME /data

EXPOSE 6379

CMD ["sh", "-c", "redis-server --requirepass $REDIS_PASSWORD"]
