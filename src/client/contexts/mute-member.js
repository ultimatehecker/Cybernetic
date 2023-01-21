module.exports = {
    name: "Mute Member",
    type: "USER",
    execute(client, Discord, interaction, serverDoc) {
        require("../commands/moderation/mute.js").slashExecute(client, Discord, interaction, serverDoc);
    },
};