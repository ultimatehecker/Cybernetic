const colors = require("../../data/colors.json");
const currentDate = new Date(Date.now());

module.exports = {
    name: "credits",
    aliases: [],
    description: "Gives all the credits where credits is due in the making for this Discord Bot",
    usage: "credits",
    example: "credits",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping();

        const credits = new Discord.MessageEmbed()
            .setAuthor("Cybernetic Credits", "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp")
            .setColor(colors["MainColor"])
            .setDescription(`Cybernetic was made by \`poly#3622\` & \`ultimate_hecker#1165\` using Discord.js v13 and the MongoDB Database Atlas Cluster! Cybernetic is fully open source under the license GPL 3.0. \n \n You can check out the full GitHub Repositoiry [https://github.com/ultimatehecker/Cybernetic] \n \n You can check out the Cybernetic Support Server at [https://discord.gg/PRXhMuHcAx]`)
            .setFooter(`Credits requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`, message.author.displayAvatarURL())

        return message.reply({ embeds: [credits] });
    }
}