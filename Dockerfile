FROM node:lts

ARG TEST_MODE=false

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm install

COPY . .

RUN export TEST_MODE=${TEST_MODE} && npm run build

CMD npm run start