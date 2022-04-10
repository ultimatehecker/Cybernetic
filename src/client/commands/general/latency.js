console.log('Command File Successfully Scanned - latency');

const colors = require("../../tools/colors.json");

module.exports = {
    name: "latency",
    aliases: [],
    description: "Responds with the latency of Discord API & myself",
    usage: "latency",
    example: "latency",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping();

        let author = {
            name: "Cybernetic Latency & API Latency",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        const latency = new Discord.MessageEmbed()
            .setAuthor(author)
            .setColor(colors["MainColor"])
            .setDescription(`🏓 Cybernetic's Latency is currently \`${Date.now() - message.createdTimestamp}\` ms. Discord API Latency is currently \`${Math.round(client.ws.ping)}\` ms.`)

        message.reply({ embeds: [latency] });
    }
};