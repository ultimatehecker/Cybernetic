const { hypixel, errors } = require('../../schemas/hypixel');
const commaNumber = require('comma-number');
const User = require('../../schemas/user');
const colors = require("../../tools/colors.json");
const currentDate = new Date(Date.now());

module.exports = {
	name: "skywars",
	aliases: ["sw", "s"],
	description: "Show you the SkyWars statistics of a average Hypixel Player!",
	usage: "skywars [IGN]",
	example: "skywars ultimate_hecker",
	async execute(client, message, args, Discord, prefix) {

		await message.channel.sendTyping();

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
        }
    
        let authorSuccess = {
            name: "SkyWars Statistics",
            iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
        }

		const data = await User.findOne({
			id: message.author.id,
		});

		if (!data && !args[0]) {
			const ign404 = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`You need to type in a player's IGN! (Example: \`${prefix}skywars ultimate_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${prefix}link ultimate_hecker\`)`)
			return message.reply({ embeds: [ign404] });
		}

		let player;
		if (data && !args[0]) {
			player = data.uuid;
		} else if (args[0]) {
			player = args[0];
		}

		hypixel.getPlayer(player).then((player) => {
			const embed = new Discord.MessageEmbed()
				.setAuthor(authorSuccess)
				.setTitle(`[${player.rank}] ${player.nickname}`)
				.setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
				.setColor(colors["MainColor"])
				.setFooter(`${player.nickname} Skywars Statistics requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`,message.author.displayAvatarURL())
				.addField("Level", `\`${player.stats.skywars.level}\``, true)
				.addField("Heads", `\`${commaNumber(player.stats.skywars.heads)}\``, true)
				.addField("KD Ratio", `\`${player.stats.skywars.KDRatio}\``, true)
				.addField("WL Ratio", `\`${player.stats.skywars.WLRatio}\``, true)
				.addField("Coins", `\`${commaNumber(player.stats.skywars.coins)}\``, true)
				.addField("Total Deaths", `\`${commaNumber(player.stats.skywars.deaths)}\``, true)
				.addField("Total Kills", `\`${commaNumber(player.stats.skywars.kills)}\``, true)
				.addField("Winstreak", `\`${commaNumber(player.stats.skywars.winstreak)}\``, true)
				.addField("Total Wins", `\`${commaNumber(player.stats.skywars.wins)}\``, true)
				.addField("Tokens", `\`${commaNumber(player.stats.skywars.tokens)}\``, true)
				.addField("Prestige", `\`${player.stats.skywars.prestige}\``, true)
				.addField("Souls", `\`${commaNumber(player.stats.skywars.souls)}\``, true)
				.addField("Ranked Kills", `\`${commaNumber(player.stats.skywars.ranked.kills)}\``, true)
				.addField("Ranked Losses", `\`${commaNumber(player.stats.skywars.ranked.losses)}\``, true)
				.addField("Ranked Games Played", `\`${commaNumber(player.stats.skywars.ranked.played)}\``, true)
				.addField("Ranked Wins", `\`${commaNumber(player.stats.skywars.ranked.wins)}\``, true)
				.addField("Ranked KD Ratio", `\`${player.stats.skywars.ranked.KDRatio}\``, true)
				.addField("Ranked WL Ratio", `\`${player.stats.skywars.ranked.WLRatio}\``, true)

			message.reply({ embeds: [embed] });

		}).catch((e) => {            
			if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
				const player404 = new Discord.MessageEmbed()
					.setAuthor("Error", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
					.setColor(colors["ErrorColor"])
					.setDescription("I could not find that player in the API. Check spelling and name history.")
				return message.reply({ embeds: [player404] });
			} else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
				const neverLogged = new Discord.MessageEmbed()
					.setAuthor("Error", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
					.setColor(colors["ErrorColor"])
					.setDescription("That player has never logged into Hypixel.")
				return message.reply({ embeds: [neverLogged] });
			} else if (e.message === errors.CANNOT_READ_PROPERTIES_OF_UNDEFINED) {
				const neverLogged = new Discord.MessageEmbed()
					.setAuthor('Error', 'https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp')
					.setColor(colors["ErrorColor"])
					.setDescription('That player has never played this game')
				return message.reply({ embeds: [neverLogged] });
			} else {
				const error = new Discord.MessageEmbed()
					.setAuthor("Error", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
					.setColor(colors["ErrorColor"])
					.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${e}\`\`\``)
				return message.reply({ embeds: [error] });
			}
		});
	}
};