FROM node:16

WORKDIR /usr/src/clean-node-api

COPY ./dist ./dist
COPY ./package.json .
COPY ./package-lock.json .

RUN npm install --only=prod

EXPOSE 5000

CMD [ "npm", "run", "start" ]
