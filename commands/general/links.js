const colors = require("../../data/colors.json");

module.exports = {
	name: "links",
	description: "Various links for Cybernetic",
	type: "general",
	defaultPermission: true,
	options: [],
	args: [],
	aliases: [],
	example: "links",
	notes: "nothing other than links needs to be provided",
	async execute(client, message, args, Discord) {

		await message.channel.sendTyping();

		const embed = new Discord.MessageEmbed()
			.setAuthor("Cybernetic's Various Different Links", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
			.setColor(colors["MainColor"]);

		message.reply({
			embeds: [embed],
			components: [
				{
					type: "ACTION_ROW",
					components: [
						{ type: "BUTTON", label: "Bot Invite", url: "https://discord.com/api/oauth2/authorize?client_id=834177766869565491&permissions=8&scope=applications.commands%20bot", style: "LINK" },
						{ type: "BUTTON", label: "Support Server", url: "https://discord.gg/UNJMDyBstq", style: "LINK" },
						{ type: "BUTTON", label: "GitHub Repository", url: "https://github.com/ultimatehecker/Cybernetic", style: "LINK" },
					],
				},
			],
		});
	}
}