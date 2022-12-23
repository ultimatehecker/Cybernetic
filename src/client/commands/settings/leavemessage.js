const colors = require("../../tools/colors.json");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "leavemessage",
	aliases: [],
	description: "Change the server's message for when a member leaves",
	options: [
		{ 
			name: "channel", 
			description: "The channel that the message should be sent in", 
			type: ApplicationCommandOptionType.Channel, 
			required: false 
		},
		{ 
			name: "message", 
			description: '{tag} and {name} are valid placeholders - "none" to turn off leave messages', 
			type: ApplicationCommandOptionType.String, 
			required: false 
		},
	],
	usage: 'leavemessage [channel] [leavemessage]',
	example: 'leavemessage #goodbye "Goodbye, {member-tag}"',
	notes: 'If you want to disable leave messages, you can just run the command without any arguments',
	async execute(client, message, args, Discord, prefix, serverDoc) {

		await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Successs",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		if (args.length === 0) {
			if (serverDoc.leaveChannelID !== "none") {
				client.utils.updateServer(client, message.guild.id, {
					leaveChannelID: "none",
				});

				const embed = new Discord.EmbedBuilder()
					.setAuthor(authorSuccess)
					.setColor(colors["MainColor"])
					.setDescription("Leave messages are now toggled off. To turn them on again, run this command with the appropriate arguments.");

				return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } })
			} else {
				const embed = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("Leave messages are currently toggled off. To turn them on, run this command with the appropriate arguments.");

				return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then((sent) => {
					setTimeout(() => {
						sent.delete();
					}, 5000);
				});
			}
		}

		let leaveChannelID = args.shift();
		let leaveChannel = message.guild.channels.cache.find((ch) => ch.name === leaveChannelID);

		if (!leaveChannel) {
			const channelRegex = /<#\d{18}>/;
			if (channelRegex.test(leaveChannelID)) {
				leaveChannel = message.guild.channels.resolve(leaveChannelID.slice(2, leaveChannelID.length - 1));
				leaveChannelID = leaveChannel.id;
			} else {
				const embed = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("That is not a valid channel name!");

				return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then((sent) => {
					setTimeout(() => {
						sent.delete();
					}, 5000);
				});
			}
		}

		if (!leaveChannel.isTextBased()) {
			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("This is not a valid text channel!");

			return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then((sent) => {
				setTimeout(function() {
					sent.delete()
				}, 5000);
			});
		}

		const leaveMessage = args.join(" ");

		client.utils.updateServer(client, message.guild.id, serverDoc, {
			leaveMessage: leaveMessage,
			leaveChannelID: leaveChannel.id,
		}).then(() => {
			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.setDescription(`Server leave message successfully changed to \`${leaveMessage}\` in channel \`#${leaveChannel.name}\``);

			return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
		});
	},
	async slashExecute(client, Discord, interaction, serverDoc) {

		await interaction.deferReply({ ephemeral: false });

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Success",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		if (interaction.options.get("message").value === "none") {
			if (serverDoc.leaveChannelID !== "none") {
				client.utils.updateServer(client, interaction.guild.id, {
					leaveChannelID: "none",
				});

				const embed = new Discord.EmbedBuilder()
					.setAuthor(authorSuccess)
					.setColor(colors["MainColor"])
					.setDescription("Leave messages are now toggled off. To turn them on again, run this command with the appropriate arguments.");

				return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
			} else {
				const embed = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("Leave messages are currently toggled off. To turn them on, run this command with the appropriate arguments.");

				return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						interaction.deleteReply()
					}, 5000);
				});
			}
		}

		let leaveChannel = interaction.options.get("channel").channel;

		if (!leaveChannel.isTextBased()) {
			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("This is not a valid text channel!");

			return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					interaction.deleteReply()
				}, 5000);
			});
		}

		const leaveMessage = interaction.options.get("message").value;

		client.utils.updateServer(client, interaction.guild.id, {
			leaveMessage: leaveMessage,
			leaveChannelID: leaveChannel.id,
		}).then(() => {
			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.setDescription(`Server leave message successfully changed to \`${leaveMessage}\` in channel \`#${leaveChannel.name}\``);

			interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
		});
	},
};
