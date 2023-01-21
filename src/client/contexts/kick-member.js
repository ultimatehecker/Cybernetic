module.exports = {
	name: "Kick Member",
	type: "USER",
	execute(client, Discord, interaction, serverDoc) {
		require("../commands/moderation/kick.js").slashExecute(client, Discord, interaction, serverDoc);
	},
};