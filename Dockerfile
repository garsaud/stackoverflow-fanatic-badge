FROM buildkite/puppeteer

LABEL maintainer="cyril.garsaud@gmail.com"

ADD app.js conf.json

RUN npm i mailgun-js

CMD node app.js
