# Dev
FROM node:14.15.0-buster AS dev-stage
# This is required to access to a host other than localhost.
ENV HOST="0.0.0.0"
COPY . /app/
WORKDIR /app/
RUN yarn global add lerna \
  && lerna bootstrap
EXPOSE ${SERVER_PORT}
CMD ["lerna", "run", "dev", "--scope", "@ravyd/server", "--stream"]

# Build
FROM node:14.15.0-buster AS build-stage
COPY . /app/
WORKDIR /app/
RUN rm -rf pakages/client \
  && yarn global add lerna \
  && lerna bootstrap \
  && lerna run build --scope "@ravyd/server" --stream \
  && rm -rf node_modules \
  && cd /app/packages/shared \
  && yarn --production=true \
  && cd /app/packages/server \
  && yarn --production=true

# Prod
FROM gcr.io/distroless/nodejs:14 AS prod-stage
# This is required to access to a host other than localhost.
ENV HOST="0.0.0.0"
ENV NODE_ENV="production"
COPY --from=build-stage /app/dist /app/dist
COPY --from=build-stage /app/node_modules /app/node_modules
COPY --from=build-stage /app/packages/server/node_modules /app/packages/server/node_modules
COPY --from=build-stage /app/package.json /app/package.json
WORKDIR /app/dist
EXPOSE ${SERVER_PORT}
CMD ["-r", "module-alias/register", "server/bootstrap"]
