const { hypixel, errors } = require('../../schemas/hypixel');
const commaNumber = require('comma-number');
const User = require('../../schemas/user');
const colors = require("../../tools/colors.json");

module.exports = {
	name: "skywars",
	aliases: ["sw", "s"],
	description: "Show you the SkyWars statistics of a average Hypixel Player!",
	options: [
		{
			name: "player",
			description: "Shows the statistics of an average Hypixel Skywars player!",
			required: false,
			type: "STRING"
		},
		{
			name: "mode",
			description: "Shows the statistics of an average Hypixel Skywars player of a certain mode!",
			required: false,
			type: "STRING"
		}
	],
    defaultPermission: true,
	usage: "skywars [gamemode] [IGN]",
	example: "skywars, skywars solo ultimate_hecker, skywars ultimate_hecker",
	notes: 'For your skywars mega statistics, you need to make sure the gamemode is set to mega, and the type is set to the mega gamemode, such as solos etc.',
	async execute(client, message, args, Discord, prefix) {

		await message.channel.sendTyping();

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "SkyWars Statistics",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		const data = await User.findOne({
			id: message.author.id,
		});

		if (!data && !args[0]) {
			const ign404 = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`You need to type in a player's IGN! (Example: \`${prefix}skywars ultimate_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${prefix}link ultimate_hecker\`)`)
			return message.reply({ embeds: [ign404], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					sent.delete();
				}, 5000);
			});
		}

		let gamemode = args[0];
		let player;
		if (data && !args[1]) {
			player = data.uuid;
		} else if (args[1]) {
			player = args[1];
		}

		hypixel.getPlayer(player).then((player) => {

			if (!player.stats.skywars) {
                const neverPlayed = new Discord.MessageEmbed()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription("That player has never played this game")
                return interaction.reply({ embeds: [neverPlayed], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						sent.delete();
					}, 5000);
				});
            }

			if(!gamemode) {
				const embed = new Discord.MessageEmbed()
					.setAuthor(authorSuccess)
					.setTitle(`[${player.rank}] ${player.nickname}`)
					.setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
					.setColor(colors["MainColor"])

					.addField("General Stats", `\`•\` **Levels**: \`${player.stats.skywars.level}✫\` \n \`•\` **Heads**: \`${commaNumber(player.stats.skywars.heads)}\` \n \`•\` **Shards**: \`${commaNumber((player.stats.skywars.shards))}\``, true)
					.addField("Experience", `\`•\` **Experience**: \`${player.stats.skywars.experience}✫\` \n \`•\` **Coins**: \`${commaNumber(player.stats.skywars.coins)}\` \n \`•\` **Loot Chest**: \`${commaNumber((player.stats.skywars.lootChests))}\``, true)
					.addField("Games", `\`•\` **Winstreak**: \`${commaNumber(player.stats.skywars.winstreak)}\` \n \`•\` **Wins**: \`${commaNumber(player.stats.skywars.wins)}\` \n \`•\` **Losses**: \`${commaNumber(player.stats.skywars.losses)}\` \n \`•\` **WLR**: \`${player.stats.skywars.WLRatio}\``, true)
					.addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.skywars.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.skywars.deaths)}\` \n \`•\` **KDR**: \`${player.stats.skywars.KDRatio}\``, true)
					.addField("Averages per Game", `\`•\` **Kills**: \`${commaNumber((player.stats.skywars.kills / player.stats.skywars.playedGames).toFixed(2))}\` \n \`•\` **Final Kills**: \`${commaNumber((player.stats.skywars.finalKills / player.stats.skywars.playedGames).toFixed(2))}\` \n \`•\` **Beds**: \`${commaNumber((player.stats.skywars.beds.broken / player.stats.skywars.playedGames).toFixed(2))}\``, true)

				message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
			}else if(gamemode == "solo" || "team" || "ranked") {
				const embed = new Discord.MessageEmbed()
					.setAuthor(authorSuccess)
					.setTitle(`[${player.rank}] ${player.nickname}`)
					.setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
					.setColor(colors["MainColor"])

					.addField("General Stats", `\`•\` **Levels**: \`${player.stats.skywars.level}✫\` \n \`•\` **Heads**: \`${commaNumber(player.stats.skywars.heads)}\` \n \`•\` **Shards**: \`${commaNumber((player.stats.skywars.shards))}\``, true)
					.addField("Experience", `\`•\` **Experience**: \`${player.stats.skywars.experience}✫\` \n \`•\` **Coins**: \`${commaNumber(player.stats.skywars.coins)}\` \n \`•\` **Loot Chest**: \`${commaNumber((player.stats.skywars.lootChests))}\``, true)
					.addField("Games", `\`•\` **Winstreak**: \`${commaNumber(player.stats.skywars[gamemode].winstreak)}\` \n \`•\` **Wins**: \`${commaNumber(player.stats.skywars[gamemode].wins)}\` \n \`•\` **Losses**: \`${commaNumber(player.stats.skywars[gamemode].losses)}\` \n \`•\` **WLR**: \`${player.stats.skywars[gamemode].WLRatio}\``, true)
					.addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.skywars[gamemode].kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.skywars[gamemode].deaths)}\` \n \`•\` **KDR**: \`${player.stats.skywars[gamemode].KDRatio}\``, true)
					.addField("Averages per Game", `\`•\` **Kills**: \`${commaNumber((player.stats.skywars[gamemode].kills / player.stats.skywars[gamemode].playedGames).toFixed(2))}\` \n \`•\` **Final Kills**: \`${commaNumber((player.stats.skywars[gamemode].finalKills / player.stats.skywars[gamemode].playedGames).toFixed(2))}\` \n \`•\` **Beds**: \`${commaNumber((player.stats.skywars[gamemode].beds.broken / player.stats.skywars[gamemode].playedGames).toFixed(2))}\``, true)

				message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
			} else {
                const gamemode504 = new Discord.MessageEmbed()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription(`That gamemode does not exist or the argument list wasnt correctly order. \n \n *Reminder that dream statistics are currently not supported, and will be supported in a later update*`)
                message.reply({ embeds: [gamemode504], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        sent.delete();
                    }, 5000);
                });
            }

		}).catch((e) => {            
			if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
				const player404 = new Discord.MessageEmbed()
					.setAuthor("Error", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
					.setColor(colors["ErrorColor"])
					.setDescription("I could not find that player in the API. Check spelling and name history.")
				return message.reply({ embeds: [player404], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						sent.delete();
					}, 5000);
				});
			} else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
				const neverLogged = new Discord.MessageEmbed()
					.setAuthor("Error", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
					.setColor(colors["ErrorColor"])
					.setDescription("That player has never logged into Hypixel.")
				return message.reply({ embeds: [neverLogged], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						sent.delete();
					}, 5000);
				});
			} else {
				const error = new Discord.MessageEmbed()
					.setAuthor("Error", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
					.setColor(colors["ErrorColor"])
					.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${e}\`\`\``)
				console.error(e);
				return message.reply({ embeds: [error], allowedMentions: { repliedUser: true } }).then(() => {
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
            name: "SkyWars Statistics",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

        const data = await User.findOne({
            id: interaction.user.id
        });

        if (!data && !interaction.options.get("player")) { // if someone didn't type in ign
            const ign404 = new Discord.MessageEmbed()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescription(`You need to type in a player's IGN! (Example: \`${serverDoc.prefix}megawalls ultimate_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${serverDoc.prefix}link ultimate_hecker\`)`)
            return interaction.editReply({ embeds: [ign404], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					interaction.deleteReply()
				}, 5000);
			});
        }

		let gamemode = interaction.options.get("mode")?.value;
        let player;
        if (data && !interaction.options.get("player")?.value) {
             player = data.uuid;
        } else if (interaction.options.get("player")?.value) {
             player = interaction.options.get("player")?.value;
        }

        hypixel.getPlayer(player).then((player) => {

            if (!player.stats.megawalls) {
                const neverLogged = new Discord.MessageEmbed()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription('That player has never played this game')
                return interaction.editReply({ embeds: [neverLogged], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
            }

            if(!gamemode) {

				const embed = new Discord.MessageEmbed()
					.setAuthor(authorSuccess)
					.setTitle(`[${player.rank}] ${player.nickname}`)
					.setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
					.setColor(colors["MainColor"])

					.addField("General Stats", `\`•\` **Levels**: \`${player.stats.skywars.level}✫\` \n \`•\` **Heads**: \`${commaNumber(player.stats.skywars.heads)}\` \n \`•\` **Shards**: \`${commaNumber((player.stats.skywars.shards))}\``, true)
					.addField("Experience", `\`•\` **Experience**: \`${player.stats.skywars.experience}✫\` \n \`•\` **Coins**: \`${commaNumber(player.stats.skywars.coins)}\` \n \`•\` **Loot Chest**: \`${commaNumber((player.stats.skywars.lootChests))}\``, true)
					.addField("Games", `\`•\` **Winstreak**: \`${commaNumber(player.stats.skywars.winstreak)}\` \n \`•\` **Wins**: \`${commaNumber(player.stats.skywars.wins)}\` \n \`•\` **Losses**: \`${commaNumber(player.stats.skywars.losses)}\` \n \`•\` **WLR**: \`${player.stats.skywars.WLRatio}\``, true)
					.addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.skywars.kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.skywars.deaths)}\` \n \`•\` **KDR**: \`${player.stats.skywars.KDRatio}\``, true)
					.addField("Averages per Game", `\`•\` **Kills**: \`${commaNumber((player.stats.skywars.kills / player.stats.skywars.playedGames).toFixed(2))}\``, true)

				interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });

			}else if(gamemode == "solo" || "team" || "ranked") {

				let str = gamemode.slice(1);
		        let uppercase = gamemode[0].toUpperCase();
		        let uppercased = uppercase + str;

                authorSuccess.name = `${uppercased} SkyWars Statistics`;

				const embed = new Discord.MessageEmbed()
					.setAuthor(authorSuccess)
					.setTitle(`[${player.rank}] ${player.nickname}`)
					.setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
					.setColor(colors["MainColor"])

					.addField("General Stats", `\`•\` **Levels**: \`${player.stats.skywars.level}✫\` \n \`•\` **Heads**: \`${commaNumber(player.stats.skywars.heads)}\` \n \`•\` **Shards**: \`${commaNumber((player.stats.skywars.shards))}\``, true)
					.addField("Experience", `\`•\` **Experience**: \`${player.stats.skywars.experience}✫\` \n \`•\` **Coins**: \`${commaNumber(player.stats.skywars.coins)}\` \n \`•\` **Loot Chest**: \`${commaNumber((player.stats.skywars.lootChests))}\``, true)
					.addField("Games", `\`•\` **Winstreak**: \`${commaNumber(player.stats.skywars[gamemode].winstreak)}\` \n \`•\` **Wins**: \`${commaNumber(player.stats.skywars[gamemode].wins)}\` \n \`•\` **Losses**: \`${commaNumber(player.stats.skywars[gamemode].losses)}\` \n \`•\` **WLR**: \`${player.stats.skywars[gamemode].WLRatio}\``, true)
					.addField("Combat", `\`•\` **Kills**: \`${commaNumber(player.stats.skywars[gamemode].kills)}\` \n \`•\` **Deaths**: \`${commaNumber(player.stats.skywars[gamemode].deaths)}\` \n \`•\` **KDR**: \`${player.stats.skywars[gamemode].KDRatio}\``, true)
					.addField("Averages per Game", `\`•\` **Kills**: \`${commaNumber((player.stats.skywars[gamemode].kills / player.stats.skywars[gamemode].playedGames).toFixed(2))}\``, true)

				interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
			} else {
                const gamemode504 = new Discord.MessageEmbed()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription("That gamemode does not exist.")
                interaction.editReply({ embeds: [gamemode504], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
			}
        }).catch(e => { // error messages
            if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
                const player404 = new Discord.MessageEmbed()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription('I could not find that player in the API. Check spelling and name history.')
                return interaction.editReply({ embeds: [player404], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
            } else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
                const neverLogged = new Discord.MessageEmbed()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription('That player has never logged into Hypixel.')
                return interaction.editReply({ embeds: [neverLogged], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
            } else {
                const error = new Discord.MessageEmbed()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${e}\`\`\``)
                return interaction.editReply({ embeds: [error], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
						console.error(e)
                    }, 5000);
                });
            }       
        });
    }
};