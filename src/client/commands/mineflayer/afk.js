const colors = require(`../../tools/colors.json`)
const currentDate = new Date(Date.now());
const setup = require(`../../schemas/setup`);
const online = require(`../../schemas/online`)

module.exports = {
    name: "afk",
    aliases: "run-afk",
    description: "Runs an alt account with mineflayer",
    usage: "afk",
    example: "afk",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping()

        if(message.author.id != "724798908278112309" && message.author.id != "722092754510807133") {
            const error = new Discord.MessageEmbed()
                .setAuthor("Error", "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp")
                .setColor(colors["MainColor"])
                .setDescription("Sorry, but only the owner ultimate_hecker & poly can run this command for now")

            message.reply({ embeds: [error], allowedMentions: { repliedUser: false } });

        }else {
            const afking = new Discord.MessageEmbed()
                .setAuthor("Mineflayer Account Success", "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp")
                .setColor(colors["MainColor"])
                .setDescription(`The Minecraft account, \`${process.env.MINECRAFT_USERNAME_ALT}\`, is currently afking on the Minecraft server, \`${process.env.IP_ADDR}\``)
                .setFooter(`Mineflayer Services requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`, message.author.displayAvatarURL())

            message.reply({ embeds: [afking], allowedMentions: { repliedUser: false } });
            setup.afkClient()
        }
    }
}