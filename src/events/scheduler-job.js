const schedule = require("node-schedule");
const birthdaySchema = require("../models/birthday");
const credentialManager = require("../credentials/config");
const axios = require("axios");

module.exports = {
  name: "scheduler",
  customEvent: true,
  run: async (client) => {
    var j = schedule.scheduleJob("00 00 12 * * 0-6", async () => {
      var dt = new Date();
      dt.setHours(dt.getHours() - 3);
      let dayMonth = dt.getDate();
      let monthYear = dt.getMonth() + 1;

      let listBirthday = await birthdaySchema.aggregate([
        {
          $project: {
            username: 1,
            birthdate: 1,
            month: { $month: "$birthdate" },
            day: { $dayOfMonth: "$birthdate" },
          },
        },
        { $match: { month: monthYear, day: dayMonth } },
      ]);

      const channel = client.channels.cache.get(
        credentialManager.birthdayAnnouncementChannelId
      );

      console.log(listBirthday.length);

      if (listBirthday.length >= 1) {
        const { username, birthdate } = listBirthday[0];

        const calculateAge = (birthdate) => {
          const birthDate = new Date(birthdate);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDifference = today.getMonth() - birthDate.getMonth();

          if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }

          return age;
        };

        const age = calculateAge(birthdate);

        try {
          const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
              model: "gpt-3.5-turbo", // Ajuste o modelo conforme necessário
              messages: [
                {
                  role: "system",
                  content:
                    "Você é um assistente de celebrações de aniversário de um grupo de amigos de discord.",
                },
                {
                  role: "user",
                  content: `Crie uma mensagem de aniversário para ${username}, que está fazendo ${age} anos hoje.`,
                },
              ],
              max_tokens: 50,
            },
            {
              headers: {
                Authorization: `Bearer ${credentialManager.openAiApiKey}`,
                "Content-Type": "application/json",
              },
            }
          );

          const birthdayMessage = response.data.choices[0].text.trim();

          channel.send(birthdayMessage);
        } catch (error) {
          console.error("Erro ao gerar mensagem de aniversário:", error);
          channel.send(
            `Gostaria de desejar em nome da familia monster um feliz aniversário a ${username} pelos seus ${age} anos, muitas felicidades e saúde!`
          );
        }
      }
    });
  },
};
