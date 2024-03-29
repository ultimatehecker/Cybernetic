const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const colors = require("../../tools/colors.json");

module.exports = {
    name: "invite",
    aliases: [],
    description: "Sends an invite link that you can use to invite me to other servers",
    usage: "invite",
    example: "invite",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping()

        let author = {
            name: "Cybernetic Invite Link",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        const botInvite = new ActionRowBuilder().addComponents(new ButtonBuilder()
			.setLabel('Cybernetic Invite Link')
            .setURL('https://discord.com/api/oauth2/authorize?client_id=923239259845066843&permissions=8&scope=bot%20applications.commands')
			.setStyle(ButtonStyle.Link),
		);

        const invite = new Discord.EmbedBuilder()
			.setAuthor(author)
			.setColor(colors["MainColor"])
            .setDescription("This Cybernetic Invite Link does include the slash commands which will be added soon and includes the regular message based commands.")

		message.reply({ embeds: [invite], allowedMentions: { repliedUser: true }, components: [botInvite] });
    }, 
    async slashExecute(client, Discord, interaction) {

        await interaction.deferReply({ ephemeral: false });

        let author = {
            name: "Cybernetic Invite Link",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        const botInvite = new ActionRowBuilder().addComponents(new ButtonBuilder()
			.setLabel('Cybernetic Invite Link')
            .setURL('https://discord.com/api/oauth2/authorize?client_id=923239259845066843&permissions=8&scope=bot%20applications.commands')
			.setStyle(ButtonStyle.Link),
		);

        const invite = new Discord.EmbedBuilder()
            .setAuthor(author)
            .setColor(colors["MainColor"])
            .setDescription("This Cybernetic Invite Link does include the slash commands which will be added soon and includes the regular message based commands.")

		interaction.editReply({ embeds: [invite], allowedMentions: { repliedUser: true }, components: [botInvite] });
    }
};