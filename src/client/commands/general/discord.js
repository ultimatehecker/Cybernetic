const colors = require("../../tools/colors.json");
const currentDate = new Date(Date.now());

module.exports = {
    name: "discord",
    aliases: [],
    description: "Sends an invite link so you can view Cybernetic's GitHub Repository",
    usage: "discord",
    example: "discord",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping()

        const discord = new Discord.MessageEmbed()
			.setAuthor("Cybernetic's Discord Support Server", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
			.setColor(colors["MainColor"])
            .setDescription("This will send you to the Cybernetic Support Server, where you will have the chance to see future updates, more information and test out beta features!")
            .setFooter(`Cybernetic Github requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`,message.author.displayAvatarURL())

		message.reply({ embeds: [discord], components: [{ type: "ACTION_ROW", components: [{ type: "BUTTON", label: "Discord Support Server", url: "https://discord.gg/3b5rUekJkF", style: "LINK" }]}]});
    }
}