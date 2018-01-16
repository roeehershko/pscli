# Set nginx base image
FROM nginx

# Copy custom configuration file from the current directory
COPY enviroments/production/resources/nginx.conf /etc/nginx/nginx.conf

WORKDIR /app

COPY ./ /app
COPY enviroments/production/resources/meteor-client.js /app/src/meteor-client.js
RUN apt-get update
RUN apt-get install git -y
RUN apt-get install -y gnupg2
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash && \
    apt-get install -y nodejs build-essential

RUN rm -rf node_modules
RUN npm rebuild node-sass --force
RUN npm cache clean --force
RUN npm install
RUN npm run build-prod
