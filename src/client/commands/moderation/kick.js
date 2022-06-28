const colors = require("../../tools/colors.json");

module.exports = {
	name: "kick",
	aliases: [],
	description: "Kicks the mentioned user",
	options: [
		{ name: "user", type: "USER", description: "The user you want to kick", required: true },
		{ name: "reason", type: "STRING", description: 'A short reason for kicking this user - will default to "Kicked by <your tag>" if omitted' },
	],
	defaultPermission: true,
	usage: ".ban (user) [reason]",
	example: "kick @ultimate_hecker nsfw",
	notes: "You must mention the user you want to kick",
	async execute(client, message, args, Discord, prefix) {

		await message.replyTyping()

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Successfully Cleared",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		let user = message.mentions.users.first();

		if (!user) {
			user = client.utils.resolveTag(message.guild, args[0]);
		}

		args.shift();
		const reason = args.join(" ");

		if (user) {
			const member = message.guild.members.resolve(user);

			if (member.permissions.has("ADMINISTRATOR")) {

				const permsEmbed = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("You cannot kick a moderator!")

				return message.reply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						sent.delete();
					}, 5000);
				});
			}

			const kicker = message.guild.members.resolve(message.author);

			if (member) {
				if (!kicker.permissions.has("KICK_MEMBERS") && !kicker.permissions.has("ADMINISTRATOR")) {
					const permsEmbed = new Discord.MessageEmbed()
						.setAuthor(authorError)
						.setColor(colors["ErrorColor"])
						.setDescription("You do not have permissions to kick!")

					return message.reply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } }).then(() => {
						setTimeout(function() {
							sent.delete();
						}, 5000);
					});
				}

				member.kick(reason ? reason : `User kicked by ${message.author.tag}`).then(() => {
					const successEmbed = new Discord.MessageEmbed()
						.setAuthor(authorSuccess)
						.setColor(colors["MainColor"])
						.setDescription(`Successfully kicked **${user.tag}**`)

					message.reply({ embeds: [successEmbed], allowedMentions: { repliedUser: true } });
				}).catch((err) => {
					if (err.message === "Missing Permissions") {
						const embed = new Discord.MessageEmbed()
							.setAuthor(authorError)
							.setColor(colors["ErrorColor"])
							.setDescription("I don't have permissions to kick this user!");

						return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
							setTimeout(function() {
								sent.delete();
							}, 5000);
						});
					}
					const errEmbed = new Discord.MessageEmbed()
						.setAuthor(authorError)
						.setColor(colors["ErrorColor"])
						.setDescription("I was unable to kick the member because: \n`" + err + "`")

					message.reply({ embeds: [errEmbed], allowedMentions: { repliedUser: true } }).then(() => {
						setTimeout(function() {
							sent.delete();
						}, 5000);
					});

					console.error(err)
				});
			} else {
				const naEmbed = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("That user isn't in this server!")

				message.reply({ embeds: [naEmbed], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						sent.delete();
					}, 5000);
				});
			}
		} else {
			const mentionEmbed = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You didn't mention the user to kick!")

			message.reply({ embeds: [mentionEmbed], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					sent.delete();
				}, 5000);
			});
		}
	},
	async slashExecute(client, Discord, interaction, serverDoc) {
		await interaction.deferReply();

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Successfully Removed",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		let user = interaction.options.get("user");
		const reason = interaction.options.get("reason");

		if (user.member.permissions.has("ADMINISTRATOR")) {
			const permsEmbed = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You cannot kick a moderator!")

			return interaction.editReply({ embeds: [permsEmbed] }).then(() => {
                setTimeout(function() {
                    interaction.deleteReply()
                }, 5000);
            });
		}

		if (!interaction.member.permissions.has("KICK_MEMBERS") && !interaction.member.permissions.has("ADMINISTRATOR")) {
			const permsEmbed = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You do not have permissions to kick!")

			return interaction.editReply({ embeds: [permsEmbed] }).then(() => {
                setTimeout(function() {
                    interaction.deleteReply()
                }, 5000);
            });
		}

		const kickedEmbed = new Discord.MessageEmbed()
			.setAuthor(authorSuccess)
			.setColor(colors["MainColor"])
			.setDescription(`You have been kicked from **${interaction.guild.name}** for \`${interaction.options.get("reason")?.value ?? `User banned by ${interaction.user.tag}`}\``)

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
			
			const successEmbed = new Discord.MessageEmbed()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.setDescription(`Successfully kicked **${user.user.tag}**`)

			interaction.editReply({ embeds: [successEmbed] });
		}).catch((err) => {
			if (err.message === "Missing Permissions") {
				const embed = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("I don't have permissions to kick this user!")

				return interaction.editReply({ embeds: [embed] }).then(() => {
					setTimeout(function() {
						interaction.deleteReply()
					}, 5000);
				});
			}
			const errEmbed = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("I was unable to kick the member because: \n`" + err + "`")

			interaction.editReply({ embeds: [errEmbed] }).then(() => {
                setTimeout(function() {
                    interaction.deleteReply()
                }, 5000);
            });

			console.error(err);
		});
	},
};
