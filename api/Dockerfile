# Set the base image to Ubuntu
FROM node:latest

RUN curl https://install.meteor.com/ | sh

WORKDIR /app
ADD ./ /app

ENV MONGO_URL 'mongodb://psui-mongo:27017'
ENV METEOR_ALLOW_SUPERUSER 1

RUN npm install
RUN meteor update --all-packages

CMD ['meteor']
