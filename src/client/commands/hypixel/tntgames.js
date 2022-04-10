const { hypixel, errors } = require('../../schemas/hypixel');
const commaNumber = require('comma-number');
const User = require('../../schemas/user');
const colors = require("../../tools/colors.json");
console.log('Command File Successfully Scanned - tntgames');

module.exports = {
    name: 'tntgames',
    aliases: ["tnt"],
    description: 'Shows you TNT Games Statistics of an average Hypixel Player!',
    usage: 'tntgames [IGN]',
    example: 'tntgames ultimate_hecker',
    async execute(client, message, args, Discord, prefix) {

        await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "TNT Games Statistics",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

        const data = await User.findOne({
            id: message.author.id,
        });

        if (!data && !args[0]) { // if someone didn't type in ign
            const ign404 = new Discord.MessageEmbed()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescription(`You need to type in a player's IGN! (Example: \`${prefix}tntgames ultimate_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${prefix}link ultimate_hecker\`)`)
            return message.reply({ embeds: [ign404] })
        }

        let player;
        if (data && !args[0]) {
             player = data.uuid;
        } else if (args[0]) {
             player = args[0];
        }

        hypixel.getPlayer(player).then((player) => {

            if (!player.stats.tntgames) {
                const neverPlayed = new Discord.MessageEmbed()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription("That player has never played this game")
                return message.reply({ embeds: [neverPlayed] });
            }

            if (player.stats.tntgames.wizards.class == null) {
                 wizardsClass = 'None'
            }
            const tntgames = new Discord.MessageEmbed()
                .setAuthor(authorSuccess)
                .setTitle(`[${player.rank}] ${player.nickname}`)
                .setColor(colors["MainColor"])
                .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)

                .addField('Coins', `\`${commaNumber(player.stats.tntgames.coins)}\``, true)
                .addField('Total Wins', `\`${commaNumber(player.stats.tntgames.wins)}\``, true)
                .addField('Winstreak', `\`${commaNumber(player.stats.tntgames.winstreak)}\``, true)
                .addField('TNT Run Wins', `\`${commaNumber(player.stats.tntgames.tntrun.wins)}\``, true)
                .addField('TNT Run Deaths', `\`${commaNumber(player.stats.tntgames.tntrun.deaths)}\``, true)
                .addField('TNT Run Longest Game (Minutes)', `\`${Math.floor(player.stats.tntgames.tntrun.record / 60)}\`:\`${player.stats.tntgames.tntrun.record - Math.floor(player.stats.tntgames.tntrun.record / 60) * 60}\``, true)
                .addField('PvP Run Wins', `\`${commaNumber(player.stats.tntgames.pvprun.wins)}\``, true)
                .addField('PvP Run Deaths', `\`${commaNumber(player.stats.tntgames.pvprun.deaths)}\``, true)
                .addField('PvP Run Longest Game (Minutes)', `\`${Math.floor(player.stats.tntgames.pvprun.record / 60)}\`:\`${player.stats.tntgames.pvprun.record - Math.floor(player.stats.tntgames.pvprun.record / 60) * 60}\``, true)
                .addField('PvP Run Kills', `\`${commaNumber(player.stats.tntgames.pvprun.kills)}\``, true)
                .addField('PvP Run KD Ratio', `\`${commaNumber(player.stats.tntgames.pvprun.KDRatio)}\``, true)
                .addField('PvP Run Wins', `\`${commaNumber(player.stats.tntgames.pvprun.wins)}\``, true)
                .addField('TNT Tag Kills', `\`${commaNumber(player.stats.tntgames.tnttag.kills)}\``, true)
                .addField('TNT Tag Wins', `\`${commaNumber(player.stats.tntgames.tnttag.wins)}\``, true)
                .addField('TNT Tag Speed', `\`${commaNumber(player.stats.tntgames.tnttag.speed)}\``, true)
                .addField('Bow Spleef Wins', `\`${commaNumber(player.stats.tntgames.bowspleef.wins)}\``, true)
                .addField('Bow Spleef Tags', `\`${commaNumber(player.stats.tntgames.bowspleef.tags)}\``, true)
                .addField('Bow Spleef Deaths', `\`${commaNumber(player.stats.tntgames.bowspleef.deaths)}\``, true)
                .addField('Wizards Wins', `\`${commaNumber(player.stats.tntgames.wizards.wins)}\``, true)
                .addField('Wizards Kills', `\`${commaNumber(player.stats.tntgames.wizards.kills)}\``, true)
                .addField('Wizards Deaths', `\`${commaNumber(player.stats.tntgames.wizards.deaths)}\``, true)
                .addField('Wizards Assists', `\`${commaNumber(player.stats.tntgames.wizards.wins)}\``, true)
                .addField('Wizards KD Ratio', `\`${commaNumber(player.stats.tntgames.wizards.KDRatio)}\``, true)
                .addField('Wizards Points', `\`${commaNumber(player.stats.tntgames.wizards.points)}\``, true)
                .addField('Wizards Class', `\`${wizardsClass}\``, true)

            message.reply({ embeds: [tntgames] });

        }).catch((e) => { // error messages
            if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
                const player404 = new Discord.MessageEmbed()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription('I could not find that player in the API. Check spelling and name history.')
                return message.reply({ embeds: [player404] });
            } else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
                const neverLogged = new Discord.MessageEmbed()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription('That player has never logged into Hypixel.')
                return message.reply({ embeds: [neverLogged] });
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