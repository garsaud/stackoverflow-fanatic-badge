FROM buildkite/puppeteer

LABEL maintainer="cyril.garsaud@gmail.com"

ADD app.js configure

RUN npm i mailgun-js

CMD node app.js
