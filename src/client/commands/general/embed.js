const colors = require("../../tools/colors.json");
const { ApplicationCommandOptionType } = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { readDirAsync } = require("@sentry/node/types/integrations/context");

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
			type: ApplicationCommandOptionType.String,
			choices: [
				{
					name: "DEFAULT",
					value: 'Default'
				},
				{
					name: "WHITE",
					value: 'White'
				},
				{
					name: "AQUA",
					value: 'Aqua'
				},
				{
					name: "GREEN",
					value: 'Green'
				},
				{
					name: "BLUE",
					value: 'Blue'
				},
				{
					name: "YELLOW",
					value: 'Yellow'
				},
				{
					name: "PURPLE",
					value: 'Purple'
				},
				{
					name: "LUMINOUS VIVID PINK",
					value: 'LuminousVividPink'
				},
				{
					name: "FUCKSIA",
					value: 'Fuchsia'
				},
				{
					name: "GOLD",
					value: 'Gold'
				},
				{
					name: "ORANGE",
					value: 'Orange'
				},
				{
					name: "RED",
					value: 'Red'
				},
				{
					name: "GREY",
					value: 'Grey'
				},
				{
					name: "NAVY",
					value: 'Navy'
				},
				{
					name: "DARK AQUA",
					value: 'DarkAqua'
				},
				{
					name: "DARK GREEN",
					value: 'DarkGreen'
				},
				{
					name: "BLUE",
					value: 'Blue'
				},
				{
					name: "DARK PURPLE",
					value: 'DarkPurple'
				},
				{
					name: "DARK VIVID PINK",
					value: 'DarkVividPink'
				},
				{
					name: "PURPLE",
					value: 'DarkGold'
				},
				{
					name: "PURPLE",
					value: 'DarkOrange'
				},
				{
					name: "PURPLE",
					value: 'DarkRed'
				},
				{
					name: "PURPLE",
					value: 'DarkGrey'
				},
				{
					name: "DARKER GREY",
					value: 'DarkerGrey'
				},
				{
					name: "LIGHT GREY",
					value: 'LightGrey'
				},
				{
					name: "DARK NAVY",
					value: 'DarkNavy'
				},
				{
					name: "BLURPLE",
					value: 'Blurple'
				},
				{
					name: "GREYPLE",
					value: 'Greyple'
				},
				{
					name: "DARK BUT NOT BLACK",
					value: 'DarkButNotBlack'
				},
				{
					name: "NOT BLACK",
					value: 'NotQuiteBlack'
				},
				{
					name: "RANDOM",
					value: 'Random'
				},
			]
		},
        { 
			name: "description",
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

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Success",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		const colorLink = new ActionRowBuilder().addComponents(new ButtonBuilder()
			.setLabel('ColorResolvable List')
            .setURL('https://discord.js.org/#/docs/discord.js/main/typedef/ColorResolvable')
			.setStyle(ButtonStyle.Link),
		);

		const title = args.shift();
		const color = args.shift();

		let description = args.join(" ");

		if(!title || !color || !content) {
			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You must enter a Title, Color or Description")

			return message.channel.send({ embeds: [embed], allowedMentions: { repliedUser: true }, components: [colorLink] });
		} else {
			const embed = new Discord.EmbedBuilder()
				.setTitle(title)
				.setColor(color)
				.setDescription(description)

			return message.channel.send({ embeds: [embed], allowedMentions: { repliedUser: true } });
		}
	},
	async slashExecute(client, Discord, interaction) {

		await interaction.deferReply({ emphemeral: false });

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Success",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		const colorLink = new ActionRowBuilder().addComponents(new ButtonBuilder()
			.setLabel('ColorResolvable List')
            .setURL('https://discord.js.org/#/docs/discord.js/main/typedef/ColorResolvable')
			.setStyle(ButtonStyle.Link),
		);

		const title = interaction.options.get("title")?.value
		const color = interaction.options.get("color")?.value
		const content = interaction.options.get("content")?.value

		if(interaction.options.get("color")?.value && interaction.options.get("hexColor")?.value) {
			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You must enter either a ColorResolvable or a Hex Color.")

			interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true }, components: [colorLink] });
		}

		const embed = new Discord.EmbedBuilder()
			.setTitle(title)
			.setColor(color)
			.setDescription(content)

		interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
	}
};