const colors = require("../../tools/colors.json");

module.exports = {
	name: "clear",
	aliases: ["purge"],
	description: "Clears the amount of messages that are specified",
	defaultPermission: true,
	options: [
		{
			name: "amount",
			description: "The number of messages you want to clear",
			type: "STRING",
			required: true,
		},
	],
	usage: 'clear (amount)',
	example: "clear 100",
	async execute(client, message, args, Discord, prefix) {

		await message.channel.sendTyping()

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Successfully Cleared",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		if (!message.member.permissions.has("ADMINISTRATOR")) {
			const invalidperms = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You do not have permission to clear messages!")
			return message.reply({ embeds: [invalidperms], allowedMentions: { repliedUser: true } });
		}

		if (!args[0]) {
			const message404 = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("Please enter the amount of messages you wish to clear!")
			return message.reply({ embeds: [message404], allowedMentions: { repliedUser: true } });
		}

		if (isNaN(args[0])) {
			if (args[0] === "all") {
				message.channel.clone({ position: message.channel.rawPosition, reason: "Clearing channel message history" }).then((newChannel) => {
					const embed = new Discord.MessageEmbed()
						.setAuthor(authorSuccess)
						.setColor(colors["MainColor"])
						.setDescription(`Channel message history successfully cleared! \n \n *This message will be deleted after 5 seconds*`)

					newChannel.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then((sent) => {
						setTimeout(() => {
							sent.delete();
						}, 5000);
					});
				});

				message.channel.delete({ reason: "Clearing channel message history" });
				return;
			} else {
				const embed = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("Please enter an actual number!")
				return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
			}
		}

		if (args[0] > 100) {
			const embed = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`You are not able to delete over 100 messages at a time! Although, you can do \`${prefix}clear all\` to clear the channel history. Click below to learn why: \n https://stackoverflow.com/questions/54931470/how-can-i-delete-more-than-100-messages-at-once`)
			return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
		}

		if (args[0] < 1) {
			const embed = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You must delete at least one message!");
			return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
		}

		message.delete().then(() => {
			message.channel.bulkDelete(args[0], true).then(async (collection) => {
				const embed = new Discord.MessageEmbed()
					.setAuthor(authorSuccess)
					.setColor(colors["MainColor"])
					.setDescription(`Successfully cleared \`${collection.size}\` messages! \n \n *This message will be deleted after 5 seconds*`)

					message.channel.send({ embeds: [embed] }).then((sent) => {
						setTimeout(() => {
							sent.delete();
						}, 5000);
					});
			}).catch((err) => {
				const embed = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("At this time, you cannot delete messages that are over 14 days old! Click below to learn why: \n https://wiki.dyno.gg/en/purge-14-day")
					
				message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
				console.error(err);
				return;
			});
		});
	},
	async slashExecute(client, Discord, interaction) {

		await interaction.deferReply({ ephemeral: false });

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Successfully Cleared",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		if (!interaction.member.permissions.has("ADMINISTRATOR")) {
			const embed = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You do not have permission to clear messages!")

			return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
		}

		if (!Number.isInteger(Number(interaction.options.get("amount").value))) {
			if (interaction.options.get("amount").value === "all") {
				interaction.channel.clone({ position: interaction.channel.rawPosition, reason: "Clearing channel message history" }).then((newChannel) => {
					const embed = new Discord.MessageEmbed()
						.setAuthor(authorSuccess)
						.setColor(colors["MainColor"])
						.setDescription(`Channel message history successfully cleared! \n \n *This message will be deleted after 5 seconds*`);

						newChannel.reply({ embeds: [embed] }).then((sent) => {
							setTimeout(() => {
								sent.delete();
							}, 5000);
						});
					});
				interaction.channel.delete({ reason: "Clearing channel message history" });
				return;
			} else {
				const embed = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("Please enter a valid integer!")
				return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
			}
		}

		if (Number(interaction.options.get("amount").value) > 100) {
			const embed = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`You are not able to delete over 100 messages at a time! Although, you can do \`/clear all\` to clear the channel history. Click below to learn why: \n https://stackoverflow.com/questions/54931470/how-can-i-delete-more-than-100-messages-at-once`)
			return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
		}

		if (Number(interaction.options.get("amount").value) < 1) {
			const embed = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You must delete at least one message!");
			return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
		}

		interaction.channel.bulkDelete(Number(interaction.options.get("amount").value), true).then(async (collection) => {
			const embed = new Discord.MessageEmbed()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.setDescription(`Successfully cleared \`${collection.size}\` messages! *Note: Some messages may have not been cleared since they are older than 14 days old. Click below to learn why:* \n https://wiki.dyno.gg/en/purge-14-day`)

			interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
		}).catch((err) => {
			console.error(err);
			const embed = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("An error occured while clearing the messages.")

			interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
			console.error(err)
			return;
		});
	},
};
