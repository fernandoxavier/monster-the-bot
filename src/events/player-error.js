const { useMainPlayer } = require('discord-player');
const player = useMainPlayer();

module.exports = {
  name: 'playerError',
  customEvent: true,
  run: async (client, rootPath) => {
    player.events.on('playerError', async (queue, error) => {
        console.log(`[${queue.guild.name}] (ID:${queue.metadata.channel}) Erro emitido do player: ${error.message}`);
        queue.metadata.channel.send({ content: '❌ | Erro ao extrair a música... skipando para a próxima!' })
    });
  },
};
