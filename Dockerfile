FROM node:18.12-alpine3.15

RUN apk --no-cache upgrade
RUN apk --no-cache add git tini

USER node 
WORKDIR /srv/www
ENV NODE_ENV development

# ENTRYPOINT ["tini", "-g", "--", "node"]

# CMD ["server.js"]

COPY . /srv/www/app
WORKDIR /srv/www/app

USER root
RUN yarn install --production=false --frozen-lockfile

RUN chown -R node:node /srv/www/app
USER node

RUN yarn build

EXPOSE 8080
CMD ["yarn","start:production"]