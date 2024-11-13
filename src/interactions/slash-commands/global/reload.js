module.exports = {
  name: "reload",
  type: 1,
  description: "Recarrega um comando.",
  ownerOnly: true,
  options: [
    {
      name: "command",
      description: "O comando pra recarregar.",
      type: 3,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const commandName = interaction.options
      .getString("command", true)
      .toLowerCase();
    const command = client.slashCommands.get(commandName);

    if (!command) {
      return interaction.reply(
        `Não tem comando com o nome \`${commandName}\`!`
      );
    }

    delete require.cache[require.resolve(`${__dirname}/${command.name}.js`)];

    try {
      client.slashCommands.delete(command.name);
      const newCommand = require(`${__dirname}/${command.name}.js`);
      client.slashCommands.set(newCommand.name, newCommand);
      await interaction.reply(
        `O comando \`${newCommand.name}\` foi recarregado!`
      );
    } catch (error) {
      console.error(error);
      await interaction.reply(
        `Aconteceu um erro ao recarregar o commando \`${command.name}\`:\n\`${error.message}\``
      );
    }
  },
};
