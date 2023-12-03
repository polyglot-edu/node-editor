ARG IMAGE=node:21-alpine
FROM $IMAGE

ARG TEST_MODE
ARG DEPLOY_URL
ARG BACK_URL

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