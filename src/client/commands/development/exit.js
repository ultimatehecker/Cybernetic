const colors = require("../../tools/colors.json");
const currentDate = new Date(Date.now());

module.exports = {
    name: "exit",
    aliases: ["stop"],
    description: "Gives all the credits where credits is due in the making for this Discord Bot",
    usage: "exit",
    example: "exit",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping();

        if(message.member.id != "724798908278112309") {
            const permission404 = new Discord.MessageEmbed()
                .setAuthor("Error", "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp")
                .setColor(colors["ErrorColor"])
                .setDescription(`Sorry, but only **ultimate_hecker** can do this :(`)

            message.reply({ embeds:[permission404] })
        } else {
            const restart = new Discord.MessageEmbed()
                .setAuthor("Restart", "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp")
                .setColor(colors["MainColor"])
                .setDescription(`**WARNING**: Cybernetic is being shutdown by \`${message.author.tag}\` at \`${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()}\` UTC`)

            message.reply({ embeds: [restart] }).then(() => {
                console.warn(`[RESTART]: Cybernetic shutdown by ${message.author.tag} at ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`)
                process.exit()
            })
        }
    }
}