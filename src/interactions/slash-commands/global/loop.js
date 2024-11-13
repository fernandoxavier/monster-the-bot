const { QueueRepeatMode, useQueue } = require("discord-player");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

const repeatModes = {
  desligado: QueueRepeatMode.OFF,
  musica: QueueRepeatMode.TRACK,
  queue: QueueRepeatMode.QUEUE,
  autoplay: QueueRepeatMode.AUTOPLAY,
};

module.exports = {
  name: "loop",
  type: 1,
  description: "Da loop na música atual ou na queue inteira.",
  options: [
    {
      name: "mode",
      description: "Escolha o modo de loop.",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: Object.keys(repeatModes).map((modeName) => ({
        name: modeName.charAt(0).toUpperCase() + modeName.slice(1), // Capitalize the mode name
        value: modeName,
      })),
    },
  ],
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

    const modeName = interaction.options.getString("mode", true);
    const modeValue = repeatModes[modeName.toLowerCase()];

    const mode =
      modeName === "musica"
        ? "Modo loop de música on 🔂"
        : modeName === "queue"
        ? "Modo loop de música 🔁"
        : modeName === "autoplay"
        ? "Modo autoplay de música 🤖"
        : "Modo de loop desligado 📴";

    const loopembed = new EmbedBuilder()
      .setAuthor({
        name: interaction.client.user.tag,
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setColor("#FF0000")
      .setTitle(mode)
      .setDescription(`O modo de loop foi setado para ${modeName}!`)
      .setTimestamp()
      .setFooter({
        text: `Quem pediu: ${
          interaction.user.discriminator != 0
            ? interaction.user.tag
            : interaction.user.username
        }`,
      });

    try {
      queue.setRepeatMode(modeValue);
      interaction.reply({ embeds: [loopembed] });
    } catch (err) {
      interaction.reply({
        content: `❌ | Eita, deu merda aqui, deu erro ao trocar o modo de loop. Tenta de novo agora vai.`,
        ephemeral: true,
      });
    }
  },
};
