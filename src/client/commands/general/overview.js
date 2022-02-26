const colors = require("../../tools/colors.json");

module.exports = {
	name: "overview",
	aliases: [],
	description: "Displays an overlay which shows your current discord server",
	usage: "overview",
	example: "overview",
	notes: "nothing other than overview has to be provided",
	async execute(client, message, args, Discord) {

		await message.channel.sendTyping();

        let author = {
            name: "Sever Statistics",
            iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
        }

		const currentDate = new Date(Date.now());
		const owner = message.guild.members.resolve(message.guild.ownerId).user.tag;

		const overview = new Discord.MessageEmbed()
			.setAuthor(author)
			.setColor(colors["MainColor"])
			.setTitle(`${message.guild.name}`)
			.setDescription("Different Statistics about this Discord Server")
			.setThumbnail(message.guild.iconURL())
			.setFooter(`${message.guild.name} Discord Server Statistics requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`, message.author.displayAvatarURL())
			.addFields([
				{ name: "Member Count", value: `\`${message.guild.members.cache.size}\``, inline: true},
				{ name: "Discord Server Role Count", value: `\`${message.guild.roles.cache.size}\``, inline: true },
				{ name: "Server Owner", value: `\`${owner}\``, inline: true },
				{ name: "Channel Count", value: `\`${message.guild.channels.cache.size}\``, inline: true },
				{ name: "Server ID", value: `\`${message.guild.id}\``, inline: true },
				{ name: "Date Created", value: `\`${message.guild.createdAt.getMonth()}/${message.guild.createdAt.getDate()}/${message.guild.createdAt.getFullYear()}\``, inline: true },
			]);

		message.reply({ embeds: [overview] });
	}
}