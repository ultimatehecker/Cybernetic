module.exports = {
	name: "embed",
    aliases: [],
	description: "The bot says the message you pass in an embed",
    usage: 'embed (title) (color) (content)',
	example: 'embed "Cybernetic Makers" RED The Creator of Cybernetic is ultiamte_hecker#1165',
	notes: "multi-word titles must be surrounded in doubles quotes",
	async execute(client, message, args, Discord) {

		await message.channel.sendTyping();

        let author = {
            iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
        }

		const title = args.shift();
		const color = args.shift();

		let content = args.join(" ");

		const embed = new Discord.MessageEmbed()
			.setAuthor(author)
			.setTitle(title)
			.setColor(color)
			.setDescription(content);

		return message.channel.send({ embeds: [embed] });
	},
};