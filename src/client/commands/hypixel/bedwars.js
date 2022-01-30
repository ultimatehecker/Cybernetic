const { hypixel, errors } = require('../../utils/hypixel');
const commaNumber = require('comma-number');
const User = require('../../utils/user');
const colors = require("../../tools/colors.json");
const currentDate = new Date(Date.now());

module.exports = {
    name: 'bedwars',
    aliases: ["bw"],
    description: 'Will show you the BedWars stats of a player',
    usage: '`bedwars [IGN]`',
    example: '`bedwars ultimate_hecker`',
    async execute(client, message, args, Discord, prefix) {

            await message.channel.sendTyping();

            const data = await User.findOne({
                id: message.author.id
            });

            if (!args[0] && !data) { // if someone didn't type in ign and wasn't verified
                const ign404 = new Discord.MessageEmbed()
				    .setAuthor("Error", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
				    .setColor(colors["ErrorColor"])
				    .setDescription(`You need to type in a player's IGN! (Example: \`${prefix}bedwars ultimate_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${prefix}link ultimate_hecker\`)`);
			    return message.reply({ embeds: [ign404], allowedMentions: { repliedUser: false }});
            }

            if (data && !args[0]) {
                var player = data.uuid;
            } else if (args[0]) {
                var player = args[0];
            }

            hypixel.getPlayer(player).then((player) => {
                const bedwars = new Discord.MessageEmbed()
                    .setAuthor('Bedwars Statistics', 'https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp')
                    .setTitle(`[${player.rank}] ${player.nickname}`)
                    .setColor(colors["MainColor"])
                    .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                    .setFooter(`${player.nickname}'s Bedwars Statistics requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`, message.author.displayAvatarURL())

                    .addField("General Stats", `\`•\` **Levels**: \`${player.stats.bedwars.level}✫\` \n \`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\``, true)
					.addField("Games", `\`•\` **Winstreak**: \`${commaNumber(player.stats.bedwars.winstreak)}\` \n \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.wins)}\` \n \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.losses)}\` \n \`•\` **WLR**: \`${player.stats.bedwars.WLRatio}\``, true)
					.addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.deaths)}\` \n \`•\` **KDR**: \`${player.stats.bedwars.KDRatio}\``, true)
					.addField("Finals", `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.finalKills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.finalDeaths)}\` \n \`•\` **FKDR**: \`${player.stats.bedwars.finalKDRatio}\``, true)
					.addField("Beds", `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.beds.broken)}\` \n \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.beds.lost)}\` \n \`•\` **BBLR**: \`${player.stats.bedwars.beds.BLRatio}\``, true)
					.addField("Milestones", `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.WLRatio))} WLR**: \`${commaNumber(player.stats.bedwars.losses * Math.ceil(player.stats.bedwars.WLRatio) - player.stats.bedwars.wins)}\` \n \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.finalKDRatio))} FKDR**: \`${commaNumber(player.stats.bedwars.finalDeaths * Math.ceil(player.stats.bedwars.finalKDRatio) - player.stats.bedwars.finalKills)}\` \n \`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.beds.BLRatio))} BBLR**: \`${commaNumber(player.stats.bedwars.beds.lost * Math.ceil(player.stats.bedwars.beds.BLRatio) - player.stats.bedwars.beds.broken)}\``, true)

                message.reply({ embeds: [bedwars], allowedMentions: { repliedUser: false } })

            }).catch(e => { // error messages
                if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
					const player404 = new Discord.MessageEmbed()
						.setAuthor("Error", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
						.setColor(colors["ErrorColor"])
						.setDescription("I could not find that player in the API. Check spelling and name history.")
					return message.reply({ embeds: [player404], allowedMentions: { repliedUser: false }});
				} else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
					const neverLogged = new Discord.MessageEmbed()
						.setAuthor("Error", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
						.setColor(colors["ErrorColor"])
						.setDescription("That player has never logged into Hypixel.")
					return message.reply({embeds: [neverLogged], allowedMentions: { repliedUser: false }});
				} else if (e.message === errors.CANNOT_READ_PROPERTIES_OF_UNDEFINED) {
                    const neverPlayed = new Discord.MessageEmbed()
                        .setAuthor('Error', 'https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp')
                        .setColor(colors["ErrorColor"])
                        .setDescription('That player has never played this game')
                    return message.reply({ embeds: [neverLogged], allowedMentions: { repliedUser: false } })
                } else {
					const error = new Discord.MessageEmbed()
						.setAuthor("Error", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
						.setColor(colors["ErrorColor"])
						.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${e}\`\`\``)
					return message.reply({ embeds: [error], allowedMentions: { repliedUser: false }});
                }       
            });
    }
}