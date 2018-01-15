# Set the base image to Ubuntu
FROM node:latest

WORKDIR /app

ADD ./ /app

RUN rm -rf node_modules
RUN npm rebuild node-sass --force
RUN npm install

CMD ['npm', 'run', 'start']
