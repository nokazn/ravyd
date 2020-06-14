# ビルド用
FROM node:12.18.0-alpine as build-stage

ENV PROJECT_ROOTDIR="/app/" NODE_ENV="production"

WORKDIR $PROJECT_ROOTDIR

COPY package.json yarn.lock $PROJECT_ROOTDIR

RUN apk add python make g++ \
    && yarn install

COPY . $PROJECT_ROOTDIR

RUN yarn build

# 本番用
FROM node:12.18.0-alpine

ENV PROJECT_ROOTDIR="/app/" HOST="0.0.0.0"

WORKDIR $PROJECT_ROOTDIR

COPY --from=build-stage $PROJECT_ROOTDIR $PROJECT_ROOTDIR

EXPOSE 3000

CMD ["yarn", "start"]
