const colors = require("../../tools/colors.json");

module.exports = {
	name: "unmute",
	aliases: [],
	description: "Unmutes the mentioned user",
	options: [
		{ name: "user", description: "The user you want to unmute", type: "USER", required: true },
		{ name: "reason", description: 'The reason for unmuting this user - defaults to "Unmuted by <your tag>" if omitted', type: "STRING", required: false },
	],
	defaultPermission: true,
	example: "unmute @ultimate_hecker",
	notes: "user must be mentioned",
	async execute(client, message, args, Discord, prefix, serverDoc) {

		await message.channel.sendTyping();

        let authorError = {
			name: "Error",
			iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
		}

		let authorSuccess = {
			name: "Successfully un-Deafened",
			iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
		}

		let user = message.mentions.users.first();

		if (!user) {
			user = client.utils.resolveTag(message.guild, args[0]);
		}

		if (user) {
			const member = message.guild.members.resolve(user);
			if (!member.roles.cache.find((role) => role.name === "Muted")) {
				const embed = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("This member is not muted!")

				return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
			}
			const unmuter = message.guild.members.resolve(message.author);
			if (member) {
				if (!unmuter.permissions.has("MUTE_MEMBERS")) {
					const permsEmbed = new Discord.MessageEmbed()
						.setAuthor(authorError)
						.setColor(colors["ErrorColor"])
						.setDescription("You do not have permission to unmute!")

					return message.reply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } });
				}
				const unmuteRole = message.guild.roles.cache.find((role) => role.name === "Muted");
				member.roles.remove(unmuteRole, args[1]).then(() => {
					const embed = new Discord.MessageEmbed()
						.setAuthor(authorSuccess)
						.setColor(colors["MainColor"])
						.setDescription(`Successfully unmuted **${user.tag}**`);

					message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
				}).catch((err) => {
					const embed = new Discord.MessageEmbed()
						.setAuthor(authorError)
						.setColor(colors["ErrorColor"])
						.setDescription("I was unable to unmute the member because: \n`" + err + "`")

					message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
				});
			} else {
				const embed = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("That user isn't in this guild!")

				message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
			}
		} else {
			const embed = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You didn't mention the user to unmute!")

			message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
		}
	},
	async slashExecute(client, Discord, interaction) {

		await interaction.deferReply();

		let authorError = {
			name: "Error",
			iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
		}

		let authorSuccess = {
			name: "Successfully un-Deafened",
			iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
		}

		let user = interaction.options.get("user").user;

		const member = interaction.guild.members.resolve(user);

		if (!member.roles.cache.find((role) => role.name === "Muted")) {
			const embed = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("This member is not muted!")

			return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
		}

		const unmuter = interaction.member;
		if (!unmuter.permissions.has("MUTE_MEMBERS")) {
			const permsEmbed = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You do not have permission to unmute!")
	
			return interaction.editReply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } });
		}
		const unmuteRole = interaction.guild.roles.cache.find((role) => role.name === "Muted");
		member.roles.remove( unmuteRole, interaction.options.get("reason")?.value ?? `User unmuted by ${interaction.user.tag}`).then(() => {
			const embed = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`Successfully unmuted **${user.tag}**`)

			interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
		}).catch((err) => {
			const embed = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("I was unable to unmute the member because: \n`" + err + "`")

			interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
			console.error(err);
		});
	},
};
