const colors = require(`../../tools/colors.json`)
const currentDate = new Date(Date.now());
const setup = require(`../../schemas/setup`);
const online = require(`../../schemas/online`)

module.exports = {
    name: "join",
    aliases: "run-client",
    description: "Runs a virtualized non-gui basec client of Minecraft locally",
    usage: "join",
    example: "join",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "Mineflayer Account Success",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        if(message.author.id != "724798908278112309" && message.author.id != "722092754510807133") {
            const error = new Discord.MessageEmbed()
                .setAuthor(authorError)
                .setColor(colors["MainColor"])
                .setDescription("Sorry, but only the owner ultimate_hecker & poly can run this command for now")

            message.reply({ embeds: [error], allowedMentions: { repliedUser: false } });

        } else {
            const joined = new Discord.MessageEmbed()
                .setAuthor(authorSuccess)
                .setColor(colors["MainColor"])
                .setDescription(`The Minecraft account, \`${process.env.MINECRAFT_USERNAME}\`, has successfully joined the Minecraft server, \`${process.env.IP_ADDR}\``)
                .setFooter(`Mineflayer Services requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`, message.author.displayAvatarURL())

            message.reply({ embeds: [joined], allowedMentions: { repliedUser: false } });
            setup.createClient()
            online.toggleStatus()
        }
    }
}