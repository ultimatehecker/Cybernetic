const axios = require("axios")
const colors = require("../../tools/colors.json");

module.exports = {
    name: "server",
    aliases: ["mcserver"],
    description: "Will show you information about a Minecraft Server",
    usage: "server (ip) [port]",
    example: "server hypixel.net",
    async execute(client, message, args, Discord, prefix) {

        await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "Server Information",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        try {
            if(!args[0]) {
                const ip404 = new Discord.MessageEmbed()
                    .setAuthor(authorError)
                    .setColor(colors["MainColor"])
                    .setDescription(`You need to type in a server IP! (Example: \`${prefix}server mc.hypixel.net\`)`)
                return message.reply({ embeds: [ip404], allowedMentions: { repliedUser: false } })
            }

            const MOTDData = await axios.get(`https://api.mcsrvstat.us/2/${args[0]}`).then(res => res.json());
            const serverData = await axios.get(`https://mc-api.net/v3/server/ping/${args[0]}`).then(res => res.json());

            const server = new Discord.MessageEmbed()
                .setAuthor(authorSuccess)
                .setTitle(args[0])
                .setColor(colors["MainColor"])
                .addField('IP Address', `\`${MOTDData.ip}\`:\`${MOTDData.port}\``)
                .addField('Version', `\`${serverData.version.name}\``)
                .addField('Online Players', `\`${serverData.players.online}\`/\`${serverData.players.max}\``)
                .setThumbnail(serverData.favicon)

                if (MOTDData.motd.clean[1] !== undefined) {
                    const cleanMOTD = `\n ${MOTDData.motd.clean[1]}`
                    server.addField('Clean MOTD', `\`${MOTDData.motd.clean[0]}${cleanMOTD}\``)

                } else if (MOTDData.motd.clean[1] == undefined) {
                    server.addField('Clean MOTD', `\`${MOTDData.motd.clean[0]}\``)
                }

                if (MOTDData.motd.raw[1] !== undefined) {
                    const rawMOTD = `\n ${MOTDData.motd.raw[1]}`
                    server.addField('Raw MOTD', `\`${MOTDData.motd.raw[0]}${rawMOTD}\``)
                    
                } else if (MOTDData.motd.clean[1] == undefined) {
                    server.addField('Raw MOTD', `\`${MOTDData.motd.raw[0]}\``)
                }

            message.reply({ embeds: [server], allowedMentions: { repliedUser: false } })

        } catch {
            const error = new Discord.MessageEmbed()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescription(`An error has occurred. Check the IP address. If the error persists and you are certain that the IP is correct, create a new issue on the github repository by doing \`${prefix}github\``)
            message.reply({ embeds: [error], allowedMentions: { repliedUser: false } })
        }
    }
}