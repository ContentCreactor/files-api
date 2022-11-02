FROM backend-dev 

COPY . /srv/www/app
WORKDIR /srv/www/app

USER root
RUN yarn install --production=false --frozen-lockfile

RUN chown -R node:node /srv/www/app
USER node

RUN yarn build

EXPOSE 8080
CMD ["yarn","start:production"]