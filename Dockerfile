FROM node:20-slim

WORKDIR /opt/app
COPY . .
RUN yarn install
RUN yarn build
USER node

CMD ["node", "dist/bot.js"]