const colors = require("../../tools/colors.json");
console.log('Command File Successfully Scanned - coinflip');

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

            message.reply({ embeds: [coinflip] });
    }
};