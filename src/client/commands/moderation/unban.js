const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const colors = require("../../tools/colors.json");

module.exports = {
	name: "unban",
	aliases: [],
	description: "Unbans the user specified for the specified reason",
	options: [
		{
			name: "tag",
			description: 'The tag of the user you want to unban, or "list" to see a list of banned users',
			type: ApplicationCommandOptionType.String,
			required: false,
		},
		{
			name: "id",
			description: "If provided, the user matching the id will be unbanned instead of by user tag",
			type: ApplicationCommandOptionType.String,
			required: false,
		},
		{
			name: "reason",
			description: `The reason for unbanning this user - defaults to "User unbanned by <your tag>" if omitted}`,
			type: ApplicationCommandOptionType.String,
			required: false,
		},
	],
	defaultPermission: true,
	usage: "unban (user#tag) [reason]",
	example: "unban @ultimate_hecker not spamming",
	notes: "The member must be tagged in form user#tag, as they are no longer in your server",
	async execute(client, message, args, Discord) {

		await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

		let authorBanList = {
            name: "Server Ban List",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "Successfully Unbanned",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }
		
		const bans = await message.guild.bans.fetch();
		if (args[0] === "list") {
			let banArr = bans.map((banInfo) => banInfo.user.tag);
			let banListStr = "";

			for (let ban of banArr) {
				banListStr = banListStr + ` **- ${ban}** \n`;
			}

			if (banListStr === "") {
				const embed = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("No users are banned in this server!");

				return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then((sent) => {
					setTimeout(() => {
						sent.delete();
					}, 5000);
				});
			}

			authorBanList.name = `Ban List - ${message.guild.name}`

			const listEmbed = new Discord.EmbedBuilder()
				.setAuthor(authorBanList)
				.setColor(colors["MainColor"])
				.setDescription(banListStr)

			return message.reply({ embeds: [listEmbed], allowedMentions: { repliedUser: true } });
		}

		const banInfo = bans.find((ban) => ban.user.tag === args[0]);

		args.shift();
		const reason = args.join(" ");

		if (banInfo) {
			const user = banInfo.user;
			if (!message.member.permissions.has(PermissionFlagsBits.BanMembers) && !message.member.permissions.has(PermissionFlagsBits.Administrator)) {
				const permsEmbed = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("You do not have permissions to unban!")

				return message.reply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } }).then((sent) => {
					setTimeout(() => {
						sent.delete();
					}, 5000);
				});
			}

			message.guild.members.unban(user, reason ? reason : `${user.tag} unbanned by ${message.author.tag}`).then(() => {
					const successEmbed = new Discord.EmbedBuilder()
						.setAuthor(authorSuccess)
						.setColor(colors["MainColor"])
						.setDescription(`Successfully unbanned **${user.tag}**`)

					message.reply({ embeds: [successEmbed], allowedMentions: { repliedUser: true } });
				}).catch((err) => {
					if (err.message === "Missing Permissions") {
						const embed = new Discord.EmbedBuilder()
							.setAuthor(authorError)
							.setColor(colors["ErrorColor"])
							.setDescription("I don't have permissions to unban this user!");

						return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then((sent) => {
							setTimeout(() => {
								sent.delete();
							}, 5000);
						});
					} else {
						const errEmbed = new Discord.EmbedBuilder()
							.setAuthor(authorError)
							.setColor(colors["ErrorColor"])
							.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${err}\`\`\``);

						return message.reply({ embeds: [errEmbed], allowedMentions: { repliedUser: true } }).then((sent) => {
							setTimeout(() => {
								sent.delete();
							}, 5000);
						});
					}
				});
		} else {
			const mentionEmbed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("The tagged user is not banned!")

			message.reply({ embeds: [mentionEmbed], allowedMentions: { repliedUser: true } }).then((sent) => {
				setTimeout(() => {
					sent.delete();
				}, 5000);
			});
		}
	},
	async slashExecute(client, Discord, interaction) {
		
		await interaction.deferReply({ emphemeral: false });

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		let authorBanList = {
            name: "Server Information",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Success",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		if (!interaction.options.get("tag") && !interaction.options.get("id")) {
			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You must provide either a user tag or a user id!");

			return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					interaction.deleteReply()
				}, 5000);
			});
		}

		const bans = await interaction.guild.bans.fetch();

		if (interaction.options.get("tag")?.value === "list") {
			if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
				const embed = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("You do not have permission to view the ban list!");

				return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						interaction.deleteReply()
					}, 5000);
				});
			}

			let banArr = bans.map((banInfo) => banInfo.user.tag);
			let banListStr = "";

			for (let ban of banArr) {
				banListStr = banListStr + ` **- ${ban}** \n`;
			}

			if (banListStr === "") {
				const embed = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("No users are banned in this server!");

				return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						interaction.deleteReply()
					}, 5000);
				});
			}

			authorBanList.name = `Ban List - ${interaction.guild.name}`

			const listEmbed = new Discord.EmbedBuilder()
				.setAuthor(authorBanList)
				.setColor(colors["MainColor"])
				.setDescription(banListStr)

			return interaction.editReply({ embeds: [listEmbed], allowedMentions: { repliedUser: true } });
		}

		let banInfo;

		if (interaction.options.get("id")) {
			banInfo = bans.find(
				(ban) => ban.user.id === interaction.options.get("id")?.value
			);
		} else {
			banInfo = bans.find(
				(ban) => ban.user.tag === interaction.options.get("tag")?.value
			);
		}

		const reason = interaction.options.get("reason")?.value;

		if (banInfo) {
			const user = banInfo.user;
			if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers) && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
				const permsEmbed = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("You do not have permissions to unban!")

				return interaction.editReply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						interaction.deleteReply()
					}, 5000);
				});
			}

			interaction.guild.members.unban(user, reason ?? `${user.tag} unbanned by ${interaction.user.tag}`).then(() => {
				const successEmbed = new Discord.EmbedBuilder()
					.setAuthor(authorSuccess)
					.setColor(colors["MainColor"])
					.setDescription(`Successfully unbanned **${user.tag}**`)

				interaction.editReply({ embeds: [successEmbed], allowedMentions: { repliedUser: true } });
			}).catch((err) => {
				if (err.message === "Missing Permissions") {
					const embed = new Discord.EmbedBuilder()
						.setAuthor(authorError)
						.setColor(colors["ErrorColor"])
						.setDescription("I don't have permissions to unban this user!");

					return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
						setTimeout(function() {
							interaction.deleteReply()
						}, 5000);
					});
				} else {
					const embed = new Discord.EmbedBuilder()
						.setAuthor(authorError)
						.setColor(colors["ErrorColor"])
						.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${err}\`\`\``);

					interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
						setTimeout(function() {
							console.error(err);
							interaction.deleteReply()
						}, 5000);
					});
				}
			});
		} else {
			const mentionEmbed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("The tagged user is not banned!")

			interaction.editReply({ embeds: [mentionEmbed], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					interaction.deleteReply()
				}, 5000);
			});
		}
	},
};
