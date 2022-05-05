const colors = require("../../tools/colors.json");

module.exports = {
	name: "overview",
	aliases: [],
	description: "Displays an overlay which shows your current discord server",
	usage: "overview",
	example: "overview",
	async execute(client, message, args, Discord) {

		await message.channel.sendTyping();

        let author = {
            name: "Sever Statistics",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

		const currentDate = new Date(Date.now());
		const owner = message.guild.members.resolve(message.guild.ownerId).user.tag;

		const overview = new Discord.MessageEmbed()
			.setAuthor(author)
			.setColor(colors["MainColor"])
			.setTitle(`${message.guild.name}`)
			.setDescription("Different Statistics about this Discord Server")
			.setThumbnail(message.guild.iconURL())
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
};