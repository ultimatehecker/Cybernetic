const { ApplicationCommandOptionType } = require("discord.js");
const colors = require("../../tools/colors.json");
const axios = require('axios');
const { slashExecute } = require("./rng");

module.exports = {
    name: "xkcd",
    aliases: [],
    description: "Responds with something that you say that is coming from the client",
	options: [
		{
			name: "number",
			description: "The Comic number to display",
			type: ApplicationCommandOptionType.Integer,
			required: false,
		},
	],
    defaultPermission: true,
    usage: "xkcd {number}",
    example: "xkcd 2712",
    async execute(client, message, args, Discord) {

        message.channel.sendTyping();
        const number = args[0];

        let data;
		if (number) {
			data = (await axios.get(`https://xkcd.com/${number}/info.0.json`)).data;
		} else {
			data = (await axios.get("https://xkcd.com/info.0.json")).data;
		}

        const xkcd = new Discord.EmbedBuilder()
            .setTitle(`xkcd #${data.num} - ${data.title}`)
            .setAuthor({ name: "Randall Munroe", url: "https://xkcd.com" })
            .setColor(colors["MainColor"])
            .setImage(data.img)
            .setDescription(data.alt)
            .setFooter({ text: `Published on ${data.month}/${data.day}/${data.year}` })

        message.reply({ embeds: [xkcd], allowedMentions: { repliedUser: true } });
    },
    async slashExecute(client, Discord, interaction) {

        await interaction.deferReply({ emphemeral: false });
        const number = interaction.options.get("number")?.value;

        let data;
		if (number) {
			data = (await axios.get(`https://xkcd.com/${number}/info.0.json`)).data;
		} else {
			data = (await axios.get("https://xkcd.com/info.0.json")).data;
		}

        const xkcd = new Discord.EmbedBuilder()
            .setTitle(`xkcd #${data.num} - ${data.title}`)
            .setAuthor({ name: "Randall Munroe", url: "https://xkcd.com" })
            .setColor(colors["MainColor"])
            .setImage(data.img)
            .setDescription(data.alt)
            .setFooter({ text: `Published on ${data.month}/${data.day}/${data.year}` })

        interaction.editReply({ embeds: [xkcd], allowedMentions: { repliedUser: true } });
    }
}