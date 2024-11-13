module.exports = {
  name: 'ping',
  allowInDms: true,
  aliases: ['pong'],
  run: async (client, message, args) => {
    message.channel.send(`Meu ping é ${client.ws.ping}ms.`);
  },
};
