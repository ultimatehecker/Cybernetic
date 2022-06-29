const colors = require("../../tools/colors.json");

module.exports = {
	name: "welcomemessage",
	aliases: [],
	description: "Change the server's message for when a memeber joins",
	options: [
		{ name: "channel", description: "The channel that the message should be sent in", type: "CHANNEL", required: true },
		{ name: "message", description: '{tag}, {name}, and {mention} are valid placeholders - "none" to turn off welcome messages', type: "STRING", required: true },
	],
	usage: 'welcomemessage (channel) (welcomemessage)',
	example:'welcomemessage #welcome "Welcome, {member-mention}!',
	notes: 'If you want to disable welcome messages, you can just run the command how it is',
	async execute(client, message, args, Discord, prefix, serverDoc) {

		await message.channel.sendTyping();

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Success",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		if (args.length === 0) {
			if (serverDoc.welcomeChannelID !== "none") {
				client.utils.updateServer(client, message.guild.id, {
					welcomeChannelID: "none",
				});

				const embed = new Discord.MessageEmbed()
					.setAuthor(authorSuccess)
					.setColor(colors["MainColor"])
					.setDescription("Welcome messages are now toggled off. To turn them on again, run this command with the appropriate arguments.");

				return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
			} else {
				const embed = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("Welcome messages are currently toggled off. To turn them on, run this command with the appropriate arguments.");

				return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then((sent) => {
					setTimeout(() => {
						sent.delete();
					}, 5000);
				});
			}
		}

		let welcomeChannelID = args.shift();
		let welcomeChannel = message.guild.channels.cache.find(
			(ch) => ch.name === welcomeChannelID
		);
		if (!welcomeChannel) {
			const channelRegex = /<#\d{18}>/;
			if (channelRegex.test(welcomeChannelID)) {
				welcomeChannel = message.guild.channels.resolve(
					welcomeChannelID.slice(2, welcomeChannelID.length - 1)
				);
			} else {
				const embed = new Discord.MessageEmbed()
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

		const welcomeMessage = args.join(" ");
		if (welcomeMessage === "") {
			const embed = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("Please enter a welcome message! If you want to turn welcome messages off, just send this command with no arguments.");

			return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then((sent) => {
				setTimeout(() => {
					sent.delete();
				}, 5000);
			});
		}

		client.utils.updateServer(client, message.guild.id, {
				welcomeMessage: welcomeMessage,
				welcomeChannelID: welcomeChannel.id,
		}).then(() => {
			const successEmbed = new Discord.MessageEmbed()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.setDescription(`Server welcome message successfully changed to \`${welcomeMessage}\` in channel \`#${welcomeChannel.name}\``);

			return message.reply({ embeds: [successEmbed], allowedMentions: { repliedUser: true } });
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
			if (serverDoc.welcomeChannelID !== "none") {
				client.utils.updateServer(client, interaction.guild.id, {
					welcomeChannelID: "none",
				});

				const embed = new Discord.MessageEmbed()
					.setAuthor(authorSuccess)
					.setColor(colors["MainColor"])
					.setDescription("Welcome messages are now toggled off. To turn them on again, run this command with the appropriate arguments.");

				return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
			} else {
				const embed = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("Welcome messages are currently toggled off. To turn them on, run this command with the appropriate arguments.");

				return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						interaction.deleteReply()
					}, 5000);
				});
			}
		}

		let welcomeChannel = interaction.options.get("channel").channel;

		if (!welcomeChannel.isText()) {
			const embed = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("This is not a valid text channel!");

			return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
                setTimeout(function() {
                    interaction.deleteReply()
                }, 5000);
            });
		}

		const welcomeMessage = interaction.options.get("message").value;

		client.utils.updateServer(client, interaction.guild.id, {
				welcomeMessage: welcomeMessage,
				welcomeChannelID: welcomeChannel.id,
		}).then(() => {
			const successEmbed = new Discord.MessageEmbed()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.setDescription(`Server welcome message successfully changed to \`${welcomeMessage}\` in channel \`#${welcomeChannel.name}\``);

			interaction.editReply({ embeds: [successEmbed], allowedMentions: { repliedUser: true } });
		});
},
};
