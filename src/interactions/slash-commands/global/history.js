const { useHistory, useQueue } = require("discord-player");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "history",
  type: 1,
  description: "Mostra as ultimas 10 músicas tocadas.",
  run: async (client, interaction) => {
    const history = useHistory(interaction.guildId);
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

    const previousTracks = history.tracks.toArray();
    if (!previousTracks[0])
      return interaction.reply({
        content: `❌ | Não tem música anterior.`,
        ephemeral: true,
      });

    const tracks = previousTracks.map(
      (track, idx) => `**${idx + 1})** [${track.title}](${track.url})`
    );

    const chunkSize = 10;
    const pages = Math.ceil(tracks.length / chunkSize);

    let currentPage = 0;

    const embed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("Histórico de músicas")
      .setDescription(
        tracks
          .slice(currentPage * chunkSize, (currentPage + 1) * chunkSize)
          .join("\n") || "**Nenhuma música na queue**"
      )
      .setFooter({
        text: `Página ${currentPage + 1} | Total de ${
          history.tracks.size
        } músicas`,
      });

    if (pages === 1) {
      return interaction.reply({
        embeds: [embed],
      });
    }

    const prevButton = new ButtonBuilder()
      .setCustomId("prev")
      .setLabel("Anterior")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("⬅️");

    const nextButton = new ButtonBuilder()
      .setCustomId("next")
      .setLabel("Próxima")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("➡️");

    const row = new ActionRowBuilder().addComponents(prevButton, nextButton);

    const message = await interaction.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true,
    });

    const collector = message.createMessageComponentCollector({
      idle: 60000,
    });

    collector.on("collect", (i) => {
      i.deferUpdate();

      switch (i.customId) {
        case "prev":
          currentPage = currentPage === 0 ? pages - 1 : currentPage - 1;
          break;
        case "next":
          currentPage = currentPage === pages - 1 ? 0 : currentPage + 1;
          break;
        default:
          break;
      }

      embed
        .setDescription(
          tracks
            .slice(currentPage * chunkSize, (currentPage + 1) * chunkSize)
            .join("\n") || "**Nenhuma música na queue**"
        )
        .setFooter({
          text: `Página ${currentPage + 1} | Total de ${
            history.tracks.size
          } músicas`,
        });

      message.edit({
        embeds: [embed],
        components: [row],
      });
    });

    collector.on("end", () => {
      message.edit({
        components: [],
      });
    });
  },
};
