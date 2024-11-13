require("dotenv").config();
module.exports = {
  prefix: ["!"],
  botToken: process.env.DISCORD_BOT_TOKEN,
  ownerIds: process.env.DISCORD_GUILD_IDS,
  youtubeAuthToken: process.env.YOUTUBE_AUTH_TOKEN,
  mongoUri: process.env.MONGO_URI,
  birthdayAnnouncementChannelId: process.env.BIRTHDAY_ANNOUNCEMENT_CHANNEL_ID,
  openAiApiKey: process.env.OPENAI_API_KEY,
};
