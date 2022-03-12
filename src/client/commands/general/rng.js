const colors = require("../../tools/colors.json");
const currentDate = new Date(Date.now());

module.exports = {
	name: "rng",
	aliases: ["random"],
	description: "Generates a random number from an array number from what you supply",
	usage: "`rng [Min] [Max]`",
	example: "`rng 1 10`",
	async execute(client, message, args, Discord, prefix) {

		await message.channel.sendTyping();

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "RNG",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

		let response = [Math.floor(Math.random() * (args[1] - 1 + 1) + 1)]; // rng

		if (!args[1]) {
			const nonumbers = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`You didn't specify a lowest and highest number! (Example: \`${prefix}rng 1 10\`)`);

			return message.reply({ embeds: [nonumbers] });
		}

		if (isNaN(args[1])) {
			const nan = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("That is not a number!");

			return message.reply({ embeds: [nan] });
		}

		const rng = new Discord.MessageEmbed()
			.setAuthor(authorSuccess)
			.setColor(colors["MainColor"])
			.setDescription(`You got \`${response}\`!`)
			.setFooter(`RNG requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`,message.author.displayAvatarURL());
		message.reply({ embeds: [rng] });
	}
}
