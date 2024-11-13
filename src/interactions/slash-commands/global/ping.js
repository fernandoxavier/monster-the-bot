module.exports = {
  name: "ping",
  type: 1,
  description: "Pong",
  run: async (client, interaction) => {
    interaction.reply({
      content: `Ping é de ${client.ws.ping}ms.`,
    });
  },
};
