# Set the base image to Ubuntu
FROM node:latest

RUN curl https://install.meteor.com/ | sh

WORKDIR /app
ADD ./ /app

ENV MONGO_URL 'mongodb://159.89.108.85:27017'
ENV ROOT_URL 'http://127.0.0.1:3000'
ENV METEOR_ALLOW_SUPERUSER 1

RUN npm install
RUN meteor update --all-packages
RUN meteor build ./dist
RUN tar -zxf ./dist/app.tar.gz
RUN cd dist/bundle/programs/server && npm install --production
CMD ['node', 'dist/bundle/index.js']
