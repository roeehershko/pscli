# Set the base image to Ubuntu
FROM node:latest

RUN curl https://install.meteor.com/ | sh

WORKDIR /app
ADD ./api /app

ENV MONGO_URL 'mongodb://mongo:27017/pstracker'
ENV METEOR_ALLOW_SUPERUSER 1
ENV ROOT_URL 'http://127.0.0.1:3000'

RUN npm install
RUN meteor update --all-packages

CMD ['meteor', '-p', 'server:3000']
