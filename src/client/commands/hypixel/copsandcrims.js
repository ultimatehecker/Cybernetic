const { hypixel, errors } = require("../../models/hypixel");
const commaNumber = require("comma-number");
const User = require("../../models/user");
const colors = require("../../colors.json");
const currentDate = new Date(Date.now());

module.exports = {
    name: 'copsandcrims',
    aliases: [ "c&c", "cac", "cvc", "cops", "crims" ],
    description: 'Show you the Cops and Crims Statistics of an average Hypixel Cops & Crims Player!',
    usage: '`copsandcrims [IGN]`',
    example: '`copsandcrims ultimate_hecker`',
    async execute(client, message, args, Discord, prefix) {

        await message.channel.sendTyping();

        const data = await User.findOne({
            id: message.author.id
        });

        if (!data && !args[0]) { // if someone didn't type in ign
            const ign404 = new Discord.MessageEmbed()
                .setAuthor('Error', 'https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp')
                .setColor(colors["ErrorColor"])
                .setDescription(`You need to type in a player's IGN! (Example: \`${prefix}copsandcrims ultimate_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${prefix}link ultimate_hecker\`)`)
            return message.reply({ embeds: [ign404], allowedMentions: { repliedUser: false } });
        }

        let player;
        if (data && !args[0]) {
             player = data.uuid;
        } else if (args[0]) {
             player = args[0];
        }

        hypixel.getPlayer(player).then((player) => {
            const copsandcrims = new Discord.MessageEmbed()
                .setAuthor('Cops and Crims Stats', 'https://hypixel.net/styles/hypixel-v2/images/game-icons/CVC-64.png')
                .setTitle(`[${player.rank}] ${player.nickname}`)
                .setColor(colors["MainColor"])
                .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                .setFooter(`Cops & Crims Statistics requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`, message.author.displayAvatarURL())

                .addField('Coins', `\`${commaNumber(player.stats.copsandcrims.coins)}\``, true)
                .addField('Wins', `\`${commaNumber(player.stats.copsandcrims.wins)}\``, true)
                .addField('Round Wins', `\`${commaNumber(player.stats.copsandcrims.roundWins)}\``, true)
                .addField('Kills', `\`${commaNumber(player.stats.copsandcrims.kills)}\``, true)
                .addField('Criminal Kills', `\`${commaNumber(player.stats.copsandcrims.killsAsCrim)}\``, true)
                .addField('Cop Kills', `\`${commaNumber(player.stats.copsandcrims.killsAsCop)}\``, true)
                .addField('Deathes', `\`${commaNumber(player.stats.copsandcrims.deaths)}\``, true)
                .addField('Deathmatch Kills', `\`${commaNumber(player.stats.copsandcrims.deathmatch.kills )}\``, true)
                .addField('Headshot Kills', `\`${commaNumber(player.stats.copsandcrims.headshotKills)}\``, true)
                .addField('Bombs Defused', `\`${commaNumber(player.stats.copsandcrims.bombsDefused)}\``, true)
                .addField('Bombs Planted', `\`${commaNumber(player.stats.copsandcrims.bombsPlanted)}\``, true)
                .addField('KD Ratio', `\`${commaNumber(player.stats.copsandcrims.KDRatio)}\``, true)

            message.reply({ embeds: [copsandcrims], allowedMentions: { repliedUser: false } });

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
                        .setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${e}\`\`\``)
                    return message.reply({ embeds: [error], allowedMentions: { repliedUser: false } })
                }       
        });
    }
}