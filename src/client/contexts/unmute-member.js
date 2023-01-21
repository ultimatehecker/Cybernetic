module.exports = {
    name: "Unmute Member",
    type: "USER",
    execute(client, Discord, interaction, serverDoc) {
        require("../commands/moderation/unmute.js").slashExecute(client, Discord, interaction, serverDoc);
    },
};