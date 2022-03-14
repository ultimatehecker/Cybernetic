console.log('Command File Successfully Scanned - invite');

const colors = require("../../tools/colors.json");
const currentDate = new Date(Date.now());

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

        const invite = new Discord.MessageEmbed()
			.setAuthor(author)
			.setColor(colors["MainColor"])
            .setDescription("This Cybernetic Invite Link does include the slash commands which will be added soon and includes the regular message based commands.")
            .setFooter(`Cybernetic Invite Link requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`,message.author.displayAvatarURL())

		message.reply({ embeds: [invite], components: [{ type: "ACTION_ROW", components: [{ type: "BUTTON", label: "Bot Invite", url: "https://discord.com/api/oauth2/authorize?client_id=834177766869565491&permissions=8&scope=applications.commands%20bot", style: "LINK" }]}]});
    }
};