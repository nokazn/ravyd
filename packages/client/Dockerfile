# Dev
FROM node:14.15.0-buster AS dev-stage
# This is required to access to a host other than localhost.
ENV HOST="0.0.0.0"
COPY . /app/
WORKDIR /app/
RUN yarn global add lerna \
  && lerna bootstrap
EXPOSE ${CLIENT_PORT}
CMD ["lerna", "run", "dev", "--scope", "@ravyd/client", "--stream"]

# Build
FROM node:14.15.0-buster AS build-stage
WORKDIR /app/
COPY . /app/
RUN rm -rf packages/server \
  && yarn global add lerna \
  && lerna bootstrap \
  && lerna run build --scope "@ravyd/client" --stream \
  && rm -rf node_modules \
  && cd /app/packages/shared \
  && yarn --production=true \
  && cd /app/packages/client \
  && yarn --production=true

# Prod
FROM gcr.io/distroless/nodejs:14 AS prod-stage
# This is required to access to a host other than localhost.
ENV HOST="0.0.0.0"
ENV NODE_ENV="production"
COPY --from=build-stage /app/packages/client/.nuxt /app/packages/client/.nuxt
COPY --from=build-stage /app/packages/client/static /app/packages/client/static
COPY --from=build-stage /app/packages/client/pre-start /app/packages/client/pre-start
COPY --from=build-stage /app/tsconfig.json /app/tsconfig.json
COPY --from=build-stage /app/packages/client/tsconfig.json /app/packages/client/tsconfig.json
COPY --from=build-stage /app/packages/client/nuxt.config.ts /app/packages/client/nuxt.config.ts
COPY --from=build-stage /app/node_modules /app/node_modules
COPY --from=build-stage /app/packages/client/node_modules /app/packages/client/node_modules
COPY --from=build-stage /app/package.json /app/package.json
WORKDIR /app/packages/client
EXPOSE ${CLIENT_PORT}
CMD ["/app/node_modules/.bin/nuxt-ts", "start"]
