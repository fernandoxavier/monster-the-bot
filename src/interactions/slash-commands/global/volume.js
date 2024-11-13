const { useQueue } = require("discord-player");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "volume",
  type: 1,
  description: "Muda o volume da música e da queue inteira.",
  options: [
    {
      name: "volume",
      description: "O valor do volume",
      type: ApplicationCommandOptionType.Integer,
      min_value: 0,
      max_value: 100,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const vol = interaction.options.getInteger("volume");
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

    const volumeembed = new EmbedBuilder()
      .setAuthor({
        name: interaction.client.user.tag,
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setColor("#FF0000")
      .setTitle(`Volume ajustado 🎧`)
      .setDescription(`O volume foi setado para **${vol}%**!`)
      .setTimestamp()
      .setFooter({
        text: `Quem pediu: ${
          interaction.user.discriminator != 0
            ? interaction.user.tag
            : interaction.user.username
        }`,
      });

    try {
      queue.node.setVolume(vol);
      interaction.reply({ embeds: [volumeembed] });
    } catch (err) {
      interaction.reply({
        content: `❌ | Eita, deu merda aqui, deu erro ao ajustar o volume. Tenta de novo.`,
        ephemeral: true,
      });
    }
  },
};
