const { hypixel, errors } = require("../../models/hypixel");
const commaNumber = require("comma-number");
const User = require("../../models/user");
const colors = require("../../colors.json");
const currentDate = new Date(Date.now());

module.exports = {
    name: 'buildbattle',
    aliases: [ "bb", "build" ],
    description: 'Show you the Build Battle Statistics of am average Hypixel Build Battle Player!',
    usage: '`buildbattle [IGN]`',
    example: '`buildbattle ultimate_hecker`',
    async execute(client, message, args, Discord, prefix) {

        await message.channel.sendTyping();

        const data = await User.findOne({
            id: message.author.id
        });

        if (!data && !args[0]) { // if someone didn't type in ign
            const ign404 = new Discord.MessageEmbed()
                .setAuthor('Error', 'https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp')
                .setColor(colors["ErrorColor"])
                .setDescription(`You need to type in a player's IGN! (Example: \`${prefix}buildbattle ultimate_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${prefix}link ultimate_hecker\`)`)
            return message.reply({ embeds: [ign404], allowedMentions: { repliedUser: false } });
        }

        let player
        if (data && !args[0]) {
             player = data.uuid;
        } else if (args[0]) {
             player = args[0];
        }

        hypixel.getPlayer(player).then((player) => {
            const buildbattle = new Discord.MessageEmbed()
                .setAuthor('Build Battle Stats', 'https://hypixel.net/styles/hypixel-v2/images/game-icons/BuildBattle-64.png')
                .setTitle(`[${player.rank}] ${player.nickname}`)
                .setColor(colors["MainColor"])
                .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                .setFooter(`Build Battle Statistics requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`, message.author.displayAvatarURL())

                .addField('Coins', `\`${commaNumber(player.stats.buildbattle.coins)}\``, true)
                .addField('Total Wins', `\`${commaNumber(player.stats.buildbattle.winsTotal)}\``, true)
                .addField('Total Games', `\`${commaNumber(player.stats.buildbattle.playedGames)}\``, true)
                .addField('Total Votes', `\`${commaNumber(player.stats.buildbattle.totalVotes)}\``, true)
                .addField('Score', `\`${commaNumber(player.stats.buildbattle.score)}\``, true)
                .addField('Solo Wins', `\`${commaNumber(player.stats.buildbattle.wins.solo)}\``, true)
                .addField('Team Wins', `\`${commaNumber(player.stats.buildbattle.wins.team)}\``, true)
                .addField('Pro Wins', `\`${commaNumber(player.stats.buildbattle.wins.pro)}\``, true)
                .addField('Guess That Build Wins', `\`${commaNumber(player.stats.buildbattle.wins.gtb)}\``, true)

            message.reply({ embeds: [buildbattle], allowedMentions: { repliedUser: false } });

        }).catch(e => { // error messages
                if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
                    const player404 = new Discord.MessageEmbed()
                        .setAuthor('Error', 'https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp')
                        .setColor(colors["ErrorColor"])
                        .setDescription('I could not find that player in the API. Check spelling and name history.')
                    return message.reply({ embeds: [player404], allowedMentions: { repliedUser: false } })
                } else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
                    const neverLogged = new Discord.MessageEmbed()
                        .setAuthor('Error', 'https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp')
                        .setColor(colors["ErrorColor"])
                        .setDescription('That player has never logged into Hypixel.')
                    return message.reply({ embeds: [neverLogged], allowedMentions: { repliedUser: false } })
                } else if (e.message === errors.CANNOT_READ_PROPERTIES_OF_UNDEFINED) {
                    const neverPlayed = new Discord.MessageEmbed()
                        .setAuthor('Error', 'https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp')
                        .setColor(colors["ErrorColor"])
                        .setDescription('That player has never played this game')
                    return message.reply({ embeds: [neverPlayed], allowedMentions: { repliedUser: false } })
                } else {
                    const error = new Discord.MessageEmbed()
                        .setAuthor('Error', 'https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp')
                        .setColor(colors["ErrorColor"])
                        .setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${error}\`\`\``)
                    return message.reply({ embeds: [error], allowedMentions: { repliedUser: false } })
                }       
        });
    }
}