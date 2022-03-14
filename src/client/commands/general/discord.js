const colors = require("../../tools/colors.json");
console.log('Command File Successfully Scanned - discord')

module.exports = {
    name: "discord",
    aliases: [],
    description: "Sends an link where you will be able to invite yourself to my support server",
    usage: "discord",
    example: "discord",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping()

        let author = {
            name: "Cybernetic Discord Support Server",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        const discord = new Discord.MessageEmbed()
			.setAuthor(author)
			.setColor(colors["MainColor"])
            .setDescription("This will send you to the Cybernetic Support Server, where you will have the chance to see future updates, more information and test out beta features!")

		message.reply({ embeds: [discord], components: [{ type: "ACTION_ROW", components: [{ type: "BUTTON", label: "Discord Support Server", url: "https://discord.gg/3b5rUekJkF", style: "LINK" }]}]});
    }
};