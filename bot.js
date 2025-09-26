(async () => {
  const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
  } = require("discord.js");
  const credentialManager = require("./src/credentials/config");
  const dirPath = __dirname;
  const mongoose = require("mongoose");

  const {
    messageCommandsManager,
    eventsManager,
    buttonManager,
    slashCommandsManager,
  } = require("./src/structures/managers/export");
  /* const { DeezerExtractor, NodeDecryptor } = require("discord-player-deezer"); */
  const { Player } = require("discord-player");
  const { YoutubeiExtractor } = require("discord-player-youtubei");
  const { DefaultExtractors } = require('@discord-player/extractor');
  const botClient = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent, // Only for bots with message content intent access.
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildInvites,
    ],
    partials: [Partials.Channel],
  });

  const player = new Player(botClient, {
    useLegacyFFmpeg: false,
    skipFFmpeg: false,
    ytdlOptions: {
      quality: "highestaudio",
      highWaterMark: 1 << 25,
    },
  });

  (async () => {
    /* await player.extractors.register(DeezerExtractor, {
      arl: credentialManager.deezerArlKey,
      decryptionKey: credentialManager.deezerDecriptionKey,
      decryptor: NodeDecryptor,
    }); */
    await player.extractors.register(YoutubeiExtractor, {
      streamOptions: {
        useClient: "WEB_EMBEDDED",
      },
      innertubeConfigRaw: {
        player_id: '0004de42',
      },
      generateWithPoToken: true,
      useServerAbrStream: false,
    });
    await player.extractors.loadMulti(DefaultExtractors);
  })();

  exports.rootPath = dirPath;
  exports.client = botClient;

  mongoose.connect(credentialManager.mongoUri);

  botClient.messageCommands = new Collection();
  botClient.messageCommandsAliases = new Collection();
  botClient.events = new Collection();
  botClient.buttonCommands = new Collection();
  botClient.slashCommands = new Collection();

  await messageCommandsManager(botClient, dirPath);
  await eventsManager(botClient, dirPath);
  await buttonManager(botClient, dirPath);
  await botClient.login(credentialManager.botToken);
  await slashCommandsManager(botClient, dirPath);
})();
