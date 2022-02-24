const colors = require("../../tools/colors.json");
const currentDate = new Date(Date.now());

module.exports = {
    name: "latency",
    aliases: [],
    description: "Pings the client and responds with the latency",
    usage: "latency",
    example: "latency",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping();

        let author = {
            name: "Cybernetic Latency & API Latency",
            iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
        }

        const latency = new Discord.MessageEmbed()
            .setAuthor(author)
            .setColor(colors["MainColor"])
            .setDescription(`🏓 Cybernetic's Latency is currently \`${Date.now() - message.createdTimestamp}\` ms. Discord API Latency is currently \`${Math.round(client.ws.ping)}\` ms.`)
            .setFooter(`Cybernetic's Latency requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`, message.author.displayAvatarURL())

        message.reply({ embeds: [latency] });
    }
}