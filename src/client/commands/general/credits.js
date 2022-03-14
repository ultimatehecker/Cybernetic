const colors = require("../../tools/colors.json");
console.log('Command File Successfully Scanned - credits')

module.exports = {
    name: "credits",
    aliases: [],
    description: "Gives all the credits where credits is due in the making for this Discord client",
    usage: "credits",
    example: "credits",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping();

        let author = {
            name: "Cybernetic Credits",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        const credits = new Discord.MessageEmbed()
            .setAuthor(author)
            .setColor(colors["MainColor"])
            .setDescription(`Cybernetic was made by \`poly#3622\` & \`ultimate_hecker#1165\` using Discord.js v13 and the MongoDB Database Atlas Cluster! Cybernetic is fully open source under the license GPL 3.0. \n \n You can check out the full GitHub Repository [https://github.com/ultimatehecker/Cybernetic] \n \n You can check out the Cybernetic Support Server at [https://discord.gg/PRXhMuHcAx]`)

        return message.reply({ embeds: [credits] });
    }
}