const { hypixel, errors } = require('../../models/hypixel');
const commaNumber = require('comma-number');
const User = require('../../models/user');
const colors = require("../../tools/colors.json");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "player",
	aliases: ["p", "hypixel", "h"],
	description: "Shows the statistics of an average Hypixel Player!",
	options: [
		{
			name: "player",
			description: "Shows the statistics of an average Hypixel Bedwars player!",
			required: false,
			type: ApplicationCommandOptionType.String
		}
	],
    defaultPermission: true,
	usage: "player [IGN]",
	example: "player ultimate_hecker",
	async execute(client, message, args, Discord, prefix) {

		await message.channel.sendTyping();

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Player Statistics",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		const data = await User.findOne({
			id: message.author.id,
		});

		if (!data && !args[0]) {
			const ign404 = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`You need to type in a player's IGN! (Example: \`${prefix}player ultimate_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${prefix}link ultimate_hecker\`)`)
			return message.reply({ embeds: [ign404], allowedMentions: { repliedUser: true } }).then((sent) => {
				setTimeout(function() {
					message.delete();
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

		hypixel.getPlayer(player, { guild: true }).then(async (player) => {

			let playerIsOnline;

			if (!player.isOnline) {
				playerIsOnline = "Offline";
			} else if (player.isOnline) {
				playerIsOnline = "Online";
			}

			let playerMinecraftVersion;
			if (player.mcVersion == null) {
				playerMinecraftVersion = "Unknown";
			} else if (player.mcVersion != null) {
				playerMinecraftVersion = player.mcVersion;
			}

			let playerRank;
			if (player.rank == "Default") {
				playerRank = "None";
			} else if (player.rank != "Default") {
				playerRank = player.rank;
			}

			const playerStats = new Discord.EmbedBuilder()
				.setAuthor(authorSuccess)
				.setTitle(`[${player.rank}] ${player.nickname}`)
				.setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
				.setColor(colors["MainColor"])
				.addFields([
					{ name: `General Stats`, value: `\`•\` **Rank**: \`${commaNumber(playerRank)}\` \n \`•\` **Level**: \`${commaNumber(player.level)}\` \n \`•\` **Karma**: \`${commaNumber(player.karma)}\``, required: true, inline: true },
				]);

			if (player.guild !== null && player.guild.tag == null) {
				playerStats.addFields([
					{ name: `Guild`, value: `\`•\` **Name**: \`${commaNumber(player.guild.name)}\``, required: true, inline: true },
				]);
			}

			if (player.guild !== null && player.guild.tag !== null) {
				playerStats.setTitle(`[${player.rank}] ${player.nickname} [${player.guild.tag}]`);
				playerStats.addFields([
					{ name: `Guild`, value: `\`•\` **Name**: \`${commaNumber(player.guild.name)} / ${commaNumber(player.guild.tag)}\` \n \`•\` **Tag Color**: \`${commaNumber(player.guild.tagColor)}\``, required: true, inline: true },
				]);
			}

			playerStats.addFields([
				{ name: `Login`, value: `\`•\` **First**: <t:${Math.ceil(player.firstLoginTimestamp / 1000)}:R> \n \`•\` **Last**: <t:${Math.ceil(player.lastLoginTimestamp / 1000)}:R>`, required: true, inline: true },
				{ name: `Main MC Version`, value: `\`${playerMinecraftVersion}\``, required: true, inline: true },
				{ name: `Status`, value: `\`${playerIsOnline}\``, required: true, inline: true },
			]);

			if (player.rank.includes("MVP+")) {
				if (player.plusColor == null) {
					playerStats.addFields([
						{ name: `Rank Color`, value: `\`Red\``, required: true, inline: true },
					]);
				} else {
					playerStats.addFields([
						{ name: `Rank Color`, value: `\`${player.plusColor}\``, required: true, inline: true },
					]);
				}
			}

			playerStats.setDescription(` \n *For a player's social media stats, please run \`${prefix}socials ${player.nickname}\`*`);
			message.reply({ embeds: [playerStats], allowedMentions: { repliedUser: true } });

		}).catch((e) => {
			if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
				const player404 = new Discord.EmbedBuilder()
					.setAuthor("Error", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
					.setColor(colors["ErrorColor"])
					.setDescription("I could not find that player in the API. Check spelling and name history.")
				return message.reply({embeds: [player404], allowedMentions: { repliedUser: true } }).then((sent) => {
                    setTimeout(function() {
						message.delete();
                        sent.delete();
                    }, 5000);
                });
			} else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
				const neverLogged = new Discord.EmbedBuilder()
					.setAuthor("Error", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
					.setColor(colors["ErrorColor"])
					.setDescription("That player has never logged into Hypixel.");
				return message.reply({ embeds: [neverLogged], allowedMentions: { repliedUser: true } }).then((sent) => {
                    setTimeout(function() {
						message.delete();
                        sent.delete();
                    }, 5000);
                });
			} else {
				const error = new Discord.EmbedBuilder()
					.setAuthor("Error", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
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
            name: "Player Statistics",
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

        let player
        if (data && !interaction.options.get("player")?.value) {
             player = data.uuid;
        } else if (interaction.options.get("player")?.value) {
             player = interaction.options.get("player")?.value;
        }

        hypixel.getPlayer(player).then((player) => {

            let playerIsOnline;

			if (!player.isOnline) {
				playerIsOnline = "Offline";
			} else if (player.isOnline) {
				playerIsOnline = "Online";
			}

			let playerMinecraftVersion;
			if (player.mcVersion == null) {
				playerMinecraftVersion = "Unknown";
			} else if (player.mcVersion != null) {
				playerMinecraftVersion = player.mcVersion;
			}

			let playerRank;
			if (player.rank == "Default") {
				playerRank = "None";
			} else if (player.rank != "Default") {
				playerRank = player.rank;
			}

			const playerStats = new Discord.EmbedBuilder()
				.setAuthor(authorSuccess)
				.setTitle(`[${player.rank}] ${player.nickname}`)
				.setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
				.setColor(colors["MainColor"])
				.addFields([
					{ name: `General Stats`, value: `\`•\` **Rank**: \`${commaNumber(playerRank)}\` \n \`•\` **Level**: \`${commaNumber(player.level)}\` \n \`•\` **Karma**: \`${commaNumber(player.karma)}\``, required: true, inline: true },
				]);

			if (player.guild !== null && player.guild.tag == null) {
				playerStats.addFields([
					{ name: `Guild`, value: `\`•\` **Name**: \`${commaNumber(player.guild.name)}\``, required: true, inline: true },
				]);
			}

			if (player.guild !== null && player.guild.tag !== null) {
				playerStats.setTitle(`[${player.rank}] ${player.nickname} [${player.guild.tag}]`);
				playerStats.addFields([
					{ name: `Guild`, value: `\`•\` **Name**: \`${commaNumber(player.guild.name)} / ${commaNumber(player.guild.tag)}\` \n \`•\` **Tag Color**: \`${commaNumber(player.guild.tagColor)}\``, required: true, inline: true },
				]);
			}

			playerStats.addFields([
				{ name: `Login`, value: `\`•\` **First**: <t:${Math.ceil(player.firstLoginTimestamp / 1000)}:R> \n \`•\` **Last**: <t:${Math.ceil(player.lastLoginTimestamp / 1000)}:R>`, required: true, inline: true },
				{ name: `Main MC Version`, value: `\`${playerMinecraftVersion}\``, required: true, inline: true },
				{ name: `Status`, value: `\`${playerIsOnline}\``, required: true, inline: true },
			]);

			if (player.rank.includes("MVP+")) {
				if (player.plusColor == null) {
					playerStats.addFields([
						{ name: `Rank Color`, value: `\`Red\``, required: true, inline: true },
					]);
				} else {
					playerStats.addFields([
						{ name: `Rank Color`, value: `\`${player.plusColor}\``, required: true, inline: true },
					]);
				}
			}

			playerStats.setDescription(` \n *For a player's social media stats, please run \`${serverDoc.prefix}socials ${player.nickname}\`*`);
            interaction.editReply({ embeds: [playerStats], allowedMentions: { repliedUser: true } });

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
						console.error(e)
                    }, 5000);
                });
            }       
        });
    }
};
