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

		const title = args.shift();
		const color = args.shift();

		let content = args.join(" ");

		const embed = new Discord.MessageEmbed()
			.setTitle(title)
			.setColor(color)
			.setDescription(content)

		return message.channel.send({ embeds: [embed] });
	}
};