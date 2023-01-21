const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "Mute Member",
    type: "2",
    execute(client, Discord, interaction, serverDoc) {
        require("../commands/moderation/mute.js").slashExecute(client, Discord, interaction, serverDoc);
    },
};