const { useQueue } = require("discord-player");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "previous",
  type: 1,
  description: "Toca a música anterior.",
  run: async (client, interaction) => {
    const queue = useQueue(interaction.guild.id);

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

    const previousTracks = queue.history.tracks.toArray();
    if (!previousTracks[0])
      return interaction.reply({
        content: `❌ | Não tem música anterior.`,
        ephemeral: true,
      });

    const backembed = new EmbedBuilder()
      .setAuthor({
        name: interaction.client.user.tag,
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setColor("#FF0000")
      .setTitle(`Tocando música anterior ⏮️`)
      .setDescription(
        `Retornando a próxima para a música anterior: ${
          previousTracks[0].title
        } ${
          previousTracks[0].queryType != "arbitrary"
            ? `([Link](${previousTracks[0].url}))`
            : ""
        }!`
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
      queue.history.back();
      interaction.reply({ embeds: [backembed] });
    } catch (err) {
      interaction.reply({
        content: `❌ | Eita, deu merda aqui, deu erro na hora de voltar pra música anterior.`,
        ephemeral: true,
      });
    }
  },
};
