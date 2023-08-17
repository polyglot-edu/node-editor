ARG IMAGE=node:lts
FROM $IMAGE

ARG TEST_MODE=false
ARG BACK_URL=http://localhost:5000
ARG WORKDIR=web-client

WORKDIR $WORKDIR

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm install

COPY . .

RUN export TEST_MODE=${TEST_MODE} && \
    export BACK_URL=${BACK_URL} && \
    npm run build

CMD npm run start