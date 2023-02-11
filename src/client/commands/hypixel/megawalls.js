const { hypixel, errors } = require('../../models/hypixel');
const commaNumber = require('comma-number');
const User = require('../../models/user');
const colors = require("../../tools/colors.json");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'megawalls',
    aliases: [ "mw", "mega" ],
    description: 'Shows you the Mega Walls Statistics of an average Hypixel Player!',
	options: [
		{
			name: "player",
			description: "Shows the statistics of an average Hypixel Bedwars player!",
			required: false,
			type: ApplicationCommandOptionType.String
		},
        {
			name: "mode",
			description: "Shows the statistics of an average Hypixel Megalwals player gamemode stats!",
			required: false,
			type: ApplicationCommandOptionType.String
		}
	],
    defaultPermission: true,
    usage: 'megawalls [IGN]',
    example: 'megawalls ultimate_hecker',
    async execute(client, message, args, Discord, prefix) {

        await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "MegaWalls Statistics",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

        const data = await User.findOne({
            id: message.author.id,
        });

        if (!data && !args[0]) { // if someone didn't type in ign
            const ign404 = new Discord.EmbedBuilder()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescription(`You need to type in a player's IGN! (Example: \`${prefix}megawalls ultimate_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${prefix}link ultimate_hecker\`)`)
            return message.reply({ embeds: [ign404], allowedMentions: { repliedUser: true } }).then((sent) => {
                setTimeout(function() {
                    message.delete();
                    sent.delete();
                }, 5000);
            });
        }

        let gamemode = args[1];
        let player;
        if (data && !args[0]) {
             player = data.uuid;
        } else if (args[0]) {
             player = args[0];
        }

        hypixel.getPlayer(player).then((player) => {

            if (!player.stats.megawalls) {
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

            if(!gamemode) {
                const megawalls = new Discord.EmbedBuilder()
                    .setAuthor(authorSuccess)
                    .setTitle(`[${player.rank}] ${player.nickname}`)
                    .setColor(colors["MainColor"])
                    .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                    .addFields([
                        { name: `General Stats`, value: `\`•\` **Coins**: \`${commaNumber(player.stats.megawalls.coins)}\` \n \`•\` **Class**: \`${commaNumber(player.stats.megawalls.selectedClass)}\` \n \`•\` **Played Games**: \`${commaNumber(player.stats.megawalls.playedGames)}\``, required: true, inline: true },
                        { name: `Combat`, value: `\`•\` **Kills/Assists**: \`${commaNumber(player.stats.megawalls.kills)}\` / \`${commaNumber(player.stats.megawalls.assists)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.megawalls.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.megawalls.KDRatio)}\` \n `, required: true, inline: true },
                        { name: `Games`, value: `\`•\` **Wins**: \`${commaNumber(player.stats.megawalls.wins)}\` \n \`•\` **Kills**: \`${commaNumber(player.stats.megawalls.losses)}\` \`•\` **Kills**: \`${commaNumber(player.stats.megawalls.WLRatio)}\` \n \n `, required: true, inline: true },
                        { name: `Finals`, value: `\`•\` **Kills**: \`${commaNumber(player.stats.megawalls.finalKills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.megawalls.finalDeaths)}\` \n \`•\` **Wins**: \`${commaNumber(player.stats.megawalls.finalKDRatio)}\` \n `, required: true, inline: true },
                        { name: `Random Stats`, value: `\`•\` **Defender Kills**: \`${commaNumber(player.stats.megawalls.defenderKills)}\` \n \`•\` **Wither Damage**: \`${commaNumber(player.stats.megawalls.finalAssists)}\``, required: true, inline: true },
                    ]);

                message.reply({ embeds: [megawalls], allowedMentions: { repliedUser: true } });
            } else if(gamemode === "normal" | "faceoff" | "casualBrawl") {
                const megawalls = new Discord.EmbedBuilder()
                    .setAuthor(authorSuccess)
                    .setTitle(`[${player.rank}] ${player.nickname}`)
                    .setColor(colors["MainColor"])
                    .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                    .addFields([
                        { name: `General Stats`, value: `\`•\` **Coins**: \`${commaNumber(player.stats.megawalls.coins)}\` \n \`•\` **Class**: \`${commaNumber(player.stats.megawalls.selectedClass)}\` \n \`•\` **Played Games**: \`${commaNumber(player.stats.megawalls.playedGames)}\``, required: true, inline: true },
                        { name: `Combat`, value: `\`•\` **Kills/Assists**: \`${commaNumber(player.stats.megawalls.mode[gamemode].kills)}\` / \`${commaNumber(player.stats.megawalls.mode[gamemode].assists)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.megawalls.mode[gamemode].deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.megawalls.mode[gamemode].KDRatio)}\` \n `, required: true, inline: true },
                        { name: `Games`, value: `\`•\` **Wins**: \`${commaNumber(player.stats.megawalls.mode[gamemode].wins)}\` \n \`•\` **Kills**: \`${commaNumber(player.stats.megawalls.mode[gamemode].losses)}\` \`•\` **Kills**: \`${commaNumber(player.stats.megawalls.mode[gamemode].WLRatio)}\` \n \n `, required: true, inline: true },
                        { name: `Finals`, value: `\`•\` **Kills**: \`${commaNumber(player.stats.megawalls.finalKills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.megawalls.finalDeaths)}\` \n \`•\` **Wins**: \`${commaNumber(player.stats.megawalls.finalKDRatio)}\` \n `, required: true, inline: true },
                        { name: `Random Stats`, value: `\`•\` **Defender Kills**: \`${commaNumber(player.stats.megawalls.defenderKills)}\` \n \`•\` **Wither Damage**: \`${commaNumber(player.stats.megawalls.finalAssists)}\``, required: true, inline: true },
                    ]);

                message.reply({ embeds: [megawalls], allowedMentions: { repliedUser: true } });
            } else {
                const gamemode504 = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription(`That gamemode does not exist or the argument list wasnt correctly order.`)
                message.reply({ embeds: [gamemode504], allowedMentions: { repliedUser: true } }).then((sent) => {
                    setTimeout(function() {
                        message.delete();
                        sent.delete()
                    }, 5000);
                });
            }

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
    async slashExecute(client, Discord, interaction, serverDoc) {

        await interaction.deferReply({ ephemeral: false });

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "MegaWalls Statistics",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

        const data = await User.findOne({
            id: interaction.user.id
        });

        if (!data && !interaction.options.get("player")) { // if someone didn't type in ign
            const ign404 = new Discord.EmbedBuilder()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescription(`You need to type in a player's IGN! (Example: \`${serverDoc.prefix}megawalls ultimate_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${serverDoc.prefix}link ultimate_hecker\`)`)
            return interaction.editReply({ embeds: [ign404], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					interaction.deleteReply()
				}, 5000);
			});
        }

        let gamemode = interaction.options.get("mode")?.value
        let player
        if (data && !interaction.options.get("player")?.value) {
             player = data.uuid;
        } else if (interaction.options.get("player")?.value) {
             player = interaction.options.get("player")?.value;
        }

        hypixel.getPlayer(player).then((player) => {

            if (!player.stats.megawalls) {
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

            if(!interaction.options.get("mode")?.value) {
                const megawalls = new Discord.EmbedBuilder()
                    .setAuthor(authorSuccess)
                    .setTitle(`[${player.rank}] ${player.nickname}`)
                    .setColor(colors["MainColor"])
                    .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                    .addFields([
                        { name: `General Stats`, value: `\`•\` **Coins**: \`${commaNumber(player.stats.megawalls.coins)}\` \n \`•\` **Class**: \`${commaNumber(player.stats.megawalls.selectedClass)}\` \n \`•\` **Played Games**: \`${commaNumber(player.stats.megawalls.playedGames)}\``, required: true, inline: true },
                        { name: `Combat`, value: `\`•\` **Kills/Assists**: \`${commaNumber(player.stats.megawalls.kills)}\` / \`${commaNumber(player.stats.megawalls.assists)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.megawalls.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.megawalls.KDRatio)}\` \n `, required: true, inline: true },
                        { name: `Games`, value: `\`•\` **Wins**: \`${commaNumber(player.stats.megawalls.wins)}\` \n \`•\` **Kills**: \`${commaNumber(player.stats.megawalls.losses)}\` \`•\` **Kills**: \`${commaNumber(player.stats.megawalls.WLRatio)}\` \n \n `, required: true, inline: true },
                        { name: `Finals`, value: `\`•\` **Kills**: \`${commaNumber(player.stats.megawalls.finalKills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.megawalls.finalDeaths)}\` \n \`•\` **Wins**: \`${commaNumber(player.stats.megawalls.finalKDRatio)}\` \n `, required: true, inline: true },
                        { name: `Random Stats`, value: `\`•\` **Defender Kills**: \`${commaNumber(player.stats.megawalls.defenderKills)}\` \n \`•\` **Wither Damage**: \`${commaNumber(player.stats.megawalls.finalAssists)}\``, required: true, inline: true },
                    ]);
                
                interaction.editReply({ embeds: [megawalls], allowedMentions: { repliedUser: true } });
            }else if(interaction.options.get("mode")?.value == "normal" || "faceoff" || "casualBrawl") {
                const megawalls = new Discord.EmbedBuilder()
                    .setAuthor(authorSuccess)
                    .setTitle(`[${player.rank}] ${player.nickname}`)
                    .setColor(colors["MainColor"])
                    .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                    .addFields([
                        { name: `General Stats`, value: `\`•\` **Coins**: \`${commaNumber(player.stats.megawalls.coins)}\` \n \`•\` **Class**: \`${commaNumber(player.stats.megawalls.selectedClass)}\` \n \`•\` **Played Games**: \`${commaNumber(player.stats.megawalls.playedGames)}\``, required: true, inline: true },
                        { name: `Combat`, value: `\`•\` **Kills**: \`${commaNumber(player.stats.megawalls.mode[gamemode].kills)}\` / \`${commaNumber(player.stats.megawalls.mode[gamemode].assists)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.megawalls.mode[gamemode].deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.megawalls.mode[gamemode].KDRatio)}\` \n `, required: true, inline: true },
                        { name: `Games`, value: `\`•\` **Wins**: \`${commaNumber(player.stats.megawalls.mode[gamemode].wins)}\` \n \`•\` **Losses**: \`${commaNumber(player.stats.megawalls.mode[gamemode].losses)}\` \`•\` **WLR**: \`${commaNumber(player.stats.megawalls.mode[gamemode].WLRatio)}\` \n \n `, required: true, inline: true },
                        { name: `Finals`, value: `\`•\` **Kills**: \`${commaNumber(player.stats.megawalls.finalKills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.megawalls.finalDeaths)}\` \n \`•\` **Wins**: \`${commaNumber(player.stats.megawalls.finalKDRatio)}\` \n `, required: true, inline: true },
                        { name: `Random Stats`, value: `\`•\` **Defender Kills**: \`${commaNumber(player.stats.megawalls.defenderKills)}\` \n \`•\` **Wither Damage**: \`${commaNumber(player.stats.megawalls.finalAssists)}\``, required: true, inline: true },
                    ]);

                interaction.editReply({ embeds: [megawalls], allowedMentions: { repliedUser: true } });
            }else {
                const gamemode504 = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription(`That gamemode does not exist or the argument list wasnt correctly order.`)
                interaction.editReply({ embeds: [gamemode504], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        message.delete()
                    }, 5000);
                });
            }

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
    }
};