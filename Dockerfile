FROM node:20-slim

COPY . .
RUN yarn install
RUN yarn build

CMD ["node", "dist/bot.js"]