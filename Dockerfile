FROM node
LABEL maintainer="cyril.garsaud@gmail.com"
ADD package.json app.js configure /
RUN apt update && apt install chromium -y
RUN npm i && touch conf.json
CMD node app.js
