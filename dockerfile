FROM ubuntu:24.04

RUN apt update && apt upgrade
RUN apt -y install ffmpeg nodejs npm

WORKDIR /root/

RUN git clone https://github.com/fernandoxavier/monster-the-bot.git

WORKDIR /root/monster-the-bot
RUN npm install

COPY .env /root/monster-the-bot/

CMD ["node", "bot.js"]