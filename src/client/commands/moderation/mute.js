const colors = require("../../tools/colors.json");

module.exports = {
	name: "mute",
	aliases: [],
	description: "Mutes the mentioned user h",
	options: [
		{ name: "user", type: "USER", description: "The user you want to mute", required: true },
		{ name: "reason", type: "STRING", description: 'A short reason for muting this user - will default to "Muted by <your tag>" if omitted', required: false },
	],
	defaultPermission: true,
	usage: "mute (user) [reason]",
	example: "mute @ultimate_hecker",
	notes: "You must mention the user you want to kick",
	async execute(client, message, args, Discord, prefix) {

		await message.channel.sendTyping();

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Successfully Deafened",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		let user = message.mentions.users.first();

		if (!user) {
			user = client.utils.resolveTag(message.guild, args[0]);
		}

		if (user) {
			const member = message.guild.members.resolve(user);

			if (member.permissions.has("ADMINISTRATOR")) {
				const permsEmbed = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("You cannot mute a moderator!")

				return message.reply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						sent.delete();
					}, 5000);
				});
			}

			if (member.roles.cache.find((role) => role.name === "Muted")) {
				const embed = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("This member is already muted!")

				return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						sent.delete();
					}, 5000);
				});
			}

			const muter = message.guild.members.resolve(message.author);

			if (member) {
				if (!muter.permissions.has("MUTE_MEMBERS")) {
					const permsEmbed = new Discord.MessageEmbed()
						.setAuthor(authorError)
						.setColor(colors["ErrorColor"])
						.setDescription("You do not have permissions to mute!")

					return message.reply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } }).then(() => {
						setTimeout(function() {
							sent.delete();
						}, 5000);
					});
				}

				let rolesize;
				message.guild.roles.fetch().then((roles) => (rolesize = roles.cache.size));

				let muteRole = member.guild.roles.cache.find((rl) => rl.name === "Muted");

				if (!muteRole) {

					const aGuild = client.guilds.resolve(message.channel);
					await aGuild.roles.create({
						name: "Muted",
						color: "#FFFFFF",
						hoist: true,
						position: rolesize,
						permissions: 66560n,
						mentionable: false,
						reason: "mute role",
					});

					muteRole = member.guild.roles.cache.find((rl) => rl.name === "Muted");

					let channels = member.guild.channels.cache;

					channels.mapValues((chanel) => {
						if (!(chanel instanceof Discord.ThreadChannel)) {
							if (chanel.manageable) {
								if (chanel.isText()) {
									chanel.permissionOverwrites.create(muteRole, { SEND_MESSAGES: false }, { reason: "Setting up Muted role" });
								} else {
									chanel.permissionOverwrites.create(muteRole, { SPEAK: false }, { reason: "Setting up Muted role" });
								}
							}
						}
					});
				}

				member.roles.add(muteRole, args[1]).then(() => {
						const embed = new Discord.MessageEmbed()
							.setAuthor(authorSuccess)
							.setColor(colors["MainColor"])
							.setDescription(`Successfully muted **${user.tag}**`);

						message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
					})
					.catch((err) => {
						const embed = new Discord.MessageEmbed()
							.setAuthor(authorError)
							.setColor(colors["ErrorColor"])
							.setDescription("I was unable to mute the member because: \n`" + err + "`")

						message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
							setTimeout(function() {
								sent.delete();
							}, 5000);
						});
						console.error(err);
					});
			} else {
				const embed = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("That user isn't in this server!");

				return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						sent.delete();
					}, 5000);
				});
			}
		} else {
			const embed = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You didn't mention the user to mute!");

			return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					sent.delete();
				}, 5000);
			});
		}
	},
	async slashExecute(client, Discord, interaction, serverDoc) {

		await interaction.deferReply({ ephemeral: false });

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Successfully Cleared",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		let user = interaction.options.get("user");

		if (user.member.permissions.has("ADMINISTRATOR")) {
			const permsEmbed = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You cannot mute a moderator!")

			return interaction.editReply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } }).then(() => {
                setTimeout(function() {
                    interaction.deleteReply()
                }, 5000);
            });
		}

		if (!interaction.member.permissions.has("MUTE_MEMBERS")) {
			const permsEmbed = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You do not have permissions to mute!")

			return interaction.editReply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } }).then(() => {
                setTimeout(function() {
                    interaction.deleteReply()
                }, 5000);
            });
		}

		if (user.member.roles.cache.find((role) => role.name === "Muted")) {
			const embed = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("This member is already muted!")

			return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
                setTimeout(function() {
                    interaction.deleteReply()
                }, 5000);
            });
		}

		await interaction.guild.roles.fetch();

		let muteRole = interaction.guild.roles.cache.find((rl) => rl.name === "Muted");

		if (!muteRole) {

			await interaction.guild.roles.create({
				name: "Muted",
				color: "#FFFFFF",
				hoist: true,
				permissions: 66560n,
				mentionable: false,
				reason: "mute role",
			});

			muteRole = interaction.guild.roles.cache.find((rl) => rl.name === "Muted");

			let channels = interaction.member.guild.channels.cache;

			channels.mapValues((chanel) => {
				if (!(chanel instanceof Discord.ThreadChannel)) {
					if (chanel.manageable) {
						if (chanel.isText()) {
							chanel.permissionOverwrites.create(muteRole, { SEND_MESSAGES: false }, { reason: "Setting up Muted role" });
						} else {
							chanel.permissionOverwrites.create(muteRole, { SPEAK: false }, { reason: "Setting up Muted role" });
						}
					}
				}
			});
		}

		user.member.roles.add( muteRole, interaction.options.get("reason")?.value ?? `User muted by ${interaction.user.tag}`).then(async () => {

			const userDoc = await client.utils.loadUserInfo(client, serverDoc, user.user.id);
			userDoc.infractions.push({
				modID: interaction.user.id,
				modTag: interaction.user.tag,
				timestamp: interaction.createdTimestamp,
				type: "Mute",
				message: interaction.options.get("reason")?.value ?? `User muted by ${interaction.user.tag}`,
			});
			
			client.utils.updateUser(client, userDoc.guildID, userDoc.userID, {
				...userDoc.toObject(),
				infractions: userDoc.infractions,
			});

			const mutedEmbed = new Discord.MessageEmbed()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.setDescription(`You have been muted in **${interaction.guild.name}** for \`${interaction.options.get("reason")?.value ?? `User banned by ${interaction.user.tag}`}\``)

			user.user.send({ embeds: [mutedEmbed], allowedMentions: { repliedUser: true } });

			const embed = new Discord.MessageEmbed()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.setDescription(`Successfully muted **${user.user.tag}**`)

			interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
		})
		.catch((err) => {
			const embed = new Discord.MessageEmbed()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.setDescription("I was unable to mute the member because: \n`" + err + "`")

			interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
                setTimeout(function() {
                    interaction.deleteReply()
                }, 5000);
            });
			console.error(err);
		});
	}
};
