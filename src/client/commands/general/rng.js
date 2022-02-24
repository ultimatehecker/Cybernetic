const colors = require("../../tools/colors.json");
const currentDate = new Date(Date.now());

module.exports = {
	name: "rng",
	aliases: ["random"],
	description: "Will generate a random number out of any array of numbers you specify",
	usage: "`rng [Min] [Max]`",
	example: "`rng 1 10`",
	async execute(client, message, args, Discord, prefix) {

		await message.channel.sendTyping();

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
        }

        let authorSuccess = {
            name: "RNG",
            iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
        }

		let response = [Math.floor(Math.random() * (args[1] - 1 + 1) + 1)]; // rng

		if (!args[1]) {
			const nonumbers = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`You didn't specify a lowest and highest number! (Example: \`${prefix}rng 1 10\`)`);

			return message.reply({ embeds: [nonumbers], allowedMentions: { repliedUser: false } });
		}

		if (isNaN(args[1])) {
			const nan = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("That is not a number!");

			return message.reply({ embeds: [nan], allowedMentions: { repliedUser: false } });
		}

		const rng = new Discord.MessageEmbed()
			.setAuthor(authorSuccess)
			.setColor(colors["MainColor"])
			.setDescription(`You got \`${response}\`!`)
			.setFooter(`RNG requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`,message.author.displayAvatarURL());
		message.reply({ embeds: [rng], allowedMentions: { repliedUser: false } });
	}
}
