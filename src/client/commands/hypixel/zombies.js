const { hypixel, errors } = require('../../schemas/hypixel');
const commaNumber = require('comma-number');
const User = require('../../schemas/user');
const colors = require("../../tools/colors.json");
const currentDate = new Date(Date.now());

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
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "Overall Zombies Statistics",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        const data = await User.findOne({
            id: message.author.id
        });

        if (!args[0] && !data) { // if someone didn't type in ign and wasn't verified
            const ign404 = new Discord.MessageEmbed()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescription(`You need to type in a player's IGN! (Example: \`${prefix}zombies.overall ultimate_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${prefix}link ultimate_hecker\`)`);
            return message.reply({ embeds: [ign404] });
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
                .addField("Accuracy", `\`•\` **Gun Accuracy**: \`${player.stats.arcade.zombies.gunAccuracy }\` \n \`•\` ** Headshots**: \`${commaNumber(player.stats.arcade.zombies.headshots)}\` \n \`•\` **Headshots Accuracy**: \`${commaNumber((player.stats.arcade.zombies.headshotAccuracy).toFixed(2))}\``, true)
                .addField("Wins", `\`•\` **Rounds Survived**: \`${player.stats.arcade.zombies.overall.roundsSurvived}\` \n \`•\` ** Wins**: \`${commaNumber(player.stats.arcade.zombies.overall.wins)}\``, true)
                .addField("Revived", `\`•\` **Players Revived**: \`${player.stats.arcade.zombies.overall.playersRevived}\` \n \`•\` ** Times Knocked Down**: \`${commaNumber(player.stats.arcade.zombies.overall.timesKnockedDown)}\` \n \`•\` ** RDR**: \`${commaNumber((player.stats.arcade.zombies.overall.playersRevived / player.stats.arcade.zombies.overall.timesKnockedDown).toFixed(2))}\``, true)
                .addField("Best Rounds", `\`•\` **Fastest Round 10**: \`${commaNumber((player.stats.arcade.zombies.overall.fastestRound10 / 60).toFixed(2))}\` \n \`•\` ** Fastest Round 20**: \`${commaNumber((player.stats.arcade.zombies.overall.fastestRound20/ 60).toFixed(2))}\` \n \`•\` ** Fastest Round 30**: \`${commaNumber((player.stats.arcade.zombies.overall.fastestRound30 / 60).toFixed(2))}\``, true)

            message.reply({ embeds: [zombies] });

        }).catch(e => { // error messages
            if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
                const player404 = new Discord.MessageEbed()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])					.setDescription("I could not find that player in the API. Check spelling and name history.")
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
                return message.reply({ embeds: [error] });
            }       
        });
    }
}