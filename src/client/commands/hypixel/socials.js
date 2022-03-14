const { hypixel, errors } = require('../../schemas/hypixel');
const User = require('../../schemas/user');
const colors = require("../../tools/colors.json");
const currentDate = new Date(Date.now());
console.log('Command File Successfully Scanned - socials')

module.exports = {
	name: "socials",
	aliases: [],
	description: "Show you the social medias of a average Hypixel Player!",
	usage: "socials [IGN]",
	example: "socials ultimate_hecker",
	async execute(client, message, args, Discord, prefix) {

		await message.channel.sendTyping();

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
        }
    
        let authorSuccess = {
            name: "Social Media",
            iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
        }

		const data = await User.findOne({
			id: message.author.id,
		});

		if (!data && !args[0]) {
			// if someone didn't type in ign
			const ign404 = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`You need to type in a player's IGN! (Example: \`${prefix}socials ultimate_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${prefix}link ultimate_hecker\`)`)
			return message.reply({ embeds: [ign404] });
		}

		let player;
		if (data && !args[0]) {
			player = data.uuid;
		} else if (args[0]) {
			player = args[0];
		}

		hypixel.getPlayer(player).then(async (player) => {
			let socials = new Discord.MessageEmbed()
				.setAuthor(authorSuccess)
				.setTitle(`[${player.rank}] ${player.nickname}`)
				.setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
				.setColor(colors["MainColor"])
				.setFooter(`${player.nickname} Socials requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`,message.author.displayAvatarURL());

			if (player.socialMedia[0] != undefined || player.socialMedia[0] != null) {
				socials.addField(player.socialMedia[0].name, player.socialMedia[0].link)
			}

			if (player.socialMedia[1] != undefined || player.socialMedia[1] != null) {
				socials.addField(player.socialMedia[1].name, player.socialMedia[1].link)
			}

			if (player.socialMedia[2] != undefined || player.socialMedia[2] != null) {
				socials.addField(player.socialMedia[2].name, player.socialMedia[2].link)
			}

			if (player.socialMedia[3] != undefined || player.socialMedia[3] != null) {
				socials.addField(player.socialMedia[3].name, player.socialMedia[3].link)
			}

			if (player.socialMedia[4] != undefined || player.socialMedia[4] != null) {
				socials.addField(player.socialMedia[4].name, player.socialMedia[4].link)
			}

			if (player.socialMedia[5] != undefined || player.socialMedia[5] != null) {
				socials.addField(player.socialMedia[5].name, player.socialMedia[5].link)
			}

			if (player.socialMedia[6] != undefined || player.socialMedia[6] != null) {
				socials.addField(player.socialMedia[6].name, player.socialMedia[6].link)
			}

			message.reply({embeds: [socials] });
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
			} else if (e.message === errors.CANNOT_READ_PROPERTIES_OF_UNDEFINED) {
				const neverLogged = new Discord.MessageEmbed()
					.setAuthor('Error', 'https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp')
					.setColor(colors["ErrorColor"])
					.setDescription('That player doesn\'t have any socials!')
				return message.reply({ embeds: [neverLogged] });
			} else {
				const error = new Discord.MessageEmbed()
					.setAuthor("Error", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
					.setColor(colors["ErrorColor"])
					.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${e}\`\`\``)
				console.error(e)
				return message.reply({ embeds: [error] });
			}
		});
	}
};
