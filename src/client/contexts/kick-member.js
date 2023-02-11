module.exports = {
	name: "Kick Member",
	type: "2",
	execute(client, Discord, interaction, serverDoc) {
		require("../commands/moderation/kick.js").slashExecute(client, Discord, interaction, serverDoc);
	},
};