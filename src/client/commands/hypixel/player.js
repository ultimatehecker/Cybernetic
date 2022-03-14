const { hypixel, errors } = require('../../schemas/hypixel');
const commaNumber = require('comma-number');
const User = require('../../schemas/user');
const colors = require("../../tools/colors.json");
console.log('Command File Successfully Scanned - player');

module.exports = {
	name: "player",
	aliases: ["p", "hypixel", "h"],
	description: "Shows the statistics of an average Hypixel Player!",
	usage: "player [IGN]",
	example: "player ultimate_hecker",
	async execute(client, message, args, Discord, prefix) {

		await message.channel.sendTyping();

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
        }
    
        let authorSuccess = {
            name: "Bedwars Statistics",
            iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
        }

		const data = await User.findOne({
			id: message.author.id,
		});

		if (!data && !args[0]) {
			const ign404 = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`You need to type in a player's IGN! (Example: \`${prefix}player ultimate_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${prefix}link ultimate_hecker\`)`)
			return message.reply({ embeds: [ign404] });
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

			const playerStats = new Discord.MessageEmbed()
				.setAuthor("Player Stats", "https://i.imgur.com/tRe29vU.jpeg")
				.setTitle(`[${player.rank}] ${player.nickname}`)
				.setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
				.setColor(colors["MainColor"])
				.addField("Rank", `\`${playerRank}\``, true)
				.addField("Level", `\`${player.level}\``, true)
				.addField("Karma", `\`${commaNumber(player.karma)}\``, true);

			if (player.guild !== null && player.guild.tag == null) {
				playerStats.addField("Guild", `\`${player.guild.name}\``);
			}

			if (player.guild !== null && player.guild.tag !== null) {
				playerStats.setTitle(`[${player.rank}] ${player.nickname} [${player.guild.tag}]`);
				playerStats.addField("Guild",`\`${player.guild.name} [${player.guild.tag}]\``);
			}

			playerStats.addField("Main MC Version", `\`${playerMinecraftVersion}\``, true);
			playerStats.addField("First Login", `<t:${Math.ceil(player.firstLoginTimestamp / 1000)}:R>`);
			playerStats.addField("Last Login", `<t:${Math.ceil(player.lastLoginTimestamp / 1000)}:R>`);
			playerStats.addField("Status", `\`${playerIsOnline}\``, true);

			if (player.rank.includes("MVP+")) {
				if (player.plusColor == null) {
					playerStats.addField("Plus Color", "`Red`");
				} else {
					playerStats.addField("Plus Color", `\`${player.plusColor}\``);
				}
			}

			playerStats.addField("Social Media", `Run \`${prefix}socials ${player.nickname}\``);
			message.reply({ embeds: [playerStats] });

		}).catch((e) => {
			if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
				const player404 = new Discord.MessageEmbed()
					.setAuthor("Error", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
					.setColor(colors["ErrorColor"])
					.setDescription("I could not find that player in the API. Check spelling and name history.")
				return message.reply({embeds: [player404] });
			} else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
				const neverLogged = new Discord.MessageEmbed()
					.setAuthor("Error", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
					.setColor(colors["ErrorColor"])
					.setDescription("That player has never logged into Hypixel.");
				return message.reply({ embeds: [neverLogged] });
			} else {
				const error = new Discord.MessageEmbed()
					.setAuthor("Error", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
					.setColor(colors["ErrorColor"])
					.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${error}\`\`\``)
				console.error(e);
				return message.reply({ embeds: [error] });
			}
		});
	},
};
