const colors = require(`../../tools/colors.json`)
const currentDate = new Date(Date.now());
const { hypixel, errors } = require('../../schemas/hypixel');
const User = require('../../schemas/user');

module.exports = {
	name: "link",
	aliases: ["verify"],
	description: "Allows you to link your Minecraft account to Discord",
	usage: "link [IGN]",
	example: "link ultimate_hecker",
	async execute(client, message, args, Discord, prefix) {

		await message.channel.sendTyping();

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "Link",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

		const user = await User.findOne({ id: message.author.id });

		if (user && user.uuid) {
			const alreadyconnected = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("Your account is already connected!");
			return message.reply({ embeds: [alreadyconnected] });
		}

		if (!args[0]) {
			const ign404 = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`You need to type in a player's IGN! (Example: \`${prefix}link ultimate_hecker\`)`)
			return message.reply({embeds: [ign404] });
		}

		hypixel.getPlayer(args[0]).then(async (player) => {
			if (!player.socialMedia.find((s) => s.id === "DISCORD")) {
				const notconnected = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("You haven't connected your Discord account to your account. Watch the GIF to learn how to connect your Discord account.")
					.setImage(
						"https://thumbs.gfycat.com/DentalTemptingLeonberger-size_restricted.gif")
				return message.reply({embeds: [notconnected] });
			}
			if (player.socialMedia.find((s) => s.id === "DISCORD").link !== message.author.tag) {
				const tagnomatch = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`${player.nickname}'s connected Discord tag doesn't match your Discord tag.`)
				return message.reply({embeds: [tagnomatch] });
			}
			const user1 = await User.findOne({ uuid: player.uuid });

			if (user1) {
				const playerdupe = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("That player has already been linked to another account.")
				return message.reply({embeds: [playerdupe] });
			}

			new User({id: message.author.id, uuid: player.uuid}).save(() => {
				const linked = new Discord.MessageEmbed()
					.setAuthor(authorSuccess)
					.setColor(colors["MainColor"])
					.setDescription(`${player.nickname} has been successfully linked to your account.`)
					.setFooter(`Account Linking Services requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`, message.author.displayAvatarURL())
				message.reply({embeds: [linked] });
			});
		}).catch((e) => {
			if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
				const player404 = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("I could not find that player in the API. Check spelling and name history.")
				return message.reply({embeds: [player404] });
			} else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
				const neverLogged = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("That player has never logged into Hypixel.")
				return message.reply({embeds: [neverLogged] });
			} else {
				if (args[0]) {
					const error = new Discord.MessageEmbed()
						.setAuthor(authorError)
						.setColor(colors["ErrorColor"])
						.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${e}\`\`\``)
					return message.reply({embeds: [error] });
				}
			}
		});
	}
}