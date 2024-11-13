const { useMainPlayer } = require("discord-player");
const player = useMainPlayer();
const { bold } = require("chalk");

module.exports = {
  name: "playerDebug",
  customEvent: true,
  run: async (client, rootPath) => {
    player.events.on("debug", async (queue, message) => {
      // Emitted when the player queue sends debug info
      // Useful for seeing what state the current queue is at
      console.log(bold.green("[PlayerQueuedebug]") + ` ${message}`);
    });
    player.on("debug", async (message) => {
      // Emitted when the player sends debug info
      // Useful for seeing what dependencies, extractors, etc are loaded
      console.log(bold.green("[PlayerDebug]") + ` ${message}`);
    });
  },
};
