# Install dependencies
FROM node:12.18.0-alpine as init-stage

WORKDIR /app/

COPY . /app/

RUN yarn --frozen-lockfile --production=false

# Dev
FROM init-stage as dev-stage

WORKDIR /app/

EXPOSE ${SERVER_PORT}

CMD ["yarn", "dev:server"]

# Start
FROM init-stage as start-stage

WORKDIR /app/

RUN yarn build:server

EXPOSE ${SERVER_PORT}

CMD ["yarn", "start:server"]
