# Install dependencies
FROM node:12.18.0-alpine as init-stage

# This is required to access to a host other than localhost.
ENV HOST="0.0.0.0"

WORKDIR /app/

# The current directory is where the command is executed.
COPY . /app/

RUN yarn global add lerna && lerna bootstrap

# Dev
FROM init-stage as dev-stage

EXPOSE ${SERVER_PORT}

CMD ["lerna", "run", "dev", "--scope", "@ravy/server", "--stream"]

# Start
FROM init-stage as start-stage

RUN yarn build

EXPOSE ${SERVER_PORT}

CMD ["lerna", "run", "start", "--scope", "@ravy/server", "--stream"]
