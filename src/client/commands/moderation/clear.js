const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const colors = require("../../tools/colors.json");

module.exports = {
	name: "clear",
	aliases: ["purge", "delete"],
	description: "Clear messages",
	options: [
		{
			name: "amount",
			description: "The number of messages you wish to clear, or all",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],
	defaultPermission: true,
	usage: 'clear (number)',
	example: "clear 100",
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
		
		if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You do not have permission to clear messages!")
				
			return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then((sent) => {
				setTimeout(() => {
					sent.delete();
				}, 5000);
			});
		}

		if (!args[0]) {
			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("Please enter the amount of messages you wish to clear!");

			return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then((sent) => {
				setTimeout(() => {
					sent.delete();
				}, 5000);
			});
		}

		if (isNaN(args[0])) {
			if (args[0] === "all") {
				message.channel.clone({ position: message.channel.rawPosition, reason: "Clearing channel message history" }).then((newChannel) => {
					const embed = new Discord.EmbedBuilder()
						.setAuthor(authorSuccess)
						.setColor(colors["MainColor"])
						.setDescription("Channel message history cleared!");

					newChannel.send({ embeds: [embed], allowedMentions: { repliedUser: true } }).then((sent) => {
						setTimeout(() => {
							sent.delete();
						}, 5000);
					});
				});
			message.channel.delete({ reason: "Clearing channel message history" });
			return;
		} else {
			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("Please enter an actual number!");
			return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then((sent) => {
				setTimeout(() => {
					sent.delete();
				}, 5000);
			});
		}
		}

		if (args[0] > 100) {
			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You are not able to delete over 100 messages at a time!");

			return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then((sent) => {
				setTimeout(() => {
					sent.delete();
				}, 5000);
			});
		}

		if (args[0] < 1) {
			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You must delete at least one message!");

			return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then((sent) => {
				setTimeout(() => {
					sent.delete();
				}, 5000);
			});
		}

		message.delete().then(() => {
			message.channel.bulkDelete(args[0], true).then(async (collection) => {
				const embed = new Discord.EmbedBuilder()
					.setAuthor(authorSuccess)
					.setColor(authorSuccess)
					.setDescription(`Successfully cleared \`${collection.size}\` messages!`)

				message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then((sent) => {
					setTimeout(() => {
						sent.delete();
					}, 5000);
				});
			}).catch((err) => {
				const embed = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("At this time, you cannot delete messages that are over 14 days old.")

				console.error(err);
				return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then((sent) => {
					setTimeout(() => {
						sent.delete();
					}, 5000);
				});
			});
		});
	},
	async slashExecute(client, Discord, interaction) {
		
		await interaction.deferReply({ emphemeral: false });

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Success",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You do not have permission to clear messages!")

			return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					interaction.deleteReply()
				}, 5000);
			});
		}

		if (!Number.isInteger(Number(interaction.options.get("amount").value))) {
			if (interaction.options.get("amount").value === "all") {
				interaction.channel.clone({ position: interaction.channel.rawPosition, reason: "Clearing channel message history" }).then((newChannel) => {
					const embed = new Discord.EmbedBuilder()
						.setAuthor(authorSuccess)
						.setColor(colors["MainColor"])
						.setDescription("Channel message history cleared!");

					newChannel.send({ embeds: [embed], allowedMentions: { repliedUser: true } }).then((sent) => {
						setTimeout(() => {
							sent.delete();
						}, 5000);
					});
				});

				interaction.channel.delete({ reason: "Clearing channel message history" });
				return;

			} else {
				const embed = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("Please enter a valid integer!");

				return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						interaction.deleteReply()
					}, 5000);
				});
			}
		}

		if (Number(interaction.options.get("amount").value) > 100) {
			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You are not able to delete over 100 messages at a time!");

			return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					interaction.deleteReply()
				}, 5000);
			});
		}

		if (Number(interaction.options.get("amount").value) < 1) {
			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You must delete at least one message!");
			return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					interaction.deleteReply()
				}, 5000);
			});
		}

		interaction.channel.bulkDelete(Number(interaction.options.get("amount").value), true).then(async (collection) => {
			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.setDescription(`Successfully cleared \`${collection.size}\` messages! *Note: Some messages may have not been cleared since they are older than 14 days old.*`)
	
			interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });

		}).catch((err) => {
			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${err}\`\`\``)

			return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					console.error(err);
					interaction.deleteReply()
				}, 5000);
			});
		});
	},
};
