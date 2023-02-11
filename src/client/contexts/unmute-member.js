module.exports = {
    name: "Unmute Member",
    type: "2",
    execute(client, Discord, interaction, serverDoc) {
        require("../commands/moderation/unmute.js").slashExecute(client, Discord, interaction, serverDoc);
    },
};