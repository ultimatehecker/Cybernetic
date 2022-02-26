const colors = require("../../tools/colors.json");
const currentDate = new Date(Date.now());

module.exports = {
    name: "github",
    aliases: [],
    description: "Sends an link where you can view the current status of my GitHub Repository",
    usage: "github",
    example: "github",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping()

        let author = {
            name: "Cybernetic GitHub Link",
            iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
        }

        const github = new Discord.MessageEmbed()
			.setAuthor(author)
			.setColor(colors["MainColor"])
            .setDescription("This will redirect you to Cybernetic's GitHub Repository, where you can view issues, code and potential contribute to Cybernetic")
            .setFooter(`Cybernetic Github requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`,message.author.displayAvatarURL())

		message.reply({ embeds: [github], components: [{ type: "ACTION_ROW", components: [{ type: "BUTTON", label: "GitHub Repository", url: "https://github.com/ultimatehecker/Cybernetic", style: "LINK" }]}]});
    }
}