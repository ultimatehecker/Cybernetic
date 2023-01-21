module.exports = {
    name: "Warn Member",
    type: "USER",
    execute(client, Discord, interaction, serverDoc) {
        require("../commands/moderation/warn.js").slashExecute(client, Discord, interaction, serverDoc);
    },
};