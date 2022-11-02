const colors = require("../../tools/colors.json");
const { ApplicationCommandOptionType } = require("discord.js");

//TODO fix embed color not using imprimatives

module.exports = {
	name: "embed",
    aliases: [],
	description: "The client puts whatever you say into a nicely formated embed",
	options: [
		{ 
			name: "title",
			description: "Title for the embed",
			required: true,
			type: ApplicationCommandOptionType.String
		},
        { 
			name: "color",
			description: "Color for the embed",
			required: true,
			type: ApplicationCommandOptionType.String
		},
        { 
			name: "content",
			description: "Content for the embed",
			required: true,
			type: ApplicationCommandOptionType.String
		}
	],
    defaultPermission: true,
    usage: 'embed (title) (color) (content)',
	example: 'embed "Cybernetic Makers" #ffffff The Creator of Cybernetic is ultiamte_hecker#1165',
	notes: 'The color must be a offical hex color',
	async execute(client, message, args, Discord) {

		await message.channel.sendTyping();

		const title = args.shift();
		const color = args.shift();

		let content = args.join(" ");

		const embed = new Discord.EmbedBuilder()
			.setTitle(title)
			.setColor(color)
			.setDescription(content)

		return message.channel.send({ embeds: [embed], allowedMentions: { repliedUser: true } });
	},
	async slashExecute(client, Discord, interaction) {

		await interaction.deferReply({ emphemeral: false });

		const title = interaction.options.get("title")?.value
		const color = interaction.options.get("color")?.value
		const content = interaction.options.get("content")?.value

		if(interaction.member.permissions.has("MANAGE_GUILDS")) {
			const embed = new Discord.EmbedBuilder()
				.setTitle(title)
				.setColor(color)
				.setDescription(content)

			interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
		} else {
			const permsEmbed = new Discord.EmbedBuilder()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
				.setDescription("You don\'t have to make embeds!")

			interaction.editReply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } }).then(() => {
                setTimeout(function() {
                    interaction.deleteReply()
                }, 5000);
            });
		}
	}
};