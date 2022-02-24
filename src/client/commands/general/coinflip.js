const colors = require("../../tools/colors.json");
const currentDate = new Date(Date.now());

module.exports = {
    name: "coinflip",
    aliases: ["cf"],
    description: "Will start a CoinFlip between two people",
    usage: "coinflip",
    example: "coinflip",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping();

        let author = {
            name: "Random CoinFlip",
            iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
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