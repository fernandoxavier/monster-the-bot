const directorySearch = require("node-recursive-directory");
const { REST, Routes } = require("discord.js");
const readFiles = require("../read-all-files.js");
module.exports = async (client, rootPath) => {
  const globalSlashCommandsFiles = await directorySearch(
    `${rootPath}/src/interactions/slash-commands/global`
  );
  const rest = new REST({ version: "10" }).setToken(client.token);

  if (globalSlashCommandsFiles?.length > 0) {
    let AGCOA = []; // All global commands as an array of objects.
    await globalSlashCommandsFiles.forEach(async (globalFile) => {
      const globalCommand = require(globalFile);
      if (!globalCommand.name || globalCommand.ignore || !globalCommand.run)
        return;
      await client.slashCommands.set(globalCommand.name, globalCommand);
      if (!globalCommand.description)
        AGCOA.push({
          name: mglobalCommand.name,
          type: globalCommand.type,
        });
      else
        AGCOA.push({
          name: globalCommand.name,
          description: globalCommand.description,
          type: globalCommand.type,
          options: globalCommand?.options ?? [],
        });
    });
    try {
      await rest.put(Routes.applicationCommands(client.application.id), {
        body: AGCOA,
      });
    } catch (error) {
      console.log(error);
    }
  }
};
