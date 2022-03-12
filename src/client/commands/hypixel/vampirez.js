const { hypixel, errors } = require('../../schemas/hypixel');
const commaNumber = require('comma-number');
const User = require('../../schemas/user');
const colors = require("../../tools/colors.json");
const currentDate = new Date(Date.now());

module.exports = {
    name: 'vampirez',
    aliases: ["vz", "vampire", "vampires", "vampz"],
    description: 'will show you the VampireZ stats of a player',
    usage: 'vampirez [IGN]',
    example: 'vampirez ultimate_hecker',
    async execute(client, message, args, Discord, prefix) {

        await message.channel.sendTyping()

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
        }
    
        let authorSuccess = {
            name: "Vampirez Statistics",
            iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
        }

        const data = await User.findOne({
            id: message.author.id
        });

        if (!data && !args[0]) { // if someone didn't type in ign
            const ign404 = new Discord.MessageEmbed()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescription(`You need to type in a player's IGN! (Example: \`${prefix}h!vampirez cxntered\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${prefix}link cxntered\`)`)
            return message.reply({ embeds: [ign404] })
        }

        let player;
        if (data && !args[0]) {
             player = data.uuid;
        } else if (args[0]) {
             player = args[0];
        }

        hypixel.getPlayer(player).then((player) => {
            const vampirez = new Discord.MessageEmbed()
                .setAuthor(authorSuccess)
                .setTitle(`[${player.rank}] ${player.nickname}`)
                .setColor(colors["MainColor"])
                .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                .setFooter(`Vampirez Statistics requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`,message.author.displayAvatarURL())
                .addField('Coins', `\`${commaNumber(player.stats.vampirez.coins)}\``, true)
                .addField('Human Wins', `\`${commaNumber(player.stats.vampirez.human.wins)}\``, true)
                .addField('Human Kills', `\`${commaNumber(player.stats.vampirez.human.kills)}\``, true)
                .addField('Human Deaths', `\`${commaNumber(player.stats.vampirez.human.deaths)}\``, true)
                .addField('Human KD Ratio', `\`${commaNumber(player.stats.vampirez.human.KDRatio)}\``, true)
                .addField('Zombie Kills', `\`${commaNumber(player.stats.vampirez.zombie.kills)}\``, true)

            message.reply({ embeds: [vampirez] });

        }).catch(e => { // error messages
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
            } else if (e.message === errors.CANNOT_READ_PROPERTIES_OF_UNDEFINED) {
                const neverLogged = new Discord.MessageEmbed()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription('That player has never played this game')
                return message.reply({ embeds: [neverLogged] });
            } else {
                const error = new Discord.MessageEmbed()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${error}\`\`\``)
                return message.reply({ embeds: [error] });
            }       
        });
    }
}