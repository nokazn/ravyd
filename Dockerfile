FROM node:12.18.0-alpine

ENV PROJECT_ROOTDIR /app/

WORKDIR $PROJECT_ROOTDIR

COPY package.json yarn.lock $PROJECT_ROOTDIR

RUN apk add python make g++ && yarn install

COPY . $PROJECT_ROOTDIR

EXPOSE 3000
ENV HOST 0.0.0.0

CMD ["yarn", "dev"]
