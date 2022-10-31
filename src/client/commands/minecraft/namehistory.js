const axios = require("axios");
const { hypixel, errors } = require('../../schemas/hypixel');
const User = require('../../schemas/user');
const colors = require("../../tools/colors.json");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "namehistory",
	aliases: ["nh", "names"],
	description: "Shows you the name history of an average Minecraft Player!",
	options: [
		{
			name: "player",
			description: "Shows the statistics of an average Hypixel Bedwars player!",
			required: false,
			type: ApplicationCommandOptionType.String
		}
	],
    defaultPermission: true,
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

			if (!data && !args[0]) {
				const ign404 = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`You need to type in a player's IGN! (Example: \`${prefix}namehistory ultiamte_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${prefix}link ultiamte_hecker\`)`)
				return message.reply({ embeds: [ign404], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
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

			const user = await hypixel.getPlayer(player);

			const playerNameData = (await axios.get(`https://api.mojang.com/user/profiles/${user.uuid}/names`)).data; // fetch name history

			const namehistory = new Discord.EmbedBuilder()
				.setAuthor(authorSuccess)
				.setTitle(`${playerNameData[playerNameData.length - 1].name}'s Name History`)
				.setColor(colors["MainColor"])
				.setThumbnail(`https://crafatar.com/avatars/${user.uuid}?overlay&size=256`)

			for (let length in playerNameData) {
				for (let key in playerNameData[length]) {
					if (key == "name" && playerNameData[length].changedToAt == undefined) {
						namehistory.addFields([
							{ name: `Original Name`, value: `\`${playerNameData[length][key]}\``, required: true, inline: true },
						]);
					}
				}
			}

			for (let length in playerNameData) {
				for (let key in playerNameData[length]) {
					if (key == "name") {
						if (playerNameData[length].changedToAt == undefined) {
							break;
						} else {
							namehistory.addFields([
								{ name: ``, value: `${playerNameData[length][key]}, <t:${playerNameData[length].changedToAt / 1000}:R>`, required: true, inline: true },
							]);
						}
					}
				}
			}

			message.reply({ embeds: [namehistory], allowedMentions: { repliedUser: true } });

		} catch (error) {
			if (error.message === errors.PLAYER_DOES_NOT_EXIST) {
				const player404 = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("I could not find that player in the API. Check spelling and name history.")
				return message.reply({ embeds: [player404], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						sent.delete();
					}, 5000);
				});
			} else {
				const err = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${error}\`\`\``)
				console.error(error);
				return message.reply({embeds: [err], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						sent.delete();
					}, 5000);
				});
			}
		}
	},
	async slashExecute(client, Discord, interaction, serverDoc) {

		await interaction.deferReply({ ephemeral: false });

		let authorError = {
			name: "Error",
			iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
		}
	
		let authorSuccess = {
			name: "Name History",
			iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
		}

		try {
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

			const user = await hypixel.getPlayer(player);
			const playerNameData = (await axios.get(`https://api.mojang.com/user/profiles/${user.uuid}/names`)).data;

			const namehistory = new Discord.EmbedBuilder()
				.setAuthor(authorSuccess)
				.setTitle(`${playerNameData[playerNameData.length - 1].name}'s Name History`)
				.setColor(colors["MainColor"])
				.setThumbnail(`https://crafatar.com/avatars/${user.uuid}?overlay&size=256`)

				for (let length in playerNameData) {
					for (let key in playerNameData[length]) {
						if (key == "name" && playerNameData[length].changedToAt == undefined) {
							namehistory.addFields([
								{ name: `Original Name`, value: `\`${playerNameData[length][key]}\``, required: true, inline: true },
							]);
						}
					}
				}
	
				for (let length in playerNameData) {
					for (let key in playerNameData[length]) {
						if (key == "name") {
							if (playerNameData[length].changedToAt == undefined) {
								break;
							} else {
								namehistory.addFields([
									{ name: ``, value: `${playerNameData[length][key]}, <t:${playerNameData[length].changedToAt / 1000}:R>`, required: true, inline: true },
								]);
							}
						}
					}
				}

			interaction.editReply({ embeds: [namehistory], allowedMentions: { repliedUser: true } });

		} catch (error) {
			if (error.message === errors.PLAYER_DOES_NOT_EXIST) {
				const player404 = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("I could not find that player in the API. Check spelling and name history.")
				interaction.editReply({ embeds: [player404], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						interaction.deleteReply()
					}, 5000);
				});
			} else {
				const err = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${error}\`\`\``)
				console.error(error);
				return interaction.editReply({ embeds: [err], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						interaction.deleteReply()
					}, 5000);
				});
			}
		}


	}
};