const colors = require("../../tools/colors.json");
const currentDate = new Date(Date.now());

module.exports = {
	name: "rng",
	aliases: ["random"],
	description: "Will generate a random number out of any array of numbers you specify",
	defaultPermission: true,
	options: [
		{
			name: "number",
			description: "Chosses a random number from the specified",
			required: true,
			type: "STRING"
		}
	],
	usage: "`rng [Min] [Max]`",
	example: "`rng 1 10`",
	async execute(client, message, args, Discord, prefix) {

		await message.channel.sendTyping();

		let response = [Math.floor(Math.random() * (args[1] - 1 + 1) + 1)]; // rng

		if (!args[1]) {
			const nonumbers = new Discord.MessageEmbed()
				.setAuthor("Error", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
				.setColor(colors["ErrorColor"])
				.setDescription(`You didn't specify a lowest and highest number! (Example: \`${prefix}rng 1 10\`)`);

			return message.reply({ embeds: [nonumbers], allowedMentions: { repliedUser: false } });
		}

		if (isNaN(args[1])) {
			const nan = new Discord.MessageEmbed()
				.setAuthor("Error", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
				.setColor(colors["ErrorColor"])
				.setDescription("That is not a number!");

			return message.reply({ embeds: [nan], allowedMentions: { repliedUser: false } });
		}

		const rng = new Discord.MessageEmbed()
			.setAuthor("RNG", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
			.setColor(colors["MainColor"])
			.setDescription(`You got \`${response}\`!`)
			.setFooter(`RNG requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`,message.author.displayAvatarURL());
		message.reply({ embeds: [rng], allowedMentions: { repliedUser: false } });
	}
}
