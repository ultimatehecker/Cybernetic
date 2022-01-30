const colors = require("../../tools/colors.json");

module.exports = {
	name: "overview",
	description: "An overview of the current server's statistics",
	defaultPermission: true,
	options: [],
	type: "general",
	args: [],
	aliases: [],
	example: "overview",
	notes: "nothing other than overview has to be provided",
	async execute(client, message, args, Discord) {

		await message.channel.sendTyping();

		const currentDate = new Date(Date.now());
		const owner = message.guild.members.resolve(message.guild.ownerId).user.tag;

		const overview = new Discord.MessageEmbed()
			.setAuthor("Server Statistics", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
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