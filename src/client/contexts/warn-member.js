const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "Warn Member",
    type: "2",
    execute(client, Discord, interaction, serverDoc) {
        require("../commands/moderation/warn.js").slashExecute(client, Discord, interaction, serverDoc);
    },
};