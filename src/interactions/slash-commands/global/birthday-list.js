const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const birthdaySchema = require("../../../models/birthday");

module.exports = {
  name: "birthdaylist",
  type: 1,
  description: "Lista de aniversariantes.",

  run: async (client, interaction) => {
    try {
      const birthdayDoc = await birthdaySchema.aggregate([
        {
          $project: {
            username: 1,
            birthdate: {
              $dateToString: {
                format: "%d/%m/%Y",
                date: "$birthdate",
              },
            },
            month: { $month: "$birthdate" },
            day: { $dayOfMonth: "$birthdate" },
          },
        },
        {
          $sort: { month: 1, day: 1 },
        },
      ]);

      if (birthdayDoc.length == 0)
        return interaction.reply({
          content: `❌ | Não tem aniversariantes cadastrados.`,
          ephemeral: true,
        });

      const birthdayList = birthdayDoc.map(
        (birthday) =>
          `${birthday.username
            .charAt(0)
            .toUpperCase()}${birthday.username.slice(1)} - ${
            birthday.birthdate
          }`
      );

      const chunkSize = 20;
      const pages = Math.ceil(birthdayList.length / chunkSize);

      let currentPage = 0;

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Lista de aniversariantes")
        .setDescription(
          birthdayList
            .slice(currentPage * chunkSize, (currentPage + 1) * chunkSize)
            .join("\n") || "**Nenhum aniversariante**"
        )
        .setFooter({
          text: `Página ${currentPage + 1} | Total de ${
            birthdayList.length
          } aniversariantes`,
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
        idle: 360000,
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
            birthdayList
              .slice(currentPage * chunkSize, (currentPage + 1) * chunkSize)
              .join("\n") || "**Nenhum aniversariante**"
          )
          .setFooter({
            text: `Página ${currentPage + 1} | Total de ${
              birthdayList.length
            } aniversariante`,
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
    } catch (error) {
      console.error("Erro ao executar aggregate ou find:", error);
    }
  },
};
