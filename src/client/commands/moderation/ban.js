const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const colors = require("../../tools/colors.json");

//TODO fix the slash command

module.exports = {
	name: "ban",
	aliases: ["tempban"],
	description: "Bans the mentioned user",
	options: [
		{
			name: "user",
			description: "The user you want to ban",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: "days",
			description: "The number of days you want to ban the user, up to 7 days",
			type: ApplicationCommandOptionType.Integer,
			required: false,
			choices: [
				{
					name: "1 Day",
					value: 1,
				},
				{
					name: "2 Days",
					value: 2,
				},
				{
					name: "3 Days",
					value: 3,
				},
				{
					name: "4 Days",
					value: 4,
				},
				{
					name: "5 Days",
					value: 5,
				},
				{
					name: "6 Days",
					value: 6,
				},
				{
					name: "7 Days",
					value: 7,
				},
			],
		},
		{
			name: "reason",
			description: 'A reason for banning this user - will default to "Banned by <your tag>" if omitted',
			type: ApplicationCommandOptionType.String,
			required: false,
		},
	],
	defaultPermission: true,
	usage: 'ban (user) [days] [reason]',
	example: "ban @ultimate_hecker 5 spamming",
	notes: "The number of days cannot be longer than 7 - if days are omitted, mentioned user will be banned indefinitely",
	async execute(client, message, args, Discord) {

		await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "Server Information",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

		let user = message.mentions.users.first();

		if (!user) {
			user = client.utils.resolveTag(message.guild, args[0]);
		}

		if (user) {
			const member = message.guild.members.resolve(user);
			if (member.permissions.has(PermissionFlagsBits.Administrator)) {
				const permsEmbed = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("You cannot ban a moderator!")
				return message.reply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } });
			}

			if (member) {
				const banner = message.guild.members.resolve(message.author);
				if (!banner.permissions.has(PermissionFlagsBits.BanMembers)) {
					const permsEmbed = new Discord.EmbedBuilder()
						.setAuthor(authorError)
						.setColor(colors["ErrorColor"])
						.setDescription("You do not have permission to ban!")
					return message.reply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } });
				}

				if (args[1] && isNaN(args[1])) {
					return member.ban({ reason: [args[1]] }).then(() => {
						const embed = new Discord.EmbedBuilder()
							.setAuthor(authorSuccess)
							.setColor(colors["MainColor"])
							.setDescription(`Successfully banned **${user.tag}**`);

						return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
					}).catch((err) => {
						if (err.message === "Missing Permissions") {
							const embed = new Discord.EmbedBuilder()
								.setAuthor(authorError)
								.setColor(colors["ErrorColor"])
								.setDescription("I do not have permissions to ban this user!");

							return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
						}

						const embed = new Discord.EmbedBuilder()
							.setAuthor(authorError)
							.setColor(colors["ErrorColor"])
							.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${err}\`\`\``);

						console.error(err);
						return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
					});
				} else if (!args[1]) {
					return member.ban({ reason: `User banned by ${message.author.tag}` }).then(() => {
						const embed = new Discord.EmbedBuilder()
							.setAuthor(authorSuccess)
							.setColor(colors["MainColor"])
							.setDescription(`Successfully banned **${user.tag}**`);

						return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
					}).catch((err) => {
						if (err.message === "Missing Permissions") {
							const embed = new Discord.EmbedBuilder()
								.setAuthor(authorError)
								.setColor(colors["ErrorColor"])
								.setDescription("I do not have permissions to ban this user!");

							return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
						}

						const embed = new Discord.EmbedBuilder()
							.setAuthor(authorError)
							.setColor(colors["ErrorColor"])
							.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${err}\`\`\``);

						console.error(err);
						return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
					});
				} else {
					if (args[1] > 7) {
						const embed = new Discord.EmbedBuilder()
							.setAuthor(authorError)
							.setColor(colors["ErrorColor"])
							.setDescription("You cannot tempban someone for more than 7 days!");

						return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
					}

					member.ban({ days: args[1], reason: args[2] ? args[2] : `User banned by ${message.author.tag}`}).then(() => {
						const embed = new Discord.EmbedBuilder()
							.setAuthor(authorSuccess)
							.setColor(colors["MainColor"])
							.setDescription(`Successfully banned **${user.tag}**`);

						return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
					}).catch((err) => {
						if (err.message === "Missing Permissions") {
							const embed = new Discord.EmbedBuilder()
								.setAuthor(authorError)
								.setColor(colors["ErrorColor"])
								.setDescription("I do not have permissions to ban this user!");

							return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
						}

						const embed = new Discord.EmbedBuilder()
							.setAuthor(authorError)
							.setColor(colors["ErrorColor"])
							.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${err}\`\`\``);

						console.error(err)
						return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
					});
				}
			} else {
				const embed = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("That user isn't in this guild!");

				message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
			}

		} else {
			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You didn't mention the user to ban!");

			message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
		}
	},
	async slashExecute(client, Discord, interaction, serverDoc) {
		
		await interaction.deferReply({ emphemeral: false });

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Success",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		let user = interaction.options.get("user");

		if (user.member.permissions.has(PermissionFlagsBits.Administrator)) {
			const permsEmbed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You cannot ban a moderator!")

			return interaction.editReply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					interaction.deleteReply()
				}, 5000);
			});
		}

		if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
			const permsEmbed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You do not have permission to ban!")

			return interaction.editReply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					interaction.deleteReply()
				}, 5000);
			});
		}

		const bannedEmbed = new Discord.EmbedBuilder()
			.setColor(colors["MainColor"])
			.setDescription(`You have been banned from **${interaction.guild.name}** for \`${interaction.options.get("reason")?.value ?? `User banned by ${interaction.user.tag}`}\``);

		await user.user.send({ embeds: [bannedEmbed] });

		return user.member.ban({ reason: interaction.options.get("reason")?.value ?? `User banned by ${interaction.user.tag}`, days: interaction.options.get("days")?.value }).then(async () => {
			const userDoc = await client.utils.loadUserInfo(client, serverDoc, user.user.id);
			userDoc.infractions.push({
				modID: interaction.user.id,
				modTag: interaction.user.tag,
				timestamp: interaction.createdTimestamp,
				type: "Ban",
				message: interaction.options.get("reason")?.value ?? `User banned by ${interaction.user.tag}`,
			});

			client.utils.updateUser(client, userDoc.guildID, userDoc.userID, {
				...userDoc.toObject(), infractions: userDoc.infractions,
			});

			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.setDescription(`Successfully banned **${user.user.tag}**`);

			return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
		}).catch((err) => {
			if (err.message === "Missing Permissions") {
				const embed = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("I do not have permissions to ban this user!");

				return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						interaction.deleteReply()
					}, 5000);
				});
			}

			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${err}\`\`\``);

			console.error(err);
			return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					console.error(err)
					interaction.deleteReply()
				}, 5000);
			});
		});
	},
};
