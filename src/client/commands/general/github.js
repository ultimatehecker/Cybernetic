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

        let author = {
            name: "Cybernetic GitHub Link",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        const github = new Discord.MessageEmbed()
			.setAuthor(author)
			.setColor(colors["MainColor"])
            .setDescription("This will redirect you to Cybernetic's GitHub Repository, where you can view issues, code and potential contribute to Cybernetic")

		message.reply({ embeds: [github], allowedMentions: { repliedUser: true }, components: [{ type: "ACTION_ROW", components: [{ type: "BUTTON", label: "GitHub Repository", url: "https://github.com/ultimatehecker/Cybernetic", style: "LINK" }]}]});
    },
    async slashExecute(client, Discord, interaction) {

        await interaction.deferReply({ ephemeral: false });

        let author = {
            name: "Cybernetic GitHub Link",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        const github = new Discord.MessageEmbed()
			.setAuthor(author)
			.setColor(colors["MainColor"])
            .setDescription("This will redirect you to Cybernetic's GitHub Repository, where you can view issues, code and potential contribute to Cybernetic")

		interaction.editReply({ embeds: [github], allowedMentions: { repliedUser: true }, components: [{ type: "ACTION_ROW", components: [{ type: "BUTTON", label: "GitHub Repository", url: "https://github.com/ultimatehecker/Cybernetic", style: "LINK" }]}]});
    }
};