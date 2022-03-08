const { hypixel, errors } = require('../../schemas/hypixel');
const commaNumber = require('comma-number');
const User = require('../../schemas/user');
const colors = require("../../tools/colors.json");
const currentDate = new Date(Date.now());

/*
    Math I dont understand:

    let seconds;
    let full_hours;
    let full_minutes;
    let reminaing_seconds;

    seconds = player.stats.arcade.zombies.overall.fastestRound30
    seconds = seconds / 3600
    full_hours = Math.ceil(seconds)
    minutes = seconds - full_hours * 60
    full_minutes = Math.ceil(minutes)
    remaining_seconds = minutes - full_minutes x 60

    full_hours:full_minutes:remaining_seconds

*/

module.exports = {
    name: 'zombies',
    aliases: ["zom", "zb"],
    description: 'Shows you the different gamemodes and overall statistics of a Hypixel Bedwars player!',
    usage: 'zombies [IGN]',
    example: 'zombies ultimate_hecker',
    async execute(client, message, args, Discord, prefix) {

            await message.channel.sendTyping();

            let authorError = {
                name: "Error",
                iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
            }
    
            let authorSuccess = {
                name: "Overall Zombies Statistics",
                iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
            }

            const data = await User.findOne({
                id: message.author.id
            });

            if (!args[0] && !data) { // if someone didn't type in ign and wasn't verified
                const ign404 = new Discord.MessageEmbed()
				    .setAuthor(authorError)
				    .setColor(colors["ErrorColor"])
				    .setDescription(`You need to type in a player's IGN! (Example: \`${prefix}zombies.overall ultimate_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${prefix}link ultimate_hecker\`)`);
			    return message.reply({ embeds: [ign404], allowedMentions: { repliedUser: false }});
            }

            let player;

            if (data && !args[0]) {
                player = data.uuid;
            } else if (args[0]) {
                player = args[0];
            }

            hypixel.getPlayer(player).then((player) => {
                const zombies = new Discord.MessageEmbed()
                    .setAuthor(authorSuccess)
                    .setTitle(`[${player.rank}] ${player.nickname}`)
                    .setColor(colors["MainColor"])
                    .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                    .setFooter(`${player.nickname}'s Zombies Statistics requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`, message.author.displayAvatarURL())

                    .addField("Windows & Doors", `\`•\` **Opened**: \`${player.stats.arcade.zombies.overall.doorsOpened}\` \n \`•\` **Repaired**: \`${commaNumber(player.stats.arcade.zombies.overall.windowsRepaired)}\``, true)
                    .addField("Kills", `\`•\` **Kills**: \`${player.stats.arcade.zombies.overall.zombieKills }\` \n \`•\` ** Deaths**: \`${commaNumber(player.stats.arcade.zombies.overall.deaths)}\` \n \`•\` **KDR**: \`${commaNumber((player.stats.arcade.zombies.overall.zombieKills / player.stats.arcade.zombies.overall.deaths).toFixed(2))}\``, true)
                    .addField("Wins", `\`•\` **Rounds Survived**: \`${player.stats.arcade.zombies.overall.roundsSurvived}\` \n \`•\` ** Wins**: \`${commaNumber(player.stats.arcade.zombies.overall.wins)}\``, true)
                    .addField("Revived", `\`•\` **Players Revived**: \`${player.stats.arcade.zombies.overall.playersRevived}\` \n \`•\` ** Times Knocked Down**: \`${commaNumber(player.stats.arcade.zombies.overall.timesKnockedDown)}\` \n \`•\` ** RDR**: \`${commaNumber((player.stats.arcade.zombies.overall.playersRevived / player.stats.arcade.zombies.overall.timesKnockedDown).toFixed(2))}\``, true)
                    .addField("Best Rounds", `\`•\` **Fastest Round 10**: \`${commaNumber((player.stats.arcade.zombies.overall.fastestRound10/ 60).toFixed(2))}\` \n \`•\` ** Fastest Round 20**: \`${commaNumber((player.stats.arcade.zombies.overall.fastestRound20/ 60).toFixed(2))}\` \n \`•\` ** Fastest Round 30**: \`${Math.round(player.stats.arcade.zombies.overall.fastestRound30 / 60)}:${(player.stats.arcade.zombies.overall.fastestRound30 / 60 - Math.round(player.stats.arcade.zombies.overall.fastestRound30)) * 60}\``, true)

                message.reply({ embeds: [zombies], allowedMentions: { repliedUser: false } })

            }).catch(e => { // error messages
                if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
					const player404 = new Discord.MessageEmbed()
						.setAuthor(authorError)
						.setColor(colors["ErrorColor"])					.setDescription("I could not find that player in the API. Check spelling and name history.")
					return message.reply({ embeds: [player404], allowedMentions: { repliedUser: false }});
				} else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
					const neverLogged = new Discord.MessageEmbed()
						.setAuthor(authorError)
						.setColor(colors["ErrorColor"])
						.setDescription("That player has never logged into Hypixel.")
					return message.reply({embeds: [neverLogged], allowedMentions: { repliedUser: false }});
				} else if (e.message === errors.CANNOT_READ_PROPERTIES_OF_UNDEFINED) {
                    const neverPlayed = new Discord.MessageEmbed()
                        .setAuthor(authorError)
                        .setColor(colors["ErrorColor"])
                        .setDescription("That player has never played this game")
                    return message.reply({ embeds: [neverPlayed], allowedMentions: { repliedUser: false } })
                } else {
					const error = new Discord.MessageEmbed()
						.setAuthor(authorError)
						.setColor(colors["ErrorColor"])
						.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${e}\`\`\``)
					return message.reply({ embeds: [error], allowedMentions: { repliedUser: false }});
                }       
            });
    }
}