# Install dependencies
FROM node:12.18.0-alpine as init-stage

# This is required to access to a host other than localhost.
ENV HOST="0.0.0.0"

WORKDIR /app/

# The current directory is where the command is executed.
COPY . /app/

RUN yarn --frozen-lockfile --production=false

# Dev
FROM init-stage as dev-stage

EXPOSE ${SERVER_PORT}

CMD ["yarn", "dev:server"]

# Start
FROM init-stage as start-stage

RUN yarn build:server

EXPOSE ${SERVER_PORT}

CMD ["yarn", "start:server"]
