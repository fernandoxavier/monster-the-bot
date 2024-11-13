# monster-the-bot

Monster the bot is a discord bot built with [discord-player](https://discord-player.js.org/) that plays music and also reminds the birthday of your discord buddies.

## setup

install [ffmpeg](https://ffmpeg.org/) for media transcoding

install dependencies
```
npm install
```

create a .env file in the root of your project with the following variables 
```
YOUTUBE_AUTH_TOKEN=""
DISCORD_BOT_TOKEN=""
DISCORD_GUILD_IDS=[""]
MONGO_URI=""
BIRTHDAY_ANNOUNCEMENT_CHANNEL_ID=""
OPENAI_API_KEY=""
```

run the application
```
node bot.js
```
