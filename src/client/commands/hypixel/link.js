const colors = require(`../../tools/colors.json`)
const { hypixel, errors } = require('../../schemas/hypixel');
const User = require('../../schemas/user');
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "link",
	aliases: ["verify"],
	description: "Allows you to link your Minecraft account to Discord",
	options: [
		{
			name: "player",
			description: "Shows the statistics of an average Hypixel Bedwars player!",
			required: true,
			type: ApplicationCommandOptionType.String
		}
	],
	defaultPermission: true,
	usage: "link [IGN]",
	example: "link ultimate_hecker",
	async execute(client, message, args, Discord, prefix) {

		await message.channel.sendTyping();

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "Successfully Linked",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

		const user = await User.findOne({ id: message.author.id });

		if (user && user.uuid) {
			const alreadyconnected = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("Your account is already connected!");
			return message.reply({ embeds: [alreadyconnected], allowedMentions: { repliedUser: true } }).then((sent) => {
				setTimeout(function() {
					message.delete();
					sent.delete();
				}, 5000);
			});
		}

		if (!args[0]) {
			const ign404 = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`You need to type in a player's IGN! (Example: \`${prefix}link ultimate_hecker\`)`)
			return message.reply({embeds: [ign404], allowedMentions: { repliedUser: true } }).then((sent) => {
				setTimeout(function() {
					message.delete();
					sent.delete();
				}, 5000);
			});
		}

		hypixel.getPlayer(args[0]).then(async (player) => {
			if (!player.socialMedia.find((s) => s.id === "DISCORD")) {
				const notconnected = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("You haven't connected your Discord account to your account. Watch the GIF to learn how to connect your Discord account.")
					.setImage("https://thumbs.gfycat.com/DentalTemptingLeonberger-size_restricted.gif")
				return message.reply({embeds: [notconnected], allowedMentions: { repliedUser: true } }).then((sent) => {
                    setTimeout(function() {
						message.delete();
                        sent.delete();
                    }, 5000);
                });
			}
			if (player.socialMedia.find((s) => s.id === "DISCORD").link !== message.author.tag) {
				const tagnomatch = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`${player.nickname}'s connected Discord tag doesn't match your Discord tag.`)
				return message.reply({embeds: [tagnomatch], allowedMentions: { repliedUser: true } }).then((sent) => {
                    setTimeout(function() {
						message.delete();
                        sent.delete();
                    }, 5000);
                });
			}
			const user1 = await User.findOne({ uuid: player.uuid });

			if (user1) {
				const playerdupe = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("That player has already been linked to another account.")
				return message.reply({embeds: [playerdupe], allowedMentions: { repliedUser: true } }).then((sent) => {
                    setTimeout(function() {
						message.delete();
                        sent.delete();
                    }, 5000);
                });
			}

			new User({id: message.author.id, uuid: player.uuid}).save(() => {
				const linked = new Discord.EmbedBuilder()
					.setAuthor(authorSuccess)
					.setColor(colors["MainColor"])
					.setDescription(`${player.nickname} has been successfully linked to your account.`)
				message.reply({embeds: [linked], allowedMentions: { repliedUser: true } });
			});
		}).catch((e) => {
			if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
				const player404 = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("I could not find that player in the API. Check spelling and name history.")
				return message.reply({embeds: [player404], allowedMentions: { repliedUser: true } }).then((sent) => {
                    setTimeout(function() {
						message.delete();
                        sent.delete();
                    }, 5000);
                });
			} else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
				const neverLogged = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("That player has never logged into Hypixel.")
				return message.reply({embeds: [neverLogged], allowedMentions: { repliedUser: true } }).then((sent) => {
                    setTimeout(function() {
						message.delete();
                        sent.delete();
                    }, 5000);
                });
			} else {
				if (args[0]) {
					const error = new Discord.EmbedBuilder()
						.setAuthor(authorError)
						.setColor(colors["ErrorColor"])
						.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${e}\`\`\``)
						console.error(e);
					return message.reply({embeds: [error], allowedMentions: { repliedUser: true } }).then(() => {
						setTimeout(function() {
							message.delete();
							sent.delete();
						}, 5000);
					});
				}
			}
		});
	},
	async slashExecute(client, Discord, interaction, serverDoc) {

		await interaction.deferReply({ ephemeral: false });

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "Link",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

		const user = await User.findOne({ id: interaction.user.id });

		if (user && user.uuid) {
			const alreadyconnected = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("Your account is already connected!");
			return interaction.editReply({ embeds: [alreadyconnected], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					interaction.deleteReply()
				}, 5000);
			});
		}

		if (!interaction.options.get("player")) {
			const ign404 = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`You need to type in a player's IGN! (Example: \`${serverDoc.prefix}link ultimate_hecker\`)`)
			return interaction.editReply({ embeds: [ign404], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					interaction.deleteReply()
				}, 5000);
			});
		}

		hypixel.getPlayer(interaction.options.get("player")?.value).then(async (player) => {
			if (!player.socialMedia.find((s) => s.id === "DISCORD")) {
				const notconnected = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("You haven't connected your Discord account to your account. Watch the GIF to learn how to connect your Discord account.")
					.setImage("https://thumbs.gfycat.com/DentalTemptingLeonberger-size_restricted.gif")
				return interaction.editReply({ embeds: [notconnected], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
			}
			if (player.socialMedia.find((s) => s.id === "DISCORD").link !== interaction.user.tag) {
				const tagnomatch = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`${player.nickname}'s connected Discord tag doesn't match your Discord tag.`)
				return interaction.editReply({embeds: [tagnomatch], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
			}

			const user1 = await User.findOne({ uuid: player.uuid });
			if (user1) {
				const playerdupe = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("That player has already been linked to another account.")
				return interaction.editReply({embeds: [playerdupe], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
			}

			new User({ id: interaction.user.id, uuid: player.uuid }).save(() => {
				const linked = new Discord.EmbedBuilder()
					.setAuthor(authorSuccess)
					.setColor(colors["MainColor"])
					.setDescription(`\`${player.nickname}\` has been successfully linked to your account.`)
			
					interaction.editReply({ embeds: [linked], allowedMentions: { repliedUser: true },
				});
			});
		}).catch((e) => {
			if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
				const player404 = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("I could not find that player in the API. Check spelling and name history.")
				return interaction.editReply({ embeds: [player404], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
			} else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
				const neverLogged = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("That player has never logged into Hypixel.");
				return interaction.editReply({ embeds: [neverLogged], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
			} else {
				if (interaction.options.get("player")) {
					const error = new Discord.EmbedBuilder()
						.setAuthor(authorError)
						.setColor(colors["ErrorColor"])
						.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${error}\`\`\``)
					return interaction.editReply({ embeds: [error], allowedMentions: { repliedUser: true } }).then(() => {
						setTimeout(function() {
							interaction.deleteReply()
						}, 5000);
					});
				}
			}
		});
	},
};