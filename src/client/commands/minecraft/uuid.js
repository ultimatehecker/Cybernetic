const axios = require("axios");
const { hypixel, errors } = require('../../schemas/hypixel');
const User = require('../../schemas/user');
const colors = require("../../tools/colors.json");
console.log('Command File Successfully Scanned - uuid');

module.exports = {
	name: "uuid",
	aliases: [],
	description: "Shows you the UUID of an average Minecraft Player!",
	usage: "uuid [IGN]",
	example: "uuid ultimate_hecker",
	async execute(client, message, args, Discord, prefix) {

		let authorError = {
			name: "Error",
			iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
		}

		let authorSuccess = {
			name: "UUID",
			iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
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
					.setDescription(`You need to type in a player's IGN! (Example: \`${prefix}uuid ultiamte_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${prefix}link ultiamte_hecker\`)`)
				return message.reply({ embeds: [ign404] });
			}

			let player;

			if (data && !args[0]) {
				player = data.uuid;
			} else if (args[0]) {
				player = args[0];
			}

			const user = await hypixel.getPlayer(player);
			const playerUUIDData = (await axios.get(`https://playerdb.co/api/player/minecraft/${user.uuid}`)).data; // fetch uuid

			const embed = new Discord.MessageEmbed()
				.setAuthor(authorSuccess)
				.setTitle(`${playerUUIDData.data.player.username}`)
				.setColor(colors["MainColor"])
				.addField("UUID", `\`${playerUUIDData.data.player.id}\``)
				.addField("Trimmed UUID", `\`${playerUUIDData.data.player.raw_id}\``)
				.setThumbnail(`https://crafatar.com/avatars/${playerUUIDData.data.player.id}?overlay&size=256`)

			message.reply({embeds: [embed] });
		} catch (error) {
			if (error.message === errors.PLAYER_DOES_NOT_EXIST) {
				const player404 = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("I could not find that player in the API. Check spelling and name history.")
				return message.reply({ embeds: [player404] });
			} else {
				const err = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`Redstone#1165\` with this error message \n \n \`Error:\` \n \`\`\`${error}\`\`\``)
				return message.reply({embeds: [err] });
			}
		}
	}
};