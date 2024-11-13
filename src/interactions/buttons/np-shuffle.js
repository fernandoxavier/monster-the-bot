const { useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'np-shuffle',
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

    const shuffleembed = new EmbedBuilder()
      .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setColor('#FF0000')
      .setTitle(`Queue shuffle 🔀`)
      .setDescription(`A queue de músicas sofreu shuffle!`)
      .setTimestamp()
      .setFooter({
        text: `Quem pediu: ${interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username}`,
      });

    try {
      queue.tracks.shuffle();
      interaction.reply({ embeds: [shuffleembed] });
    } catch (err) {
      interaction.reply({
        content: `❌ | Eita, deu merda aqui, deu erro na hora de dar shuffle na queue. Tenta de novo.`,
        ephemeral: true,
      });
    }
  },
};
