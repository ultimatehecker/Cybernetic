const { hypixel, errors } = require('../../schemas/hypixel');
const User = require('../../schemas/user');
const colors = require("../../tools/colors.json");

module.exports = {
	name: "skin",
	aliases: ["playerskin"],
	description: "Shows you the skin of an average Minecraft Player!",
	options: [
		{
			name: "player",
			description: "Shows the statistics of an average Hypixel Bedwars player!",
			required: false,
			type: "STRING"
		}
	],
    defaultPermission: true,
	usage: "skin [IGN]",
	example: "skin ultimate_hecker",
	async execute(client, message, args, Discord, prefix) {

		try {
			await message.channel.sendTyping();

			let authorError = {
				name: "Error",
				iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
			}
		
			let authorSuccess = {
				name: "Skin",
				iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
			}

			const data = await User.findOne({
				id: message.author.id,
			});

			if (!data && !args[0]) {
				const ign404 = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`You need to type in a player's IGN! (Example: \`${prefix}skin ultiamte_hecker\`)`)
				return message.reply({ embeds: [ign404], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						message.delete()
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
			const skin = new Discord.MessageEmbed()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.addField("Username", `\`${user.nickname}\``)
				.addField("Apply Skin", `[Link](https://www.minecraft.net/en-us/profile/skin/remote?url=https://crafatar.com/skins/${user.uuid})`)
				.setImage(`http://photopass.appspot.com/3d.php?user=${player}&vr=-25&hr=35&hrh=0&vrll=0&vrrl=0&vrla=0&vrra=0&displayHair=true&headOnly=false&format=png&ratio=20&aa=true&layers=true}`)

			message.reply({ embeds: [skin], allowedMentions: { repliedUser: true } });
		} catch (error) {
			if (error.message === errors.PLAYER_DOES_NOT_EXIST) {
				const player404 = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("I could not find that player in the API. Check spelling and name history.")
				return message.reply({embeds: [player404], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						message.delete()
					}, 5000);
				});
			} else if (error.message === errors.PLAYER_HAS_NEVER_LOGGED) {
				const neverLogged = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("That player has never logged into Hypixel.");
				return message.reply({embeds: [neverLogged], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						message.delete()
					}, 5000);
				});
			} else {
				const error = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${error}\`\`\``)
				return message.reply({embeds: [error], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						message.delete()
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
			name: "Skin",
			iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
		}

		try {
			const data = await User.findOne({
				id: interaction.user.id,
			});

			if (!data && !interaction.options.get("player")) {
				const ign404 = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`You need to type in a player's IGN! (Example: \`${serverDoc.prefix}skin ultiamte_hecker\`)`)
				return message.reply({ embeds: [ign404], allowedMentions: { repliedUser: true } }).then(() => {
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
			const skin = new Discord.MessageEmbed()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.addField("Username", `\`${user.nickname}\``)
				.addField("Apply Skin", `[Link](https://www.minecraft.net/en-us/profile/skin/remote?url=https://crafatar.com/skins/${user.uuid})`)
				.setImage(`http://photopass.appspot.com/3d.php?user=${player}&vr=-25&hr=35&hrh=0&vrll=0&vrrl=0&vrla=0&vrra=0&displayHair=true&headOnly=false&format=png&ratio=20&aa=true&layers=true}`)

			interaction.editReply({ embeds: [skin], allowedMentions: { repliedUser: true } });

		} catch (error) {
			if (error.message === errors.PLAYER_DOES_NOT_EXIST) {
				const player404 = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("I could not find that player in the API. Check spelling and name history.")
				return interaction.editReply({embeds: [player404] }).then(() => {
					setTimeout(function() {
						interaction.deleteReply()
					}, 5000);
				});
			} else if (error.message === errors.PLAYER_HAS_NEVER_LOGGED) {
				const neverLogged = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("That player has never logged into Hypixel.");
				return interaction.editReply({embeds: [neverLogged], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						interaction.deleteReply()
					}, 5000);
				});
			} else {
				const error = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${error}\`\`\``)
				return interaction.editReply({embeds: [error], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						interaction.deleteReply()
					}, 5000);
				});
			}
		}
	}
};