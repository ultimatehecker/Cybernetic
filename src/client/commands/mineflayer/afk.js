const colors = require(`../../tools/colors.json`)
const currentDate = new Date(Date.now());
const setup = require(`../../schemas/setup`);

module.exports = {
    name: "afk",
    aliases: "afk-client",
    description: "Runs the account, and after 5 minutes disconnects and reconnects the client",
    usage: "afk",
    example: "afk",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
        }

        let authorSuccess = {
            name: "Mineflayer AFK Success",
            iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
        }

        if(message.author.id != "724798908278112309" && message.author.id != "722092754510807133") {
            const error = new Discord.MessageEmbed()
                .setAuthor(authorError)
                .setColor(colors["MainColor"])
                .setDescription("Sorry, but only the owner ultimate_hecker#1165 & poly#3622 can run this command for now")

            message.reply({ embeds: [error], allowedMentions: { repliedUser: false } });

        }else {
            const afking = new Discord.MessageEmbed()
                .setAuthor(authorSuccess)
                .setColor(colors["MainColor"])
                .setDescription(`The Minecraft account, \`${process.env.MINECRAFT_USERNAME}\`, is currently afking on the Minecraft server, \`${process.env.IP_ADDR}\``)
                .setFooter(`Mineflayer Services requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`, message.author.displayAvatarURL())

            message.reply({ embeds: [afking], allowedMentions: { repliedUser: false } });
            console.log(`The Minecraft account: ${process.env.MINECRAFT_USERNAME} is now afking on the Minercraft Server: ${process.env.IP_ADDR}`)
            setup.afkClient()
        }
    }
}