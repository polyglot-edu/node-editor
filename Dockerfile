FROM node:lts

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm install

COPY . .

# build phase in startup because nextjs saves the env variables at build time
CMD npm run build && npm run start