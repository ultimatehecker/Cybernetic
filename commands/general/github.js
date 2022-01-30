const colors = require("../../data/colors.json");
const currentDate = new Date(Date.now());

module.exports = {
    name: "github",
    aliases: [],
    description: "Sends an invite link so you can view Cybernetic's GitHub Repository",
    usage: "github",
    example: "github",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping()

        const github = new Discord.MessageEmbed()
			.setAuthor("Cybernetic's GitHub Link", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
			.setColor(colors["MainColor"])
            .setDescription("This will redirect you to Cybernetic's GitHub Repository, where you can view issues, code and potential contribute to Cybernetic")
            .setFooter(`Cybernetic Github requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`,message.author.displayAvatarURL())

		message.reply({ embeds: [github], components: [{ type: "ACTION_ROW", components: [{ type: "BUTTON", label: "GitHub Repository", url: "https://github.com/ultimatehecker/Cybernetic", style: "LINK" }]}]});
    }
}