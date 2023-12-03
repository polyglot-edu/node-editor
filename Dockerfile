ARG IMAGE=node:21-alpine
FROM $IMAGE

ARG TEST_MODE=true
ARG DEPLOY_URL=http://localhost:3000
ARG BACK_URL=https://polyglot-api.polyglot-edu.com

ARG WORKDIR=web-client

WORKDIR $WORKDIR

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm install

COPY . .

RUN export DEPLOY_URL=${DEPLOY_URL} && \
    export TEST_MODE=${TEST_MODE} && \
    export BACK_URL=${BACK_URL} && \
    npm run build

CMD npm run start