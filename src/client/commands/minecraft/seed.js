const colors = require("../../tools/colors.json");
const currentDate = new Date(Date.now());

module.exports = {
    name: "seed",
    aliases: [],
    description: "Gives all the credits where credits is due in the making for this Discord Bot",
    usage: "seed",
    example: "seed",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "Minecraft Seed Generator",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        function mcseed() {
            let random_number = Math.floor(Math.random() * 9223372036854775807);
            let interger = ["-1", ""]
            return interger[Math.floor(Math.random() * interger.length)], random_number
        }

        const seed = new Discord.MessageEmbed()
            .setAuthor(authorSuccess)
            .setColor(colors["MainColor"])
            .setDescription(`Here is your randomly generated minecraft seed: \`${mcseed()}\``)
            .setFooter(`Random Minecarft Seed requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`, message.author.displayAvatarURL())

        message.reply({ embeds: [seed] })
    }
}