# if you're doing anything beyond your local machine, please pin this to a specific version
FROM node:9-jessie

RUN mkdir -p /var/www/notanothertodo

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /var/www/notanothertodo
RUN npm install -g sequelize-cli nodemon
COPY . .

WORKDIR /var/www/notanothertodo/server
RUN yarn

WORKDIR /var/www/notanothertodo/client
RUN yarn && yarn build