const { hypixel, errors } = require('../../schemas/hypixel');
const commaNumber = require('comma-number');
const User = require('../../schemas/user');
const colors = require("../../tools/colors.json");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'uhc',
    aliases: [],
    description: 'Shows you the UHC Statistics of an average Hypixel Player!',
    options: [
		{
			name: "player",
			description: "Shows the statistics of an average Hypixel Bedwars player!",
			required: false,
			type: ApplicationCommandOptionType.String
		},
        {
			name: "gamemode",
			description: "Shows the statistics of an average Hypixel Bedwars player!",
			required: false,
			type: ApplicationCommandOptionType.String
		}
	],
    defaultPermission: true,
    usage: 'uhc [IGN]',
    example: 'uhc ultimate_hecker',
    async execute(client, message, args, Discord, prefix) {

        await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "UHC Statistics",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

        const data = await User.findOne({
            id: message.author.id,
        });

        if (!data && !args[0]) { // if someone didn't type in ign
            const ign404 = new Discord.EmbedBuilder()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescription(`You need to type in a player's IGN! (Example: \`${prefix}uhc ultimate_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${prefix}link ultimate_hecker\`)`)
            return message.reply({ embeds: [ign404], allowedMentions: { repliedUser: true } }).then((sent) => {
                setTimeout(function() {
                    sent.delete();
                }, 5000);
            });
        }

        let player;

        if (data && !args[0]) {
             player = data.uuid;
        } else if (args[0]) {
             player = args[0];
        }

        hypixel.getPlayer(player).then((player) => {

            if (!player.stats.uhc) {
                const neverPlayed = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription("That player has never played this game")
                return message.reply({ embeds: [neverPlayed], allowedMentions: { repliedUser: true } }).then((sent) => {
					setTimeout(function() {
						sent.delete();
					}, 5000);
				});
            }

            if(!gamemode) {
                const uhc = new Discord.EmbedBuilder()
                    .setAuthor(authorSuccess)
                    .setTitle(`[${player.rank}] ${player.nickname}`)
                    .setColor(colors["MainColor"])
                    .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                    .addFields([
                        { name: "General Stats", value: `\`•\` **Coins**: \`${commaNumber(player.stats.uhc.coins)}\` \n \`•\` **Stars**: \`${commaNumber(player.stats.uhc.starLevel)}\` \n \`•\` **Score**: \`${commaNumber(player.stats.uhc.score)}\``, required: true, inline: true },
                        { name: "Combat", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.KDRatio)}\``, required: true, inline: true },
                        { name: "Brawl", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.brawl.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.brawl.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.brawl.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.brawl.headsEaten)}\``, required: true, inline: true },
                        { name: "Solo Brawl", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.brawlSolo.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.brawlSolo.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.brawlSolo.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.brawlSolo.headsEaten)}\``, required: true, inline: true },
                        { name: "Double Brawl", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.brawlDuo.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.brawlDuo.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.brawlDuo.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.brawlDuo.headsEaten)}\``, required: true, inline: true },
                        { name: "Red vs. Blue", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.redVsBlue.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.redVsBlue.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.redVsBlue.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.redVsBlue.headsEaten)}\``, required: true, inline: true },
                        { name: "Solo", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.solo.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.solo.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.solo.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.solo.headsEaten)}\``, required: true, inline: true },
                        { name: "Team", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.team.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.team.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.team.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.team.headsEaten)}\``, required: true, inline: true },
                        { name: "No Diamond", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.noDiamond.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.noDiamond.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.noDiamond.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.noDiamond.headsEaten)}\``, required: true, inline: true },
                    ]);

                message.reply({ embeds: [uhc], allowedMentions: { repliedUser: true } });
            }else if(gamemode) {
                const uhcGamemode = new Discord.EmbedBuilder()
                    .setAuthor(authorSuccess)
                    .setTitle(`[${player.rank}] ${player.nickname}`)
                    .setColor(colors["MainColor"])
                    .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                    .addFields([
                        { name: "General Stats", value: `\`•\` **Coins**: \`${commaNumber(player.stats.uhc.coins)}\` \n \`•\` **Stars**: \`${commaNumber(player.stats.uhc.starLevel)}\` \n \`•\` **Score**: \`${commaNumber(player.stats.uhc.score)}\``, required: true, inline: true },
                        { name: "Combat", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.KDRatio)}\``, required: true, inline: true },
                    ]);

                message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });

                if(gamemode = "Brawl"){
                    uhcGamemode.addFields([
                        { name: "Brawl", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.brawl.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.brawl.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.brawl.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.brawl.headsEaten)}\``, required: true, inline: true },
                    ]);
                } else if(gamemode = "Solo Brawl"){
                    uhcGamemode.addFields([
                        { name: "Solo Brawl", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.brawlSolo.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.brawlSolo.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.brawlSolo.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.brawlSolo.headsEaten)}\``, required: true, inline: true },
                    ]);
                } else if(gamemode = "Double Brawl"){
                    uhcGamemode.addFields([
                        { name: "Double Brawl", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.brawlDuo.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.brawlDuo.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.brawlDuo.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.brawlDuo.headsEaten)}\``, required: true, inline: true },
                    ]);
                } else if(gamemode = "Red vs. Blue"){
                    uhcGamemode.addFields([
                        { name: "Red vs. Blue", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.redVsBlue.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.redVsBlue.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.redVsBlue.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.redVsBlue.headsEaten)}\``, required: true, inline: true },
                    ]);
                } else if(gamemode = "Solo"){
                    uhcGamemode.addFields([
                        { name: "Solo", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.solo.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.solo.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.solo.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.solo.headsEaten)}\``, required: true, inline: true },
                    ]);
                } else if(gamemode = "Team"){
                    uhcGamemode.addFields([
                        { name: "Team", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.team.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.team.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.team.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.team.headsEaten)}\``, required: true, inline: true },
                    ]);
                } else if(gamemode = "No Diamond"){
                    uhcGamemode.addFields([
                        { name: "No Diamond", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.noDiamond.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.noDiamond.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.noDiamond.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.noDiamond.headsEaten)}\``, required: true, inline: true },
                    ]);
                } else {
                    const gamemode504 = new Discord.EmbedBuilder()
                        .setAuthor(authorError)
                        .setColor(colors["ErrorColor"])
                        .setDescription(`That gamemode does not exist or one of the arguments is wrong. If you need assistance, please run\`${prefix}help uhc\``)
                message.reply({ embeds: [gamemode504], allowedMentions: { repliedUser: true } }).then((sent) => {
                    setTimeout(function() {
                        message.delete()
                    }, 5000);
                });
                }
            }

        }).catch((e) => { // error messages
            if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
                const player404 = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription('I could not find that player in the API. Check spelling and name history.')
                return message.reply({ embeds: [player404], allowedMentions: { repliedUser: true } }).then((sent) => {
					setTimeout(function() {
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
            name: "UHC Statistics",
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

        let gamemode = interaction.options.get("gamemode")?.value
        let player
        if (data && !interaction.options.get("player")?.value) {
             player = data.uuid;
        } else if (interaction.options.get("player")?.value) {
             player = interaction.options.get("player")?.value;
        }

        hypixel.getPlayer(player).then((player) => {

            if (!player.stats.uhc) {
                const neverPlayed = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription("That player has never played this game, or you haven't played all of the modes")
                return interaction.editReply({ embeds: [neverPlayed] }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
            }

            if(!gamemode) {
                const uhc = new Discord.EmbedBuilder()
                    .setAuthor(authorSuccess)
                    .setTitle(`[${player.rank}] ${player.nickname}`)
                    .setColor(colors["MainColor"])
                    .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                    .addFields([
                        { name: "General Stats", value: `\`•\` **Coins**: \`${commaNumber(player.stats.uhc.coins)}\` \n \`•\` **Stars**: \`${commaNumber(player.stats.uhc.starLevel)}\` \n \`•\` **Score**: \`${commaNumber(player.stats.uhc.score)}\``, required: true, inline: true },
                        { name: "Combat", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.KDRatio)}\``, required: true, inline: true },
                        { name: "Brawl", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.brawl.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.brawl.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.brawl.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.brawl.headsEaten)}\``, required: true, inline: true },
                        { name: "Solo Brawl", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.brawlSolo.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.brawlSolo.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.brawlSolo.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.brawlSolo.headsEaten)}\``, required: true, inline: true },
                        { name: "Double Brawl", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.brawlDuo.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.brawlDuo.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.brawlDuo.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.brawlDuo.headsEaten)}\``, required: true, inline: true },
                        { name: "Red vs. Blue", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.redVsBlue.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.redVsBlue.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.redVsBlue.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.redVsBlue.headsEaten)}\``, required: true, inline: true },
                        { name: "Solo", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.solo.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.solo.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.solo.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.solo.headsEaten)}\``, required: true, inline: true },
                        { name: "Team", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.team.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.team.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.team.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.team.headsEaten)}\``, required: true, inline: true },
                        { name: "No Diamond", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.noDiamond.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.noDiamond.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.noDiamond.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.noDiamond.headsEaten)}\``, required: true, inline: true },
                    ]);

                interaction.editReply({ embeds: [uhc], allowedMentions: { repliedUser: true } });
            } else {
                const uhcGamemode = new Discord.EmbedBuilder()
                .setAuthor(authorSuccess)
                .setTitle(`[${player.rank}] ${player.nickname}`)
                .setColor(colors["MainColor"])
                .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                .addFields([
                    { name: "General Stats", value: `\`•\` **Coins**: \`${commaNumber(player.stats.uhc.coins)}\` \n \`•\` **Stars**: \`${commaNumber(player.stats.uhc.starLevel)}\` \n \`•\` **Score**: \`${commaNumber(player.stats.uhc.score)}\``, required: true, inline: true },
                    { name: "Combat", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.KDRatio)}\``, required: true, inline: true },
                ]);

                if(gamemode = "Brawl"){
                    uhcGamemode.addFields([
                        { name: "Brawl", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.brawl.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.brawl.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.brawl.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.brawl.headsEaten)}\``, required: true, inline: true },
                    ]);

                    interaction.editReply({ embeds: [uhcGamemode], allowedMentions: { repliedUser: true } });

                } else if(gamemode = "Solo Brawl"){
                    uhcGamemode.addFields([
                        { name: "Solo Brawl", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.brawlSolo.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.brawlSolo.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.brawlSolo.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.brawlSolo.headsEaten)}\``, required: true, inline: true },
                    ]);

                    interaction.editReply({ embeds: [uhcGamemode], allowedMentions: { repliedUser: true } });

                } else if(gamemode = "Double Brawl"){
                    uhcGamemode.addFields([
                        { name: "Double Brawl", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.brawlDuo.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.brawlDuo.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.brawlDuo.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.brawlDuo.headsEaten)}\``, required: true, inline: true },
                    ]);

                    interaction.editReply({ embeds: [uhcGamemode], allowedMentions: { repliedUser: true } });

                } else if(gamemode = "Red vs. Blue"){
                    uhcGamemode.addFields([
                        { name: "Red vs. Blue", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.redVsBlue.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.redVsBlue.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.redVsBlue.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.redVsBlue.headsEaten)}\``, required: true, inline: true },
                    ]);

                    interaction.editReply({ embeds: [uhcGamemode], allowedMentions: { repliedUser: true } });

                } else if(gamemode = "Solo"){
                    uhcGamemode.addFields([
                        { name: "Solo", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.solo.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.solo.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.solo.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.solo.headsEaten)}\``, required: true, inline: true },
                    ]);

                    interaction.editReply({ embeds: [uhcGamemode], allowedMentions: { repliedUser: true } });

                } else if(gamemode = "Team"){
                    uhcGamemode.addFields([
                        { name: "Team", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.team.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.team.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.team.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.team.headsEaten)}\``, required: true, inline: true },
                    ]);

                    interaction.editReply({ embeds: [uhcGamemode], allowedMentions: { repliedUser: true } });

                } else if(gamemode = "No Diamond"){
                    uhcGamemode.addFields([
                        { name: "No Diamond", value: `\`•\` **Kills**: \`${commaNumber(player.stats.uhc.noDiamond.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.uhc.noDiamond.deaths)}\` \n \`•\` **KDR**: \`${commaNumber(player.stats.uhc.noDiamond.KDRatio)}\` \n \`•\` **Heads Eatan**: \`${commaNumber(player.stats.uhc.noDiamond.headsEaten)}\``, required: true, inline: true },
                    ]);

                    interaction.editReply({ embeds: [uhcGamemode], allowedMentions: { repliedUser: true } });
                } else {
                    const gamemode504 = new Discord.EmbedBuilder()
                        .setAuthor(authorError)
                        .setColor(colors["ErrorColor"])
                        .setDescription(`That gamemode does not exist or one of the arguments is wrong. If you need assistance, please run\`${prefix}help uhc\``)
                    interaction.editReply({ embeds: [gamemode504], allowedMentions: { repliedUser: true } }).then(() => {
                        setTimeout(function() {
                            interaction.deleteReply()
                        }, 5000);
                    });
                }
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
                        console.log(e)
                    }, 5000);
                });
            }       
        });
    }
};