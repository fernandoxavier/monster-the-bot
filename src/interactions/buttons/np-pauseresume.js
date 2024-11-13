const { useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'np-pauseresume',
  run: async (client, interaction) => {
    const queue = useQueue(interaction.guildId);

    if (!interaction.member.voice.channelId)
      return await interaction.reply({ content: '❌ | Tu não ta em sala nenhuma cara!', ephemeral: true });
    if (
      interaction.guild.members.me.voice.channelId &&
      interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId
    )
      return await interaction.reply({ content: '❌ | Tu não ta em sala nenhuma cara!', ephemeral: true });

    if (!queue || !queue.isPlaying())
      return interaction.reply({ content: `❌ | Nem tem música tocando!`, ephemeral: true });
    var checkPause = queue.node.isPaused();

    const pauseembed = new EmbedBuilder()
      .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
      .setThumbnail(queue.currentTrack.thumbnail)
      .setColor('#FF0000')
      .setTitle(`Música ${checkPause ? 'resumida' : 'pausada'} ⏸️`)
      .setDescription(
        `A música foi **${checkPause ? 'resumida' : 'pausada'}**. Tocando agora ${queue.currentTrack.title} ${
          queue.currentTrack.queryType != 'arbitrary' ? `([Link](${queue.currentTrack.url}))` : ''
        }!`,
      )
      .setTimestamp()
      .setFooter({
        text: `Quem pediu: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}`,
      });

    try {
      queue.node.setPaused(!queue.node.isPaused());
      interaction.reply({ embeds: [pauseembed] });
    } catch (err) {
      interaction.reply({
        content: `❌ | Eita, deu merda aqui, deu erro na hora de ${
          checkPause ? 'resumir' : 'pausar'
        } a música. Tenta de novo agora vai.`,
        ephemeral: true,
      });
    }
  },
};
