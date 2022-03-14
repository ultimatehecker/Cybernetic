const colors = require("../../tools/colors.json");
const currentDate = new Date(Date.now());
console.log('Command File Successfully Scanned - exit')

module.exports = {
    name: "exit",
    aliases: ["stop"],
    description: "Gives all the credits where credits is due in the making for this Discord Bot",
    usage: "exit",
    example: "exit",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "Restart",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        if(message.member.id != "724798908278112309") {
            const permission404 = new Discord.MessageEmbed()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescription(`Sorry, but only **ultimate_hecker** can do this :(`)

            message.reply({ embeds:[permission404] })
        } else {
            const restart = new Discord.MessageEmbed()
                .setAuthor(author)
                .setColor(colors["MainColor"])
                .setDescription(`**WARNING**: Cybernetic is being shutdown by \`${message.author.tag}\` at \`${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()}\` UTC`)

            message.reply({ embeds: [restart] }).then(() => {
                console.warn(`[RESTART]: Cybernetic shutdown by ${message.author.tag} at ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`)
                process.exit()
            })
        }
    }
}