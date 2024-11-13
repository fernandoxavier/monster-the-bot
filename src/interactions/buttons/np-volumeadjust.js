const { useQueue } = require('discord-player');
const { EmbedBuilder, ActionRowBuilder, TextInputBuilder, ModalBuilder } = require('discord.js');

module.exports = {
  name: 'np-volumeadjust',
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

    const modal = new ModalBuilder()
      .setCustomId(`adjust_volume_${interaction.guild.id}`)
      .setTitle(`Ajustar volume - Atualmente em ${queue.node.volume}%`)
      .addComponents([
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('volume-input')
            .setLabel(`Qual deve ser o novo volume (0-100)?`)
            .setStyle(1)
            .setMinLength(1)
            .setMaxLength(6)
            .setPlaceholder('Sua resposta...')
            .setRequired(true),
        ),
      ]);

    await interaction.showModal(modal);

    const filter = interaction => interaction.customId.includes(`adjust_volume_${interaction.guild.id}`);
    interaction
      .awaitModalSubmit({ filter, time: 240000 })
      .then(async submit => {
        var userResponse = submit.fields.getTextInputValue('volume-input');

        if (userResponse < 0 || userResponse > 100 || isNaN(userResponse))
          return submit.reply({
            content: '❌ | O volume deve ser entre 0-100, você botou um valor fora disso.',
            ephemeral: true,
          });

        const volumeembed = new EmbedBuilder()
          .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL() })
          .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
          .setColor('#FF0000')
          .setTitle(`Volume ajustado 🎧`)
          .setDescription(`O volume foi ajustado para **${userResponse}%**!`)
          .setTimestamp()
          .setFooter({
            text: `Quem pediu: ${
              interaction.user.discriminator != 0 ? interaction.user.tag : interaction.user.username
            }`,
          });

        try {
          queue.node.setVolume(Number(userResponse));
          submit.reply({ embeds: [volumeembed] });
        } catch (err) {
          console.log(err);
          submit.reply({
            content: `❌ | Eita, deu merda aqui, deu erro ao ajustar o volume. Tenta de novo.`,
            ephemeral: true,
          });
        }
      })
      .catch(console.error);
  },
};
