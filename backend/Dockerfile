FROM node:20.12.2

WORKDIR /var/www/app
ADD package.json package-lock.json ./
RUN npm install && npm install pm2 -g
RUN npm ci
ADD . .
ENV NODE_ENV=development
EXPOSE 3333
CMD ["pm2-runtime", "ecosystem.config.cjs"]
