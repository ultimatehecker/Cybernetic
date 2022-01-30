module.exports = {
	name: "embed",
    aliases: [],
	description: "The bot says the message you pass in an embed",
    usage: 'embed (title) (color) (content)',
	example: 'embed "Cybernetic Makers" RED The Creator of Cybernetic is ultiamte_hecker#1165',
	notes: "multi-word titles must be surrounded in doubles quotes",
	async execute(client, message, args, Discord) {

		await message.channel.sendTyping();

		const title = args.shift();
		const color = args.shift();

		let content = args.join(" ");

		const embed = new Discord.MessageEmbed()
			.setAuthor("https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
			.setTitle(title)
			.setColor(color)
			.setDescription(content);

		return message.channel.send({ embeds: [embed] });
	},
};