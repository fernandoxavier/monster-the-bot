const { useQueue } = require("discord-player");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
  name: "nowplaying",
  type: 1,
  description: "Mostra a música que está tocando.",
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

    const progress = queue.node.createProgressBar();
    var create = progress.replace(/ 0:00/g, " ◉ AO VIVO");

    const npembed = new EmbedBuilder()
      .setAuthor({
        name: interaction.client.user.tag,
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setThumbnail(queue.currentTrack.thumbnail)
      .setColor("#FF0000")
      .setTitle(`Tocando agora 🎵`)
      .setDescription(
        `${queue.currentTrack.title} ${
          queue.currentTrack.queryType != "arbitrary"
            ? `([Link](${queue.currentTrack.url}))`
            : ""
        }\n${create}`
      )
      .setTimestamp();

    if (queue.currentTrack.requestedBy != null) {
      npembed.setFooter({
        text: `Quem pediu: ${
          interaction.user.discriminator != 0
            ? interaction.user.tag
            : interaction.user.username
        }`,
      });
    }

    var finalComponents = [
      (actionbutton = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("np-delete").setStyle(4).setLabel("🗑️"),
        //.addOptions(options)
        new ButtonBuilder()
          .setCustomId("np-back")
          .setStyle(1)
          .setLabel("⏮️ Anterior"),
        new ButtonBuilder()
          .setCustomId("np-pauseresume")
          .setStyle(1)
          .setLabel("⏯️ Tocar/Pausar"),
        new ButtonBuilder()
          .setCustomId("np-skip")
          .setStyle(1)
          .setLabel("⏭️ Skipar"),
        new ButtonBuilder()
          .setCustomId("np-clear")
          .setStyle(1)
          .setLabel("🧹 Limpar Queue")
      )),
      (actionbutton2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("np-volumeadjust")
          .setStyle(1)
          .setLabel("🔊 Ajustar Volume"),
        new ButtonBuilder()
          .setCustomId("np-loop")
          .setStyle(1)
          .setLabel("🔂 Repetir uma vez"),
        new ButtonBuilder()
          .setCustomId("np-shuffle")
          .setStyle(1)
          .setLabel("🔀 Shuffle Queue"),
        new ButtonBuilder()
          .setCustomId("np-stop")
          .setStyle(1)
          .setLabel("🛑 Parar Queue")
      )),
    ];

    interaction.reply({ embeds: [npembed], components: finalComponents });
  },
};
