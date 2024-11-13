const { QueueRepeatMode, useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'np-loop',
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

    if (queue.repeatMode === QueueRepeatMode.TRACK) {
      const loopmode = QueueRepeatMode.OFF;
      queue.setRepeatMode(loopmode);

      const mode = 'Modo de loop desligado 📴';
      const loopembed = new EmbedBuilder()
        .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setColor('#FF0000')
        .setTitle(mode)
        .setDescription(`O modo de loop foi setado para **desligado**!`)
        .setTimestamp()
        .setFooter({
          text: `Quem pediu: ${
            interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username
          }`,
        });

      interaction.reply({ embeds: [loopembed] });
    } else {
      const loopmode = QueueRepeatMode.TRACK;
      queue.setRepeatMode(loopmode);

      const mode = 'Modo loop de música on 🔁';
      const loopembed = new EmbedBuilder()
        .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setColor('#FF0000')
        .setTitle(mode)
        .setDescription(`O modo de loop foi setado para **música atual**!`)
        .setTimestamp()
        .setFooter({
          text: `Quem pediu: ${
            interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username
          }`,
        });

      interaction.reply({ embeds: [loopembed] });
    }
  },
};
