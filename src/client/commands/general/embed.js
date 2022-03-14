console.log('Command File Successfully Scanned - embed')

module.exports = {
	name: "embed",
    aliases: [],
	description: "The client puts whatever you say into a nicely formated embed",
    usage: 'embed (title) (color) (content)',
	example: 'embed "Cybernetic Makers" RED The Creator of Cybernetic is ultiamte_hecker#1165',
	notes: "multi-word titles must be surrounded in doubles quotes",
	async execute(client, message, args, Discord) {

		await message.channel.sendTyping();

        let author = {
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
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
	}
};