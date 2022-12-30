const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const colors = require("../../tools/colors.json");

module.exports = {
    name: "discord",
    aliases: [],
    description: "Sends an link where you will be able to invite yourself to my support server",
    options: [],
    defaultPermission: true,
    usage: "discord",
    example: "discord",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping();

        let author = {
            name: "Cybernetic Discord Support Server",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        const discordInvite = new ActionRowBuilder().addComponents(new ButtonBuilder()
			.setLabel('Discord Support Server')
            .setURL('https://discord.gg/4hv23VguQY')
			.setStyle(ButtonStyle.Link),
		);

        const discord = new Discord.EmbedBuilder()
			.setAuthor(author)
			.setColor(colors["MainColor"])
            .setDescription("This will send you to the Cybernetic Support Server, where you will have the chance to see future updates, more information and test out beta features!")

		message.reply({ embeds: [discord], allowedMentions: { repliedUser: true }, components: [discordInvite] });
    }, 
    async slashExecute(client, Discord, interaction, serverDoc) {

        await interaction.deferReply({ ephemeral: false });

        let author = {
            name: "Cybernetic Discord Support Server",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        const discordInvite = new ActionRowBuilder().addComponents(new ButtonBuilder()
			.setLabel('Discord Support Server')
            .setURL('https://discord.gg/4hv23VguQY')
			.setStyle(ButtonStyle.Link),
		);

        const discord = new Discord.EmbedBuilder()
            .setAuthor(author)
            .setColor(colors["MainColor"])
            .setDescription("This will send you to the Cybernetic Support Server, where you will have the chance to see future updates, more information and test out beta features!")

        interaction.editReply({ embeds: [discord], allowedMentions: { repliedUser: true }, components: [discordInvite] });
        
    }
};