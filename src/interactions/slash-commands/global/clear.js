const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "clear",
  type: 1,
  description: "Limpa toda a queue de músicas.",
  run: async (client, interaction) => {
    const queue = useQueue(interaction.guildId);

    if (!interaction.member.voice.channelId)
      return await interaction.reply({
        content: "❌ | Tu não ta em sala nenhuma cara!",
        ephemeral: true,
      });
    if (
      interaction.guild.members.me.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.members.me.voice.channelId
    )
      return await interaction.reply({
        content: "❌ | Tu não ta em sala nenhuma cara!",
        ephemeral: true,
      });

    if (!queue || !queue.isPlaying())
      return interaction.reply({
        content: `❌ | Nem tem música tocando!`,
        ephemeral: true,
      });

    const clearembed = new EmbedBuilder()
      .setAuthor({
        name: interaction.client.user.tag,
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setColor("#FF0000")
      .setTitle(`Limpar queue 🧹`)
      .setDescription(`A queue inteira foi limpa!`)
      .setTimestamp()
      .setFooter({
        text: `Quem pediu: ${
          interaction.user.discriminator != 0
            ? interaction.user.tag
            : interaction.user.username
        }`,
      });

    try {
      queue.tracks.clear();
      interaction.reply({ embeds: [clearembed] });
    } catch (err) {
      interaction.reply({
        content: `❌ | Eita, deu merda aqui, deu erro na hora de limpar a queue. Tenta de novo agora vai.`,
        ephemeral: true,
      });
    }
  },
};
