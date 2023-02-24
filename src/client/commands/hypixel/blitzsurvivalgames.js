const { hypixel, errors } = require('../../database/models/hypixel');
const commaNumber = require('comma-number');
const User = require('../../database/schemas/user');
const colors = require("../../tools/colors.json");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'blitzsurvivalgames',
    aliases: [ "bsg", "survivalgames", "sg", "blitz" ],
    description: 'Show you the Blitz Survival Games statistics of an average Hypixel Player!',
	options: [
		{
			name: "player",
			description: "Shows the statistics of an average Hypixel Bedwars player!",
			required: false,
			type: ApplicationCommandOptionType.String
		}
	],
    defaultPermission: true,
    usage: 'blitzsurvivalgames [IGN]',
    example: 'blitzsurvivalgames ultimate_hecker',
    async execute(client, message, args, Discord, prefix) {

        await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "BlitzSurvivalGames Statistics",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        const data = await User.findOne({
            id: message.author.id,
        });

        if (!data && !args[0]) { // if someone didn't type in ign
            const ign404 = new Discord.EmbedBuilder()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescription(`You need to type in a player's IGN! (Example: \`${prefix}blitzsurvivalgames ultimate_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${prefix}link ultimate_hecker\`)`)
            return message.reply({ embeds: [ign404], allowedMentions: { repliedUser: true } }).then((sent) => {
                setTimeout(function() {
                    message.delete();
                    sent.delete();
                }, 5000);
            });
        }

        let player
        if (data && !args[0]) {
             player = data.uuid;
        } else if (args[0]) {
             player = args[0];
        }

        hypixel.getPlayer(player).then((player) => {

            if (!player.stats.blitzsg) {
                const neverPlayed = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription("That player has never played this game")
                return message.reply({ embeds: [neverPlayed], allowedMentions: { repliedUser: true } }).then((sent) => {
                    setTimeout(function() {
                        message.delete();
                        sent.delete();
                    }, 5000);
                });
            }

            const blitzsurvivalgames = new Discord.EmbedBuilder()
                .setAuthor(authorSuccess)
                .setTitle(`[${player.rank}] ${player.nickname}`)
                .setColor(colors["MainColor"])
                .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                .addFields([
                    { name: `General`, value: `\`•\` **Coins**: \`${commaNumber(player.stats.blitzsg.coins)}\``, required: true, inline: true },
                    { name: `Wins`, value: `\`•\` **Solo Wins**: \`${commaNumber(player.stats.blitzsg.winsSolo)}\` \n \`•\` **Team Wins**: \`${commaNumber(player.stats.blitzsg.winsTeam)}\``, required: true, inline: true },
                    { name: `Kills`, value: `\`•\` **Kills**: \`${commaNumber(player.stats.blitzsg.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.blitzsg.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.blitzsg.KDRatio)}\``, required: true, inline: true },
                ])

            // If problem occours, it is most probably line 89 & 90 along with the last 2 on line 88

            if(player.stats.blitzsg.kitStats) {
                blitzsurvivalgames.addFields([
                    { name: `Kit Statistics`, value: `\`•\` **Name**: \`${commaNumber(player.stats.blitzsg.kitStats.name)}\` \n \`•\` **Level**: \`${commaNumber(player.stats.blitzsg.kitStats.level)}\` \n \`•\` **Time Played**: \`${commaNumber(player.stats.blitzsg.kitStats.timePlayed)}\` \n \`•\` **Games Played**: \`${commaNumber(player.stats.blitzsg.kitStats.games)}\` \n \`•\` **Experience**: \`${commaNumber(player.stats.blitzsg.kitStats.prestige)}\` \n \`•\` **Experience**: \`${commaNumber(player.stats.blitzsg.kitStats.experience)}\``, required: true, inline: true },
                    { name: `Combat`, value: `\`•\` **Kills**: \`${commaNumber(player.stats.blitzsg.kitStats.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.blitzsg.kitStats.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.blitzsg.kitStats.KDRatio)}\``, required: true, inline: true },
                    { name: `Games`, value: `\`•\` **Wins**: \`${commaNumber(player.stats.blitzsg.kitStats.wins)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.blitzsg.kitStats.losses)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.blitzsg.kitStats.WLRatio)}\``, required: true, inline: true },
                ]);
            }

            message.reply({ embeds: [blitzsurvivalgames], allowedMentions: { repliedUser: true } });

        }).catch((e) => { // error messages
            if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
                const player404 = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription('I could not find that player in the API. Check spelling and name history.')
                return message.reply({ embeds: [player404], allowedMentions: { repliedUser: true } }).then((sent) => {
                    setTimeout(function() {
                        message.delete();
                        sent.delete();
                    }, 5000);
                });
            } else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
                const neverLogged = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription('That player has never logged into Hypixel.')
                return message.reply({ embeds: [neverLogged], allowedMentions: { repliedUser: true } }).then((sent) => {
                    setTimeout(function() {
                        message.delete();
                        sent.delete();
                    }, 5000);
                });
            } else {
                const error = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${e}\`\`\``)
                console.error(e);
                return message.reply({ embeds: [error], allowedMentions: { repliedUser: true } }).then((sent) => {
                    setTimeout(function() {
                        message.delete();
                        sent.delete();
                    }, 5000);
                });
            }       
        });
    },
    async slashExecute(client, Discord, interaction, serverDoc){

        await interaction.deferReply({ ephemeral: false });

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "BlitzSurvivalGames Statistics",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        const data = await User.findOne({
            id: interaction.user.id
        });

        if (!data && !interaction.options.get("player")) { // if someone didn't type in ign
            const ign404 = new Discord.EmbedBuilder()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescription(`You need to type in a player's IGN! (Example: \`${serverDoc.prefix}blitzsurvivalgames ultimate_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${serverDoc.prefix}link ultimate_hecker\`)`)
            return interaction.editReply({ embeds: [ign404], allowedMentions: { repliedUser: true } }).then(() => {
                setTimeout(function() {
                    interaction.deleteReply()
                }, 5000);
            });
        }

        let player
        if (data && !interaction.options.get("player")?.value) {
             player = data.uuid;
        } else if (interaction.options.get("player")?.value) {
             player = interaction.options.get("player")?.value;
        }

        hypixel.getPlayer(player).then((player) => {

            if (!player.stats.blitzsg) {
                const neverLogged = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription('That player has never played this game')
                return interaction.editReply({ embeds: [neverLogged], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
            }

            const blitzsurvivalgames = new Discord.EmbedBuilder()
                .setAuthor(authorSuccess)
                .setTitle(`[${player.rank}] ${player.nickname}`)
                .setColor(colors["MainColor"])
                .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                .addFields([
                    { name: `General`, value: `\`•\` **Coins**: \`${commaNumber(player.stats.blitzsg.coins)}\``, required: true, inline: true },
                    { name: `Wins`, value: `\`•\` **Solo Wins**: \`${commaNumber(player.stats.blitzsg.winsSolo)}\` \n \`•\` **Team Wins**: \`${commaNumber(player.stats.blitzsg.winsTeam)}\``, required: true, inline: true },
                    { name: `Kills`, value: `\`•\` **Kills**: \`${commaNumber(player.stats.blitzsg.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.blitzsg.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.blitzsg.KDRatio)}\``, required: true, inline: true },
                ])

            // If problem occours, it is most probably line 199 & 198 along with the last 2 on line 197

            if(player.stats.blitzsg.kitStats && player.stats.blitzsg.kitStats.name != undefined) {
                blitzsurvivalgames.addFields([
                    { name: `Combat`, value: `\`•\` **Kills**: \`${commaNumber(player.stats.blitzsg.kitStats.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.blitzsg.kitStats.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.blitzsg.kitStats.KDRatio)}\``, required: true, inline: true },
                    { name: `Games`, value: `\`•\` **Wins**: \`${commaNumber(player.stats.blitzsg.kitStats.wins)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.blitzsg.kitStats.losses)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.blitzsg.kitStats.WLRatio)}\``, required: true, inline: true },
                    { name: `Kit Statistics`, value: `\`•\` **Name**: \`${commaNumber(player.stats.blitzsg.kitStats.name)}\` \n \`•\` **Level**: \`${commaNumber(player.stats.blitzsg.kitStats.level)}\` \n \`•\` **Time Played**: \`${commaNumber(player.stats.blitzsg.kitStats.timePlayed)}\` \n`, required: true, inline: true },
                    { name: `Random Statistics`, value: `\`•\` **Games Played**: \`${commaNumber(player.stats.blitzsg.kitStats.games)}\` \n \`•\` **Experience**: \`${commaNumber(player.stats.blitzsg.kitStats.prestige)}\` \n \`•\` **Experience**: \`${commaNumber(player.stats.blitzsg.kitStats.experience)}\``, required: true, inline: true}
                ]);
            }

            interaction.editReply({ embeds: [blitzsurvivalgames], allowedMentions: { repliedUser: true } });

        }).catch(e => { // error messages
            if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
                const player404 = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription('I could not find that player in the API. Check spelling and name history.')
                return interaction.editReply({ embeds: [player404], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
            } else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
                const neverLogged = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription('That player has never logged into Hypixel.')
                return interaction.editReply({ embeds: [neverLogged], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
            } else {
                const error = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${e}\`\`\``)
                return interaction.editReply({ embeds: [error], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
            }       
        });
    },
};