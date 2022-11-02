const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const colors = require("../../tools/colors.json");

module.exports = {
    name: "github",
    aliases: [],
    description: "Sends an link where you can view the current status of my GitHub Repository",
    options: [],
    defaultPermission: true,
    usage: "github",
    example: "github",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping()

        const githubRepository = new ActionRowBuilder().addComponents(new ButtonBuilder()
			.setLabel('GitHub Repository')
            .setURL('https://github.com/ultimatehecker/Cybernetic')
			.setStyle(ButtonStyle.Link),
		);

        let author = {
            name: "Cybernetic GitHub Link",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        const github = new Discord.EmbedBuilder()
			.setAuthor(author)
			.setColor(colors["MainColor"])
            .setDescription("This will redirect you to Cybernetic's GitHub Repository, where you can view issues, code and potential contribute to Cybernetic")

		message.reply({ embeds: [github], allowedMentions: { repliedUser: true }, components: [githubRepository] });
    },
    async slashExecute(client, Discord, interaction) {

        await interaction.deferReply({ ephemeral: false });

        const githubRepository = new ActionRowBuilder().addComponents(new ButtonBuilder()
			.setLabel('GitHub Repository')
            .setURL('https://github.com/ultimatehecker/Cybernetic')
			.setStyle(ButtonStyle.Link),
		);

        let author = {
            name: "Cybernetic GitHub Link",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        const github = new Discord.EmbedBuilder()
			.setAuthor(author)
			.setColor(colors["MainColor"])
            .setDescription("This will redirect you to Cybernetic's GitHub Repository, where you can view issues, code and potential contribute to Cybernetic")

		interaction.editReply({ embeds: [github], allowedMentions: { repliedUser: true }, components: [githubRepository] });
    }
};