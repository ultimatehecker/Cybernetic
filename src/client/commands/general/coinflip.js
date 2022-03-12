const colors = require("../../tools/colors.json");
const currentDate = new Date(Date.now());

module.exports = {
    name: "coinflip",
    aliases: ["cf"],
    description: "Starts a coinflip between two people",
    usage: "coinflip",
    example: "coinflip",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping();

        let author = {
            name: "Random CoinFlip",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        function randomFlip() {
            const rand = ["The Coin landed on Heads!", "The Coin landed on Tails!"];
            return rand[Math.floor(Math.random() * rand.length)];
        }

        const coinflip = new Discord.MessageEmbed()
            .setAuthor(author)
            .setColor(colors["MainColor"])
            .setDescription(`${randomFlip()}`)
            .setFooter(`Coinflip requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`, message.author.displayAvatarURL())

            message.reply({ embeds: [coinflip], allowedMentions: { repliedUser: false } });
    }
}