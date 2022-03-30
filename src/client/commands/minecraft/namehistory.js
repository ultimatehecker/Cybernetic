const axios = require("axios");
const { hypixel, errors } = require('../../schemas/hypixel');
const User = require('../../schemas/user');
const colors = require("../../tools/colors.json");
console.log('Command File Successfully Scanned - namehistory');

module.exports = {
	name: "namehistory",
	aliases: ["nh", "names"],
	description: "Shows you the name history of an average Minecraft Player!",
	usage: "namehistory [IGN]",
	example: "namehistory ultimate_hecker",
	async execute(client, message, args, Discord, prefix) {

		let authorError = {
			name: "Error",
			iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
		}
	
		let authorSuccess = {
			name: "Name History",
			iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
		}

		try {

			await message.channel.sendTyping();

			const data = await User.findOne({
				id: message.author.id,
			});

			if (!data && !args[0]) {
				const ign404 = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`You need to type in a player's IGN! (Example: \`${prefix}namehistory ultiamte_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${prefix}link ultiamte_hecker\`)`)
				return message.reply({ embeds: [ign404] });
			}

			let player;

			if (data && !args[0]) {
				player = data.uuid;
			} else if (args[0]) {
				player = args[0];
			}

			const user = await hypixel.getPlayer(player);

			const playerNameData = (await axios.get(`https://api.mojang.com/user/profiles/${user.uuid}/names`)).data; // fetch name history

			const namehistory = new Discord.MessageEmbed()
				.setAuthor("Name History", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
				.setTitle(`${playerNameData[playerNameData.length - 1].name}'s Name History`)
				.setColor(colors["MainColor"])
				.setThumbnail(`https://crafatar.com/avatars/${user.uuid}?overlay&size=256`)

			for (let length in playerNameData) {
				for (let key in playerNameData[length]) {
					if (key == "name" && playerNameData[length].changedToAt == undefined) {
						namehistory.addField(playerNameData[length][key], "`Original Name`", true);
					}
				}
			}

			for (let length in playerNameData) {
				for (let key in playerNameData[length]) {
					if (key == "name") {
						if (playerNameData[length].changedToAt == undefined) {
							break;
						} else {
							namehistory.addField(playerNameData[length][key], `<t:${playerNameData[length].changedToAt / 1000}:R>`, true);
						}
					}
				}
			}

			message.reply({ embeds: [namehistory] });

		} catch (error) {
			if (error.message === errors.PLAYER_DOES_NOT_EXIST) {
				const player404 = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("I could not find that player in the API. Check spelling and name history.")
				return message.reply({ embeds: [player404] });
			} else if (error.message === errors.PLAYER_HAS_NEVER_LOGGED) {
				const neverLogged = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("That player has never logged into Hypixel.");
				return message.reply({embeds: [neverLogged] });
			} else {
				const err = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${error}\`\`\``)
				console.error(error);
				return message.reply({embeds: [error] });
			}
		}
	}
};