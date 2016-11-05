FROM node:4-onbuild

ADD . /srv/www
WORKDIR /srv/www

EXPOSE 3000
CMD ["node", "./bin/index.js"]
