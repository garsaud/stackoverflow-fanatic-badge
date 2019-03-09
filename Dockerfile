FROM buildkite/puppeteer
LABEL maintainer="cyril.garsaud@gmail.com"
ADD package.json app.js configure configure-and-launch /
RUN npm i && touch conf.json
ENV PATH="${PATH}:/"
CMD node app.js
