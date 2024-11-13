const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "skip",
  type: 1,
  description: "Skipa a música atual.",

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

    const queuedTracks = queue.tracks.toArray();
    if (!queuedTracks[0]) {
      queue.delete();
      return interaction.reply({
        content: `Não tem uma próxima música, parando o bot!`,
        ephemeral: true,
      });
    }

    const skipembed = new EmbedBuilder()
      .setAuthor({
        name: interaction.client.user.tag,
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setThumbnail(queue.currentTrack.thumbnail)
      .setColor("#FF0000")
      .setTitle(`Música skipada ⏭️`)
      .setDescription(
        `Tocando agora: ${queuedTracks[0].title} ${
          queuedTracks[0].queryType != "arbitrary"
            ? `([Link](${queuedTracks[0].url}))`
            : ""
        }`
      )
      .setTimestamp()
      .setFooter({
        text: `Quem pediu: ${
          interaction.user.discriminator != 0
            ? interaction.user.tag
            : interaction.user.username
        }`,
      });

    try {
      queue.node.skip();
      interaction.reply({ embeds: [skipembed] });
    } catch (err) {
      interaction.reply({
        content: `❌ | Eita, deu merda aqui, na hora de skipara a música. Tenta de novo.`,
        ephemeral: true,
      });
    }
  },
};
