# Set the base image to Ubuntu
FROM node:latest

RUN curl https://install.meteor.com/ | sh

WORKDIR /app
COPY ./api /app

EXPOSE 3000

ENV MONGO_URL 'mongodb://159.89.108.85:27017/pstracker'
ENV ROOT_URL 'http://localhost'
ENV PORT 3000
ENV METEOR_ALLOW_SUPERUSER 1

RUN npm install
RUN meteor update --all-packages
RUN meteor build ./dist
RUN cd /app/dist && tar -zxf app.tar.gz
RUN cd /app/dist/bundle/programs/server && npm install --production
RUN cd /app

CMD ['node', '/app/dist/bundle/main.js']
