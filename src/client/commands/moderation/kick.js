const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const colors = require("../../tools/colors.json");

module.exports = {
	name: "kick",
	aliases: [],
	description: "Kicks the mentioned user",
	options: [
		{
			name: "user",
			type: ApplicationCommandOptionType.User,
			description: "The user you want to kick",
			required: true,
		},
		{
			name: "reason",
			type: ApplicationCommandOptionType.String,
			description: 'A short reason for kicking this user - will default to "Kicked by <your tag>" if omitted',
			required: false,
		},
	],
	defaultPermission: true,
	usage: 'kick (user) [reason]',
	example: "kick @ulitmate_hecker spamming",
	async execute(client, message, args, Discord, prefix, serverDoc) {

		await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "Successfully Kicked",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

		let user = message.mentions.users.first();

		if (!user) {
			user = client.utils.resolveTag(message.guild, args[0]);
		}

		args.shift();
		const reason = args.join(" ");

		if (user) {
			const member = message.guild.members.resolve(user);
			if (member.permissions.has(PermissionFlagsBits.Administrator)) {
				const permsEmbed = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("You cannot kick a moderator!")

				return message.reply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } }).then((sent) => {
					setTimeout(() => {
						sent.delete();
					}, 5000);
				});
			}

			const kicker = message.guild.members.resolve(message.author);

			if (member) {
				if (!kicker.permissions.has(PermissionFlagsBits.KickMembers) && !kicker.permissions.has(PermissionFlagsBits.Administrator)) {
					const permsEmbed = new Discord.EmbedBuilder()
						.setAuthor(authorError)
						.setColor(colors["ErrorColor"])
						.setDescription("You do not have permissions to kick!")

					return message.reply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } }).then((sent) => {
						setTimeout(() => {
							sent.delete();
						}, 5000);
					});
				}

				const kickedEmbed = new Discord.EmbedBuilder()
					.setColor(colors["MainColor"])
					.setDescription(`You have been kicked from **${message.guild.name}** for \`${args[1] ?? `User kicked by ${user.tag}`}\``);

				await user.send({ embeds: [kickedEmbed] });

				member.kick({ reason: args[1] ?? `User kicked by ${kicker.tag}`, days: args[1] }).then(async () => {
					const userDoc = await client.utils.loadUserInfo(client, serverDoc, user.id);
					userDoc.infractions.push({
						modID: user.id,
						modTag: user.tag,
						timestamp: user.createdTimestamp,
						type: "Kick",
						message: args[1] ?? `User kicked by ${user.tag}`,
					});

					client.utils.updateUser(client, userDoc.guildID, userDoc.userID, {
						...userDoc.toObject(), infractions: userDoc.infractions,
					});

					const embed = new Discord.EmbedBuilder()
						.setAuthor(authorSuccess)
						.setColor(colors["MainColor"])
						.setDescription(`Successfully kicked **${member.user.tag}** for \`${args[1] ?? `User kicked by ${user.tag}`}\``);

					return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
				}).catch((err) => {
					if (err.message === "Missing Permissions") {
						const embed = new Discord.EmbedBuilder()
							.setAuthor(authorError)
							.setColor(colors["ErrorColor"])
							.setDescription("I don't have permissions to kick this user!");

						return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then((sent) => {
							setTimeout(() => {
								sent.delete();
							}, 5000);
						});

					} else {
						const errEmbed = new Discord.EmbedBuilder()
							.setAuthor(authorError)
							.setColor(colors["ErrorColor"])
							.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${err}\`\`\``)

						message.reply({ embeds: [errEmbed], allowedMentions: { repliedUser: true } }).then((sent) => {
							setTimeout(() => {
								console.error(err)
								sent.delete();
							}, 5000);
						});
					}
				});
			} else {
				const naEmbed = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("That user isn't in this server!")

				message.reply({ embeds: [naEmbed], allowedMentions: { repliedUser: true } }).then((sent) => {
					setTimeout(() => {
						sent.delete();
					}, 5000);
				});
			}
		} else {
			const mentionEmbed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You didn't mention the user to kick!")

			message.reply({ embeds: [mentionEmbed], allowedMentions: { repliedUser: true } }).then((sent) => {
				setTimeout(() => {
					sent.delete();
				}, 5000);
			});
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

		const reason = interaction.options.get("reason");

		if (user.member.permissions.has(PermissionFlagsBits.Administrator)) {
			const permsEmbed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You cannot kick a moderator!")

			return interaction.editReply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					interaction.deleteReply()
				}, 5000);
			});
		}

		if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers) && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
			const permsEmbed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You do not have permissions to kick!")

			return interaction.editReply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					interaction.deleteReply()
				}, 5000);
			});
		}

		const kickedEmbed = new Discord.EmbedBuilder()
			.setAuthor(authorSuccess)
			.setColor(colors["MainColor"])
			.setDescription(`You have been kicked from **${interaction.guild.name}** for \`${interaction.options.get("reason")?.value ?? `User kicked by ${interaction.user.tag}`}\``);

		user.user.send({ embeds: [kickedEmbed] });

		user.member.kick(reason?.value ?? `User kicked by ${interaction.user.tag}`).then(async () => {
			const userDoc = await client.utils.loadUserInfo(client, serverDoc, user.user.id);

			userDoc.infractions.push({
				modID: interaction.user.id,
				modTag: interaction.user.tag,
				timestamp: interaction.createdTimestamp,
				type: "Kick",
				message: interaction.options.get("reason")?.value ?? `User kicked by ${interaction.user.tag}`,
			});

			client.utils.updateUser(client, userDoc.guildID, userDoc.userID, {
				...userDoc.toObject(),
				infractions: userDoc.infractions,
			});

			const successEmbed = new Discord.EmbedBuilder()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.setDescription(`Successfully kicked **${user.user.tag}**`)

			interaction.editReply({ embeds: [successEmbed], allowedMentions: { repliedUser: true } });
		}).catch((err) => {
			if (err.message === "Missing Permissions") {
				const embed = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("I don't have permissions to kick this user!")
					
				interaction.editReply({ embeds: [errEmbed], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						interaction.deleteReply()
					}, 5000);
				});

				return interaction.editReply({ embeds: [embed] });
			}
			const errEmbed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${err}\`\`\``);

			interaction.editReply({ embeds: [errEmbed], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					console.error(err);
					interaction.deleteReply()
				}, 5000);
			});
		});
	},
};
