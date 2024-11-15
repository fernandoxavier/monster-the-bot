const { ActivityType } = require("discord.js");
const { bold } = require("chalk");
const { rootPath } = require("../../bot");
const { statSync } = require("node:fs");
const directorySearch = require("node-recursive-directory");
module.exports = {
  name: "ready",
  runOnce: true,
  run: async (client) => {
    client.user.setActivity("Monsters", {
      type: ActivityType.Watching,
    });

    let allSlashCommands = 0;
    const slashCommandsTotalFiles = await directorySearch(
      `${rootPath}/src/interactions/slash-commands`
    );
    await slashCommandsTotalFiles.forEach((cmdFile) => {
      if (statSync(cmdFile).isDirectory()) return;
      const slashCmd = require(cmdFile);
      if (!slashCmd.name || slashCmd.ignore || !slashCmd.run) return;
      else allSlashCommands++;
    });

    console.log(
      bold.green("[Client] ") + bold.blue(`Logged into ${client.user.tag}`)
    );
    if (client.messageCommands.size > 0)
      console.log(
        bold.red("[MessageCommands] ") +
          bold.cyanBright(
            `Loaded ${
              client.messageCommands.size
            } MessageCommands with ${bold.white(
              `${client.messageCommandsAliases.size} Aliases`
            )}.`
          )
      );
    if (client.events.size > 0)
      console.log(
        bold.yellowBright("[Events] ") +
          bold.magenta(`Loaded ${client.events.size} Events.`)
      );
    if (client.buttonCommands.size > 0)
      console.log(
        bold.whiteBright("[ButtonCommands] ") +
          bold.greenBright(`Loaded ${client.buttonCommands.size} Buttons.`)
      );
    if (allSlashCommands > 0)
      console.log(
        bold.magenta("[SlashCommands] ") +
          bold.white(`Loaded ${allSlashCommands} SlashCommands.`)
      );
  },
};
