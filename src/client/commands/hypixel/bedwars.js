const { hypixel, errors } = require('../../database/models/hypixel');
const commaNumber = require('comma-number');
const User = require('../../database/schemas/user');
const colors = require("../../tools/colors.json");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'bedwars',
    aliases: ["bw"],
    description: 'Shows you the different gamemodes and overall statistics of a Hypixel Bedwars player!',
	options: [
		{
			name: "player",
			description: "Shows the statistics of an average Hypixel Bedwars player!",
			required: false,
			type: ApplicationCommandOptionType.String
		},
        {
			name: "dream",
			description: "Shows the statistics of an average Hypixel Bedwars player of a certain dream gamemode!",
			required: false,
			type: ApplicationCommandOptionType.String
		},
        {
			name: "mode",
			description: "Shows the statistics of an average Hypixel Bedwars player of a certain mode!",
			required: false,
			type: ApplicationCommandOptionType.String
		},
	],
    defaultPermission: true,
    usage: 'bedwars [gamemode] [type] [IGN]',
    example: 'bedwars, bedwars overall ultimate_hecker, bedwars ultimate_hecker',
    notes: 'When you want to search up your Dream Statistics in Bedwars, the gamemode must be set to dream, and the tyoe must be what the dream gamemode is, anything else will return an error!',
    async execute(client, message, args, Discord, prefix) {

        await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Bedwars Statistics",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

        const data = await User.findOne({
            id: message.author.id,
        });

        if (!args[1] && !data) { // if someone didn't type in ign and wasn't verified
            const ign404 = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`You need to type in a player's IGN! (Example: \`${prefix}bedwars ultimate_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${prefix}link ultimate_hecker\`)`);
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

            if (!player.stats.bedwars) {
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
                const bedwars = new Discord.EmbedBuilder()
                    .setAuthor(authorSuccess)
                    .setTitle(`[${player.rank}] ${player.nickname}`)
                    .setColor(colors["MainColor"])
                    .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                    .addFields([
                        { name: "General Stats", value: `\`•\` **Levels**: \`${player.stats.bedwars.level}✫\` \n \`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\` \n \`•\` **Loot Chest**: \`${commaNumber((player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.golden + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween))}\``, required: true, inline: true },
                        { name: "Games", value: `\`•\` **Winstreak**: \`${commaNumber(player.stats.bedwars.winstreak)}\` \n \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.wins)}\` \n \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.losses)}\` \n \`•\` **WLR**: \`${player.stats.bedwars.WLRatio}\``, required: true, inline: true },
                        { name: "Combat", value: `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.deaths)}\` \n \`•\` **KDR**: \`${player.stats.bedwars.KDRatio}\``, required: true, inline: true },
                        { name: "Finals", value: `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.finalKills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.finalDeaths)}\` \n \`•\` **FKDR**: \`${player.stats.bedwars.finalKDRatio}\``, required: true, inline: true },
                        { name: "Beds", value: `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.beds.broken)}\` \n \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.beds.lost)}\` \n \`•\` **BBLR**: \`${player.stats.bedwars.beds.BLRatio}\``, required: true, inline: true },
                        { name: "Averages per Game", value: `\`•\` **Kills**: \`${commaNumber((player.stats.bedwars.kills / player.stats.bedwars.playedGames).toFixed(2))}\` \n \`•\` **Final Kills**: \`${commaNumber((player.stats.bedwars.finalKills / player.stats.bedwars.playedGames).toFixed(2))}\` \n \`•\` **Beds**: \`${commaNumber((player.stats.bedwars.beds.broken / player.stats.bedwars.playedGames).toFixed(2))}\``, required: true, inline: true },
                        { name: "Milestones", value: `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.WLRatio))} WLR**: \`${commaNumber(player.stats.bedwars.losses * Math.ceil(player.stats.bedwars.WLRatio) - player.stats.bedwars.wins)}\` \n \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.finalKDRatio))} FKDR**: \`${commaNumber(player.stats.bedwars.finalDeaths * Math.ceil(player.stats.bedwars.finalKDRatio) - player.stats.bedwars.finalKills)}\` \n \`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.beds.BLRatio))} BBLR**: \`${commaNumber(player.stats.bedwars.beds.lost * Math.ceil(player.stats.bedwars.beds.BLRatio) - player.stats.bedwars.beds.broken)}\``, required: true, inline: true },
                    ])

                message.reply({ embeds: [bedwars], allowedMentions: { repliedUser: true } });

            } else if(gamemode == "4v4" || "castle" || "doubles" || "fours" || "threes" || "solo") {

                let str = gamemode.slice(1);
		        let uppercase = gamemode[0].toUpperCase();
		        let uppercased = uppercase + str;

                authorSuccess.name = `${uppercased} Bedwars Statistics`;
                
                const bedwarsGamemode = new Discord.EmbedBuilder()
                    .setAuthor(authorSuccess)
                    .setTitle(`[${player.rank}] ${player.nickname}`)
                    .setColor(colors["MainColor"])
                    .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                    .addFields([
                        { name: "General Stats", value: `\`•\` **Levels**: \`${player.stats.bedwars.level}✫\` \n \`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\` \n \`•\` **Loot Chest**: \`${commaNumber((player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.golden + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween))}\``, required: true, inline: true },
                        { name: "Games", value: `\`•\` **Winstreak**: \`${commaNumber(player.stats.bedwars[gamemode].winstreak)}\` \n \`•\` **Wins**: \`${commaNumber(player.stats.bedwars[gamemode].wins)}\` \n \`•\` **Losses**: \`${commaNumber(player.stats.bedwars[gamemode].losses)}\` \n \`•\` **WLR**: \`${player.stats.bedwars[gamemode].WLRatio}\``, required: true, inline: true },
                        { name: "Combat", value: `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars[gamemode].kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars[gamemode].deaths)}\` \n \`•\` **KDR**: \`${player.stats.bedwars[gamemode].KDRatio}\``, required: true, inline: true },
                        { name: "Finals", value: `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars[gamemode].finalKills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars[gamemode].finalDeaths)}\` \n \`•\` **FKDR**: \`${player.stats.bedwars[gamemode].finalKDRatio}\``, required: true, inline: true },
                        { name: "Beds", value: `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars[gamemode].beds.broken)}\` \n \`•\` **Lost**: \`${commaNumber(player.stats.bedwars[gamemode].beds.lost)}\` \n \`•\` **BBLR**: \`${player.stats.bedwars[gamemode].beds.BLRatio}\``, required: true, inline: true },
                        { name: "Averages per Game", value: `\`•\` **Kills**: \`${commaNumber((player.stats.bedwars[gamemode].kills / player.stats.bedwars[gamemode].playedGames).toFixed(2))}\` \n \`•\` **Final Kills**: \`${commaNumber((player.stats.bedwars[gamemode].finalKills / player.stats.bedwars[gamemode].playedGames).toFixed(2))}\` \n \`•\` **Beds**: \`${commaNumber((player.stats.bedwars[gamemode].beds.broken / player.stats.bedwars[gamemode].playedGames).toFixed(2))}\``, required: true, inline: true },
                        { name: "Milestones", value: `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars[gamemode].WLRatio))} WLR**: \`${commaNumber(player.stats.bedwars[gamemode].losses * Math.ceil(player.stats.bedwars[gamemode].WLRatio) - player.stats.bedwars[gamemode].wins)}\` \n \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars[gamemode].finalKDRatio))} FKDR**: \`${commaNumber(player.stats.bedwars[gamemode].finalDeaths * Math.ceil(player.stats.bedwars[gamemode].finalKDRatio) - player.stats.bedwars[gamemode].finalKills)}\` \n \`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars[gamemode].beds.BLRatio))} BBLR**: \`${commaNumber(player.stats.bedwars[gamemode].beds.lost * Math.ceil(player.stats.bedwars[gamemode].beds.BLRatio) - player.stats.bedwars[gamemode].beds.broken)}\``, required: true, inline: true },
                    ])

                message.reply({ embeds: [bedwarsGamemode], allowedMentions: { repliedUser: true } });
                
            } else if(dream === "ultimate" || "rush" || "armed" || "lucky" | "voidless" && gamemode === "doubles" || "fours") {

                let str = dream.slice(1);
		        let uppercase = dream[0].toUpperCase();
		        let uppercased = uppercase + str;

                authorSuccess.name = `${uppercased} Bedwars Statistics`;

                const bedwarsDream = new Discord.EmbedBuilder()
                    .setAuthor(authorSuccess)
                    .setTitle(`[${player.rank}] ${player.nickname}`)
                    .setColor(colors["MainColor"])
                    .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                    .addFields([
                        { name: "General Stats", value: `\`•\` **Levels**: \`${player.stats.bedwars.level}✫\` \n \`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\` \n \`•\` **Loot Chest**: \`${commaNumber((player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.golden + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween))}\``, required: true, inline: true },
                        { name: "Games", value: `\`•\` **Winstreak**: \`${commaNumber(player.stats.bedwars.dream[dream][gamemode].winstreak)}\` \n \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.dream[dream][gamemode].wins)}\` \n \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.dream[dream][gamemode].losses)}\` \n \`•\` **WLR**: \`${player.stats.bedwars.dream[dream][gamemode].WLRatio}\``, required: true, inline: true },
                        { name: "Combat", value: `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream[dream][gamemode].kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.dream[dream][gamemode].deaths)}\` \n \`•\` **KDR**: \`${player.stats.bedwars.dream[dream][gamemode].KDRatio}\``, required: true, inline: true },
                        { name: "Finals", value: `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream[dream][gamemode].finalKills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.dream[dream][gamemode].finalDeaths)}\` \n \`•\` **FKDR**: \`${player.stats.bedwars.dream[dream][gamemode].finalKDRatio}\``, required: true, inline: true },
                        { name: "Beds", value: `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.dream[dream][gamemode].beds.broken)}\` \n \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream[dream][gamemode].beds.lost)}\` \n \`•\` **BBLR**: \`${player.stats.bedwars.dream[dream][gamemode].beds.BLRatio}\``, required: true, inline: true },
                        { name: "Averages per Game", value: `\`•\` **Kills**: \`${commaNumber((player.stats.bedwars.dream[dream][gamemode].kills / player.stats.bedwars.dream[dream][gamemode].playedGames).toFixed(2))}\` \n \`•\` **Final Kills**: \`${commaNumber((player.stats.bedwars.dream[dream][gamemode].finalKills / player.stats.bedwars.dream[dream][gamemode].playedGames).toFixed(2))}\` \n \`•\` **Beds**: \`${commaNumber((player.stats.bedwars.dream[dream][gamemode].beds.broken / player.stats.bedwars.dream[dream][gamemode].playedGames).toFixed(2))}\``, required: true, inline: true },
                        { name: "Milestones", value: `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.dream[dream][gamemode].WLRatio))} WLR**: \`${commaNumber(player.stats.bedwars.dream[dream][gamemode].losses * Math.ceil(player.stats.bedwars.dream[dream][gamemode].WLRatio) - player.stats.bedwars.dream[dream][gamemode].wins)}\` \n \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream[dream][gamemode].finalKDRatio))} FKDR**: \`${commaNumber(player.stats.bedwars.dream[dream][gamemode].finalDeaths * Math.ceil(player.stats.bedwars.dream[dream][gamemode].finalKDRatio) - player.stats.bedwars.dream[dream][gamemode].finalKills)}\` \n \`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.dream[dream][gamemode].beds.BLRatio))} BBLR**: \`${commaNumber(player.stats.bedwars.dream[dream][gamemode].beds.lost * Math.ceil(player.stats.bedwars.dream[dream][gamemode].beds.BLRatio) - player.stats.bedwars.dream[dream][gamemode].beds.broken)}\``, required: true, inline: true },
                    ])

                message.reply({ embeds: [bedwarsDream], allowedMentions: { repliedUser: true } });
            }else {
                const gamemode504 = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription(`That gamemode does not exist or one of the arguments is wrong. If you need assistance, please run\`${prefix}help bedwars\``)
                message.reply({ embeds: [gamemode504], allowedMentions: { repliedUser: true } }).then((sent) => {
                    setTimeout(function() {
                        message.delete();
                        sent.delete();
                    }, 5000);
                });
            }
        }).catch((e) => { // error messages
            if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
				const player404 = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("I could not find that player in the API. Check spelling and name history.")
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
					.setDescription("That player has never logged into Hypixel.")
				return message.reply({embeds: [neverLogged], allowedMentions: { repliedUser: true } }).then((sent) => {
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
            name: "Bedwars Statistics",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

        let gamemode = interaction.options.get("mode")?.value;
        let dream = interaction.options.get("dream")?.value;


		const data = await User.findOne({
			id: interaction.user.id,
		});

		if (!interaction.options.get("player") && !data) {
			const ign404 = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`You need to type in a player's IGN! (Example: \`${serverDoc.prefix}bedwars ultimate_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${serverDoc.prefix}link ultimate_hecker\`)`)
			return interaction.editReply({ embeds: [ign404], allowedMentions: { repliedUser: true } }).then(() => {
                setTimeout(function() {
                    interaction.deleteReply()
                }, 5000);
            });
		}

		let player;
		if (data && !interaction.options.get("player")?.value) {
			player = data.uuid;
		} else if (interaction.options.get("player")?.value) {
			player = interaction.options.get("player")?.value;
		}

		hypixel.getPlayer(player).then((player) => {

            if (!player.stats.bedwars) {
                const neverPlayed = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription('That player has never played this game')
                interaction.editReply({ embeds: [neverPlayed], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
            }

            if(!interaction.options.get("mode")) {
                const bedwars = new Discord.EmbedBuilder()
                    .setAuthor(authorSuccess)
                    .setTitle(`[${player.rank}] ${player.nickname}`)
                    .setColor(colors["MainColor"])
                    .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                    .addFields([
                        { name: "General Stats", value: `\`•\` **Levels**: \`${player.stats.bedwars.level}✫\` \n \`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\` \n \`•\` **Loot Chest**: \`${commaNumber((player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.golden + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween))}\``, required: true, inline: true },
                        { name: "Games", value: `\`•\` **Winstreak**: \`${commaNumber(player.stats.bedwars.winstreak)}\` \n \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.wins)}\` \n \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.losses)}\` \n \`•\` **WLR**: \`${player.stats.bedwars.WLRatio}\``, required: true, inline: true },
                        { name: "Combat", value: `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.deaths)}\` \n \`•\` **KDR**: \`${player.stats.bedwars.KDRatio}\``, required: true, inline: true },
                        { name: "Finals", value: `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.finalKills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.finalDeaths)}\` \n \`•\` **FKDR**: \`${player.stats.bedwars.finalKDRatio}\``, required: true, inline: true },
                        { name: "Beds", value: `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.beds.broken)}\` \n \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.beds.lost)}\` \n \`•\` **BBLR**: \`${player.stats.bedwars.beds.BLRatio}\``, required: true, inline: true },
                        { name: "Averages per Game", value: `\`•\` **Kills**: \`${commaNumber((player.stats.bedwars.kills / player.stats.bedwars.playedGames).toFixed(2))}\` \n \`•\` **Final Kills**: \`${commaNumber((player.stats.bedwars.finalKills / player.stats.bedwars.playedGames).toFixed(2))}\` \n \`•\` **Beds**: \`${commaNumber((player.stats.bedwars.beds.broken / player.stats.bedwars.playedGames).toFixed(2))}\``, required: true, inline: true },
                        { name: "Milestones", value: `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.WLRatio))} WLR**: \`${commaNumber(player.stats.bedwars.losses * Math.ceil(player.stats.bedwars.WLRatio) - player.stats.bedwars.wins)}\` \n \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.finalKDRatio))} FKDR**: \`${commaNumber(player.stats.bedwars.finalDeaths * Math.ceil(player.stats.bedwars.finalKDRatio) - player.stats.bedwars.finalKills)}\` \n \`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.beds.BLRatio))} BBLR**: \`${commaNumber(player.stats.bedwars.beds.lost * Math.ceil(player.stats.bedwars.beds.BLRatio) - player.stats.bedwars.beds.broken)}\``, required: true, inline: true },
                    ])

                interaction.editReply({ embeds: [bedwars], allowedMentions: { repliedUser: true } });

            } else if(interaction.options.get("dream")?.value && interaction.options.get("mode")?.value) {

                let str = dream.slice(1);
		        let uppercase = dream[0].toUpperCase();
		        let uppercased = uppercase + str;

                authorSuccess.name = `${uppercased} Bedwars Statistics`;

                const bedwarsDream = new Discord.EmbedBuilder()
                    .setAuthor(authorSuccess)
                    .setTitle(`[${player.rank}] ${player.nickname}`)
                    .setColor(colors["MainColor"])
                    .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                    .addFields([
                        { name: "General Stats", value: `\`•\` **Levels**: \`${player.stats.bedwars.level}✫\` \n \`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\` \n \`•\` **Loot Chest**: \`${commaNumber((player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.golden + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween))}\``, required: true, inline: true },
                        { name: "Games", value: `\`•\` **Winstreak**: \`${commaNumber(player.stats.bedwars.dream[dream][gamemode].winstreak)}\` \n \`•\` **Wins**: \`${commaNumber(player.stats.bedwars.dream[dream][gamemode].wins)}\` \n \`•\` **Losses**: \`${commaNumber(player.stats.bedwars.dream[dream][gamemode].losses)}\` \n \`•\` **WLR**: \`${player.stats.bedwars.dream[dream][gamemode].WLRatio}\``, required: true, inline: true },
                        { name: "Combat", value: `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream[dream][gamemode].kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.dream[dream][gamemode].deaths)}\` \n \`•\` **KDR**: \`${player.stats.bedwars.dream[dream][gamemode].KDRatio}\``, required: true, inline: true },
                        { name: "Finals", value: `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars.dream[dream][gamemode].finalKills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars.dream[dream][gamemode].finalDeaths)}\` \n \`•\` **FKDR**: \`${player.stats.bedwars.dream[dream][gamemode].finalKDRatio}\``, required: true, inline: true },
                        { name: "Beds", value: `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars.dream[dream][gamemode].beds.broken)}\` \n \`•\` **Lost**: \`${commaNumber(player.stats.bedwars.dream[dream][gamemode].beds.lost)}\` \n \`•\` **BBLR**: \`${player.stats.bedwars.dream[dream][gamemode].beds.BLRatio}\``, required: true, inline: true },
                        { name: "Averages per Game", value: `\`•\` **Kills**: \`${commaNumber((player.stats.bedwars.dream[dream][gamemode].kills / player.stats.bedwars.dream[dream][gamemode].playedGames).toFixed(2))}\` \n \`•\` **Final Kills**: \`${commaNumber((player.stats.bedwars.dream[dream][gamemode].finalKills / player.stats.bedwars.dream[dream][gamemode].playedGames).toFixed(2))}\` \n \`•\` **Beds**: \`${commaNumber((player.stats.bedwars.dream[dream][gamemode].beds.broken / player.stats.bedwars.dream[dream][gamemode].playedGames).toFixed(2))}\``, required: true, inline: true },
                        { name: "Milestones", value: `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars.dream[dream][gamemode].WLRatio))} WLR**: \`${commaNumber(player.stats.bedwars.dream[dream][gamemode].losses * Math.ceil(player.stats.bedwars.dream[dream][gamemode].WLRatio) - player.stats.bedwars.dream[dream][gamemode].wins)}\` \n \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars.dream[dream][gamemode].finalKDRatio))} FKDR**: \`${commaNumber(player.stats.bedwars.dream[dream][gamemode].finalDeaths * Math.ceil(player.stats.bedwars.dream[dream][gamemode].finalKDRatio) - player.stats.bedwars.dream[dream][gamemode].finalKills)}\` \n \`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars.dream[dream][gamemode].beds.BLRatio))} BBLR**: \`${commaNumber(player.stats.bedwars.dream[dream][gamemode].beds.lost * Math.ceil(player.stats.bedwars.dream[dream][gamemode].beds.BLRatio) - player.stats.bedwars.dream[dream][gamemode].beds.broken)}\``, required: true, inline: true },
                    ]);

                interaction.editReply({ embeds: [bedwarsDream], allowedMentions: { repliedUser: true } });
            }else if(interaction.options.get("mode")?.value) {

                let str = gamemode.slice(1);
		        let uppercase = gamemode[0].toUpperCase();
		        let uppercased = uppercase + str;

                authorSuccess.name = `${uppercased} Bedwars Statistics`;

                const bedwarsGamemode = new Discord.EmbedBuilder()
                    .setAuthor(authorSuccess)
                    .setTitle(`[${player.rank}] ${player.nickname}`)
                    .setColor(colors["MainColor"])
                    .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                    .addFields([
                        { name: "General Stats", value: `\`•\` **Levels**: \`${player.stats.bedwars.level}✫\` \n \`•\` **Coins**: \`${commaNumber(player.stats.bedwars.coins)}\` \n \`•\` **Loot Chest**: \`${commaNumber((player.stats.bedwars.lootChests.normal + player.stats.bedwars.lootChests.golden + player.stats.bedwars.lootChests.christmas + player.stats.bedwars.lootChests.easter + player.stats.bedwars.lootChests.halloween))}\``, required: true, inline: true },
                        { name: "Games", value: `\`•\` **Winstreak**: \`${commaNumber(player.stats.bedwars[gamemode].winstreak)}\` \n \`•\` **Wins**: \`${commaNumber(player.stats.bedwars[gamemode].wins)}\` \n \`•\` **Losses**: \`${commaNumber(player.stats.bedwars[gamemode].losses)}\` \n \`•\` **WLR**: \`${player.stats.bedwars[gamemode].WLRatio}\``, required: true, inline: true },
                        { name: "Combat", value: `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars[gamemode].kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars[gamemode].deaths)}\` \n \`•\` **KDR**: \`${player.stats.bedwars[gamemode].KDRatio}\``, required: true, inline: true },
                        { name: "Finals", value: `\`•\` **Kills**: \`${commaNumber(player.stats.bedwars[gamemode].finalKills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.bedwars[gamemode].finalDeaths)}\` \n \`•\` **FKDR**: \`${player.stats.bedwars[gamemode].finalKDRatio}\``, required: true, inline: true },
                        { name: "Beds", value: `\`•\` **Broken**: \`${commaNumber(player.stats.bedwars[gamemode].beds.broken)}\` \n \`•\` **Lost**: \`${commaNumber(player.stats.bedwars[gamemode].beds.lost)}\` \n \`•\` **BBLR**: \`${player.stats.bedwars[gamemode].beds.BLRatio}\``, required: true, inline: true },
                        { name: "Averages per Game", value: `\`•\` **Kills**: \`${commaNumber((player.stats.bedwars[gamemode].kills / player.stats.bedwars[gamemode].playedGames).toFixed(2))}\` \n \`•\` **Final Kills**: \`${commaNumber((player.stats.bedwars[gamemode].finalKills / player.stats.bedwars[gamemode].playedGames).toFixed(2))}\` \n \`•\` **Beds**: \`${commaNumber((player.stats.bedwars[gamemode].beds.broken / player.stats.bedwars[gamemode].playedGames).toFixed(2))}\``, required: true, inline: true },
                        { name: "Milestones", value: `\`•\` **Wins to ${commaNumber(Math.ceil(player.stats.bedwars[gamemode].WLRatio))} WLR**: \`${commaNumber(player.stats.bedwars[gamemode].losses * Math.ceil(player.stats.bedwars[gamemode].WLRatio) - player.stats.bedwars[gamemode].wins)}\` \n \`•\` **Finals to ${commaNumber(Math.ceil(player.stats.bedwars[gamemode].finalKDRatio))} FKDR**: \`${commaNumber(player.stats.bedwars[gamemode].finalDeaths * Math.ceil(player.stats.bedwars[gamemode].finalKDRatio) - player.stats.bedwars[gamemode].finalKills)}\` \n \`•\` **Beds to ${commaNumber(Math.ceil(player.stats.bedwars[gamemode].beds.BLRatio))} BBLR**: \`${commaNumber(player.stats.bedwars[gamemode].beds.lost * Math.ceil(player.stats.bedwars[gamemode].beds.BLRatio) - player.stats.bedwars[gamemode].beds.broken)}\``, required: true, inline: true },
                    ]);

                interaction.editReply({ embeds: [bedwarsGamemode], allowedMentions: { repliedUser: true } });
            } else {
                const gamemode504 = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription(`That gamemode does not exist or one of the arguments is wrong. If you need assistance, please run\`${prefix}help bedwars\``)
                interaction.editReply({ embeds: [gamemode504], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
            }
		}).catch((e) => {
            if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
                const player404 = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription("I could not find that player in the API. Check spelling and name history.")
                interaction.editReply({ embeds: [player404], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
            } else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
                const neverLogged = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription("That player has never logged into Hypixel.")
                interaction.editReply({ embeds: [neverLogged], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
            } else {
                const error = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker\` with this error message \n \n \`Error:\` \n \`\`\`${e}\`\`\``)
                interaction.editReply({ embeds: [error], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                        console.error(e)
                    }, 5000);
                });
            }
        });
	},
};