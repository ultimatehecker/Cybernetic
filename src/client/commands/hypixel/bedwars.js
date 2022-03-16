const { hypixel, errors } = require('../../schemas/hypixel');
const commaNumber = require('comma-number');
const User = require('../../schemas/user');
const colors = require("../../tools/colors.json");
console.log('Command File Successfully Scanned - bedwars');

module.exports = {
    name: 'bedwars',
    aliases: ["bw"],
    description: 'Shows you the different gamemodes and overall statistics of a Hypixel Bedwars player!',
    usage: 'bedwars [IGN] (gamemode)',
    example: 'bedwars ultimate_hecker overall',
    async execute(client, message, args, Discord, prefix) {

        await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
        }
    
        let authorSuccess = {
            name: "Bedwars Statistics",
            iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
        }

        const data = await User.findOne({
            id: message.author.id,
        });

        let player;
        let gamemode = ["solo", "doubles", "threes", "fours", "4v4", "castle", "dream"]

        if (!args[0] && !data) { // if someone didn't type in ign and wasn't verified
            const ign404 = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`You need to type in a player's IGN! (Example: \`${prefix}bedwars ultimate_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${prefix}link ultimate_hecker\`)`);
			return message.reply({ embeds: [ign404] });
        }

        if (data && !args[0]) {
            player = data.uuid;
        } else if (args[0]) {
            player = args[0];
        }

        hypixel.getPlayer(player).then((player) => {
                const bedwars = new Discord.MessageEmbed()
                    .setAuthor(authorSuccess)
                    .setTitle(`[${player.rank}] ${player.nickname}`)
                    .setColor(colors["MainColor"])
                    .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)

                    .addField("General Stats", `\`•\` **Levels**: \`${player.stats.bedwars.level}✫\` \n \`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\` \n \`•\` **Loot Chest**: \`${commaNumber((player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.golden + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween))}\``, true)
                    .addField("Games", `\`•\` **Winstreak**: \`${commaNumber(player.stats.bedwars.winstreak)}\` \n \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.wins)}\` \n \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.losses)}\` \n \`•\` **WLR**: \`${player.stats.bedwars.WLRatio}\``, true)
                    .addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.deaths)}\` \n \`•\` **KDR**: \`${player.stats.bedwars.KDRatio}\``, true)
                    .addField("Finals", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.finalKills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.finalDeaths)}\` \n \`•\` **FKDR**: \`${player.stats.bedwars.finalKDRatio}\``, true)
                    .addField("Beds", `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.beds.broken)}\` \n \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.beds.lost)}\` \n \`•\` **BBLR**: \`${player.stats.bedwars.beds.BLRatio}\``, true)
                    .addField("Averages per Game", `\`•\` **Kills**: \`${commaNumber((player.stats.bedwars.kills / player.stats.bedwars.playedGames).toFixed(2))}\` \n \`•\` **Final Kills**: \`${commaNumber((player.stats.bedwars.finalKills / player.stats.bedwars.playedGames).toFixed(2))}\` \n \`•\` **Beds**: \`${commaNumber((player.stats.bedwars.beds.broken / player.stats.bedwars.playedGames).toFixed(2))}\``, true)
                    .addField("Milestones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.WLRatio))} WLR**: \`${commaNumber(player.stats.bedwars.losses * Math.ceil(player.stats.bedwars.WLRatio) - player.stats.bedwars.wins)}\` \n \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.finalKDRatio))} FKDR**: \`${commaNumber(player.stats.bedwars.finalDeaths * Math.ceil(player.stats.bedwars.finalKDRatio) - player.stats.bedwars.finalKills)}\` \n \`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.beds.BLRatio))} BBLR**: \`${commaNumber(player.stats.bedwars.beds.lost * Math.ceil(player.stats.bedwars.beds.BLRatio) - player.stats.bedwars.beds.broken)}\``, true)

                message.reply({ embeds: [bedwars] });
        }).catch((e) => { // error messages
            if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
				const player404 = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("I could not find that player in the API. Check spelling and name history.")
				return message.reply({ embeds: [player404] });
			} else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
				const neverLogged = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("That player has never logged into Hypixel.")
				return message.reply({embeds: [neverLogged] });
			} else if (e.message === errors.CANNOT_READ_PROPERTIES_OF_UNDEFINED) {
                const neverPlayed = new Discord.MessageEmbed()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription("That player has never played this game")
                 return message.reply({ embeds: [neverPlayed] });
            } else {
				const error = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${e}\`\`\``)
                    console.error(e);
				return message.reply({ embeds: [error] });
            }       
        });
    }
};