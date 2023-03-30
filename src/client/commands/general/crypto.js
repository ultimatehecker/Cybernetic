const colors = require(`../../tools/colors.json`);
const axios = require(`axios`);
const ApplicationCommandOptionType = require(`discord.js`)

module.exports = {
    name: `crypto`,
    aliases: [`cp`],
    description: `Displays relevent information about a specific cryptocurrency`,
    options: [
		{ 
			name: "coin",
			description: "The crypto currency you want to search",
			required: true,
			type: ApplicationCommandOptionType.String
		},
	],
    defaultPermission: true,
    usage: `crypto <cryptoCoin>`,
    example: `crypto bitcoin`,
    async execute(client, message, args, Discord) {
        /*
        await message.channel.sendTyping();

        let authorSuccess = {
            name: `Crypto`,
            iconURL: `https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256`
        }

        let authorError = {
            name: `Error`,
            iconURL: `https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256`
        }

        const crypto = args[0];

        if(!crypto){
            const noCoin = new Discord.EmbedBuilder()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescription("You need to input a coin")

            return message.reply({ embeds: [noCoin], allowedMentions: { repliedUser: true } }).then((sent) => {
                setTimeout(function() {
                    console.log(err);
                    message.delete();
                    sent.delete();
                }, 5000);
            });
        }

        const URL = `https://api.coinstats.app/public/v1/coins/${crypto}?currency=USD`

        await axios.get(URL).then((response) => {
            const coinData = response.data.coin;

            authorSuccess.name = `${coinData.name} - Crypto`;

            const cryptoEmbed = new Discord.EmbedBuilder()
                .setAuthor(authorSuccess)
                .setColor(colors[`MainColor`])
                .setThumbnail(coinData.icon)
                .setDescription(`Relevent information about ${coinData.name}`)
                .addFields([
                    { name: `Price`, value: `\`${coinData.price}\``, inline: true },
                    { name: `Market Cap`, value: `\`${coinData.marketCap}\``, inline: true },
                    { name: `24h Change`, value: `\`${coinData.change}\``, inline: true },
                    { name: `24h Volume`, value: `\`${coinData.volume}\``, inline: true },
                    { name: `All Time High`, value: `\`${coinData.allTimeHigh.price}\``, inline: true },
                    { name: `All Time High Date`, value: `\`${coinData.allTimeHigh.date}\``, inline: true },
                    { name: `All Time Low`, value: `\`${coinData.allTimeLow.price}\``, inline: true },
                ]);

            message.reply({ embeds: [cryptoEmbed], allowedMentions: { repliedUser: true } })
        }).catch((err) => {
            const error = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`err: ${err}`);

			return message.reply({ embeds: [error], allowedMentions: { repliedUser: true } }).then((sent) => {
                setTimeout(function() {
                    console.log(err);
					message.delete();
                    sent.delete();
                }, 5000);
            });
        }); */
    }, /*
    async slashExecute(client, Discord, interaction) {
        await interaction.deferReply({ ephemeral: false });

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "RNG",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        if(!interaction.options.get("coin")) {
            const noCoin = Discord.EmbedBuilder()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescipion("You must enter a coin to search")

            return interaction.editReply({ embeds: [noCoin], allowedMentions: { repliedUser: true } }).then(() => {
                setTimeout(function() {
                    interaction.deleteReply()
                }, 5000);
            });
        }

        const crypto = interaction.options.get("coin")?.value
        const URL = `https://api.coinstats.app/public/v1/coins/${crypto}?currency=USD`

        await axios.get(URL).then((response) => {
            const coinData = response.data.coin;

            authorSuccess.name = `${coinData.name} - Crypto`;

            const cryptoEmbed = new Discord.EmbedBuilder()
                .setAuthor(authorSuccess)
                .setColor(colors[`MainColor`])
                .setThumbnail(coinData.icon)
                .setDescription(`Relevent information about ${coinData.name}`)
                .addFields([
                    { name: `Price`, value: `\`${coinData.price}\``, inline: true },
                    { name: `Market Cap`, value: `\`${coinData.marketCap}\``, inline: true },
                    { name: `24h Change`, value: `\`${coinData.change}\``, inline: true },
                    { name: `24h Volume`, value: `\`${coinData.volume}\``, inline: true },
                    { name: `All Time High`, value: `\`${coinData.allTimeHigh.price}\``, inline: true },
                    { name: `All Time High Date`, value: `\`${coinData.allTimeHigh.date}\``, inline: true },
                    { name: `All Time Low`, value: `\`${coinData.allTimeLow.price}\``, inline: true },
                ]);

            interaction.editReply({ embeds: [cryptoEmbed], allowedMentions: { repliedUser: true } })
        }).catch((err) => {
            const error = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`err: ${err}`);

            return interaction.editReply({ embeds: [error], allowedMentions: { repliedUser: true } }).then(() => {
                setTimeout(function() {
                    console.log(err)
                    interaction.deleteReply()
                }, 5000);
            });
        });
    } */
}