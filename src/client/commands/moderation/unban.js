const colors = require("../../tools/colors.json");

module.exports = {
	name: "unban",
	aliases: [],
	description: "Unbans the tagged user",
	options: [
		{ name: "tag", description: 'The tag of the user you want to unban, or "list" to see a list of banned users', type: "STRING", required: false },
		{ name: "id", description: "If provided, the user matching the id will be unbanned instead of by user tag", type: "STRING", required: false },
		{ name: "reason", description: `The reason for unbanning this user - defaults to "Unbanned by <your tag>" if omitted}`, type: "STRING", required: false },
	],
	defaultPermission: true,
	usage: 'unban (user) [reason]',
	example: "unban @ultimate_hecker false ban",
	notes: "You must mention the user you want to unban in form of user#tag",
	async execute(client, message, args, Discord, prefix, serverDoc) {

		await message.channel.sendTyping();

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		let authorSuccessBanList = {
            name: `Bans for ${message.guild.name}`,
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Successfully un-Destroyed",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		const bans = await message.guild.bans.fetch();
		if (args[0] === "list") {
			let banArr = bans.map((banInfo) => banInfo.user.tag);
			let banListStr = "";

			for (let ban of banArr) {
				banListStr = banListStr + ` **- ${ban}** \n`;
			}

			if (banListStr === "") {
				const embed = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("No users are banned in this server!");

				return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then((sent) => {
					setTimeout(() => {
						sent.delete();
					}, 5000);
				});
			}

			const listEmbed = new Discord.MessageEmbed()
				.setAuthor(authorSuccessBanList)
				.setColor(colors["MainColor"])
				.setDescription(banListStr)

			return message.reply({ embeds: [listEmbed], allowedMentions: { repliedUser: true } });
		}

		const banInfo = bans.find((ban) => ban.user.tag === args[0]);

		args.shift();
		const reason = args.join(" ");

		if (banInfo) {
			const user = banInfo.user;
			if (!message.member.permissions.has("BAN_MEMBERS") && !message.member.permissions.has("ADMINISTRATOR")) {
				const permsEmbed = new Discord.MessageEmbed()
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
				const successEmbed = new Discord.MessageEmbed()
					.setAuthor(authorSuccess)
					.setColor(colors["MainColor"])
					.setDescription(`Successfully unbanned **${user.tag}**`)

				message.reply({ embeds: [successEmbed], allowedMentions: { repliedUser: true } });
			}).catch((err) => {
				if (err.message === "Missing Permissions") {
					const embed = new Discord.MessageEmbed()
						.setAuthor(authorError)
						.setColor(colors["ErrorColor"])
						.setDescription("I don't have permissions to unban this user!");

					return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then((sent) => {
						setTimeout(() => {
							sent.delete();
						}, 5000);
					});
				}

				const errEmbed = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("I was unable to unban the member because: \n`" + err + "`")

				message.reply({ embeds: [errEmbed], allowedMentions: { repliedUser: true } }).then((sent) => {
					setTimeout(() => {
						sent.delete();
					}, 5000);
				});
			});
		} else {
			const mentionEmbed = new Discord.MessageEmbed()
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

		await interaction.deferReply({ ephemeral: true });

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		let authorSuccessBanList = {
            name: `Bans for ${message.guild.name}`,
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Successfully un-Destroyed",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		if (!interaction.options.get("tag") && !interaction.options.get("id")) {
			const embed = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You must provide either a user tag or a user id!");

			return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } })
		}
		const bans = await interaction.guild.bans.fetch();
		if (interaction.options.get("tag")?.value === "list") {
			if (!interaction.member.permissions.has("BAN_MEMBERS")) {
				const embed = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("You do not have permission to view the ban list!");

				return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true }  }).then(() => {
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
				const embed = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("No users are banned in this server!");

				return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						interaction.deleteReply()
					}, 5000);
				});
			}

			const listEmbed = new Discord.MessageEmbed()
				.setAuthor(authorSuccessBanList)
				.setColor(colors["MainColor"])
				.setDescription(banListStr)

			return interaction.editReply({ embeds: [listEmbed], allowedMentions: { repliedUser: true } });
		}

		let banInfo;

		if (interaction.options.get("id")) {
			banInfo = bans.find((ban) => ban.user.id === interaction.options.get("id")?.value);
		} else {
			banInfo = bans.find((ban) => ban.user.tag === interaction.options.get("tag")?.value);
		}

		const reason = interaction.options.get("reason")?.value;

		if (banInfo) {
			const user = banInfo.user;
			if (!interaction.member.permissions.has("BAN_MEMBERS") && !interaction.member.permissions.has("ADMINISTRATOR")) {
				const permsEmbed = new Discord.MessageEmbed()
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
				const successEmbed = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`Successfully unbanned **${user.tag}**`)

				interaction.editReply({ embeds: [successEmbed], allowedMentions: { repliedUser: true } });
			}).catch((err) => {
				if (err.message === "Missing Permissions") {
					const embed = new Discord.MessageEmbed()
						.setAuthor(authorError)
						.setColor(colors["ErrorColor"])
						.setDescription("I don't have permissions to unban this user!");

					return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
						setTimeout(function() {
							interaction.deleteReply()
						}, 5000);
					});
				}

				const errEmbed = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("I was unable to unban the member because: \n`" + err + "`");

				interaction.editReply({ embeds: [errEmbed], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						interaction.deleteReply()
					}, 5000);
				});
			});
		} else {
			const mentionEmbed = new Discord.MessageEmbed()
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
