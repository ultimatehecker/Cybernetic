const { hypixel, errors } = require('../../schemas/hypixel');
const User = require('../../schemas/user');
const colors = require("../../tools/colors.json");
const currentDate = new Date(Date.now());

module.exports = {
	name: "skin",
	aliases: ["playerskin"],
	description: "Shows you the skin of an average Minecraft Player!",
	usage: "skin [IGN]",
	example: "skin ultimate_hecker",
	async execute(client, message, args, Discord, prefix) {

		try {
			await message.channel.sendTyping();

			let authorError = {
				name: "Error",
				iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
			}
		
			let authorSuccess = {
				name: "Skin",
				iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
			}

			const data = await User.findOne({
				id: message.author.id,
			});

			if (!data && !args[0]) {
				const ign404 = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`You need to type in a player's IGN! (Example: \`${prefix}skin ultiamte_hecker\`)`)
				return message.reply({ embeds: [ign404] });
			}

			let player;

			if (data && !args[0]) {
				player = data.uuid;
			} else if (args[0]) {
				player = args[0];
			}

			const user = await hypixel.getPlayer(player);
			const skin = new Discord.MessageEmbed()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.setFooter(`Minecraft Skin Services requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`, message.author.displayAvatarURL())
				.addField("Username", `\`${user.nickname}\``)
				.addField("Apply Skin", `[Link](https://www.minecraft.net/en-us/profile/skin/remote?url=https://crafatar.com/skins/${user.uuid})`)
				.setImage(`http://photopass.appspot.com/3d.php?user=${player}&vr=-25&hr=35&hrh=0&vrll=0&vrrl=0&vrla=0&vrra=0&displayHair=true&headOnly=false&format=png&ratio=20&aa=true&layers=true}`)

			message.reply({ embeds: [skin] });
		} catch (error) {
			if (error.message === errors.PLAYER_DOES_NOT_EXIST) {
				const player404 = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("I could not find that player in the API. Check spelling and name history.")
				return message.reply({embeds: [player404] });
			} else if (error.message === errors.PLAYER_HAS_NEVER_LOGGED) {
				const neverLogged = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("That player has never logged into Hypixel.");
				return message.reply({embeds: [neverLogged] });
			} else {
				const error = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${error}\`\`\``)
				return message.reply({embeds: [error] });
			}
		}
	},
};