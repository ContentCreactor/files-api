FROM node:lts 
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN yarn
RUN yarn build
EXPOSE 8080
CMD ["yarn","start:production"]