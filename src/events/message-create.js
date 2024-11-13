const { prefix } = require("../credentials/config");
module.exports = {
  name: "messageCreate",
  run: async (message, client) => {
    if (!Array.isArray(prefix)) return;
    prefix.forEach(async (botPrefix) => {
      if (message.content.startsWith(botPrefix)) {
        const commandName = message.content
          .toLowerCase()
          .slice(botPrefix.length)
          .trim()
          .split(" ")[0];
        const command =
          client.messageCommands.get(commandName) ??
          client.messageCommands.get(
            client.messageCommandsAliases.get(commandName)
          );
        if (!command) return;
        const args = message.content
          .slice(botPrefix.length)
          .trim()
          .slice(commandName.length)
          .trim()
          .split(" ");
        if (command.allowInDms) {
          return await command.run(client, message, args);
        } else if (!message.guild) return;
        else if (command.allowBots) {
          return await command.run(client, message, args);
        } else if (message.author.bot) return;
        else return await command.run(client, message, args);
      } else {
        let twitterOrXRegex = /(https?:\/\/(?:twitter|x)\.com)/;
        if (twitterOrXRegex.test(message.content)) {
          let filteredUrl = message.content.replace(
            twitterOrXRegex,
            "https://fxtwitter.com"
          );
          message.reply(filteredUrl);
        }
      }
    });
  },
};
