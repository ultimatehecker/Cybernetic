const colors = require("../../data/colors.json");
const currentDate = new Date(Date.now());

module.exports = {
    name: "invite",
    aliases: [],
    description: "Sends an invite link so you can invite it to other servers",
    usage: "invite",
    example: "invite",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping()

        const invite = new Discord.MessageEmbed()
			.setAuthor("Cybernetic's Invite Link", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
			.setColor(colors["MainColor"])
            .setDescription("This Cybernetic Invite Link does include the slash commands which will be added soon and includes the regular message based commands.")
            .setFooter(`Cybernetic Invite Link requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`,message.author.displayAvatarURL())

		message.reply({ embeds: [invite], components: [{ type: "ACTION_ROW", components: [{ type: "BUTTON", label: "Bot Invite", url: "https://discord.com/api/oauth2/authorize?client_id=834177766869565491&permissions=8&scope=applications.commands%20bot", style: "LINK" }]}]});
    }
}