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
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

        function randomFlip() {
            let rand = Math.random()

            if(rand <= 0.5) {
                return `The Coin landed on Heads!`
            }else if(rand >= 0.5) {
                return `The Coin landed on Tails!`
            }
        }

        const coinflip = new Discord.MessageEmbed()
            .setAuthor(author)
            .setColor(colors["MainColor"])
            .setDescription(`${randomFlip()}`)

            message.reply({ embeds: [coinflip] });
    }
};