FROM node:4-onbuild

ADD . /srv/www
WORKDIR /srv/www
RUN npm install

EXPOSE 3000
CMD ["node", "./bin/index.js"]
