const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "stop",
  type: 1,
  description: "Desconecta o bot da sala e limpa a queue.",
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
    const stopembed = new EmbedBuilder()
      .setAuthor({
        name: interaction.client.user.tag,
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setColor("#FF0000")
      .setTitle(`Parou a música 🛑`)
      .setDescription(`Pararam a música... vou dar o vazare!`)
      .setTimestamp()
      .setFooter({
        text: `Quem pediu: ${
          interaction.user.discriminator != 0
            ? interaction.user.tag
            : interaction.user.username
        }`,
      });

    try {
      queue.delete();
      interaction.reply({ embeds: [stopembed] });
    } catch (err) {
      interaction.reply({
        content: `❌ | Eita, deu merda aqui, ao parar a música. Tenta de novo.`,
        ephemeral: true,
      });
    }
  },
};
