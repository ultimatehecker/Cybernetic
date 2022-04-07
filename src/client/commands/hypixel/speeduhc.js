const { hypixel, errors } = require('../../schemas/hypixel');
const commaNumber = require('comma-number');
const User = require('../../schemas/user');
const colors = require("../../tools/colors.json");
console.log('Command File Successfully Scanned - speeduhc');

module.exports = {
    name: 'speeduhc',
    aliases: ['suhc'],
    description: 'Shows you the SpeedUHC Statistics of an average Hypixel Player!',
    usage: 'speeduhc [IGN]',
    example: 'speeduhc ultimate_hecker',
    async execute(client, message, args, Discord, prefix) {

        await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "SpeedUHC Statistics",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

        const data = await User.findOne({
            id: message.author.id,
        });

        if (!data && !args[0]) { // if someone didn't type in ign
            const ign404 = new Discord.MessageEmbed()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescription(`You need to type in a player's IGN! (Example: \`${prefix}speeduhc ultimate_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${prefix}link ultimate_hecker\`)`)
            return message.reply({ embeds: [ign404] });
        }

        let player;

        if (data && !args[0]) {
             player = data.uuid;
        } else if (args[0]) {
             player = args[0];
        }

        hypixel.getPlayer(player).then((player) => {
            const speeduhc = new Discord.MessageEmbed()
                .setAuthor(authorSuccess)
                .setTitle(`[${player.rank}] ${player.nickname}`)
                .setColor(colors["MainColor"])
                .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)

                .addField('Kills', `\`${commaNumber(player.stats.speeduhc.kills)}\``, true)
                .addField('Losses', `\`${commaNumber(player.stats.speeduhc.losses)}\``, true)
                .addField('Wins', `\`${commaNumber(player.stats.speeduhc.wins)}\``, true)
                .addField('Winstreak', `\`${commaNumber(player.stats.speeduhc.winstreak)}\``, true)
                .addField('Deaths', `\`${commaNumber(player.stats.speeduhc.deaths)}\``, true)
                .addField('Games Played', `\`${commaNumber(player.stats.speeduhc.playedGames)}\``, true)
                .addField('Coins', `\`${commaNumber(player.stats.speeduhc.coins)}\``, true)
                .addField('KD Ratio', `\`${player.stats.speeduhc.KDRatio}\``, true)
                .addField('WL Ratio', `\`${player.stats.speeduhc.WLRatio}\``, true)

            message.reply({ embeds: [speeduhc] });

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