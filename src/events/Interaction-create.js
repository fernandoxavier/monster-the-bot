module.exports = {
  name: "interactionCreate",
  run: async (interaction, client) => {
    const slashCommand = client.slashCommands.get(interaction.commandName);
    if (interaction.type == 4) {
      if (slashCommand.autocomplete) {
        try {
          const choices = [];
          await slashCommand.autocomplete(interaction, choices);
        } catch {
          return;
        }
      }
    }
    if (
      interaction.isChatInputCommand() ||
      interaction.isContextMenuCommand()
    ) {
      if (!slashCommand) return;
      return await slashCommand.run(client, interaction);
    } else if (interaction.isButton()) {
      const buttonInteraction = client.buttonCommands.get(interaction.customId);
      if (!buttonInteraction) return;
      return await buttonInteraction.run(client, interaction);
    }
  },
};
