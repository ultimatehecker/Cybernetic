const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const colors = require("../../tools/colors.json");

module.exports = {
	name: "reactionrole",
	aliases: ["rr"],
	description: "Instantiates a new reaction role",
	options: [
		{
			name: "emoji",
			description: "The emoji users should react to receive the role",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
		{
			name: "role",
			description: "The role users will receive when they react",
			type: ApplicationCommandOptionType.Role,
			required: true,
		},
		{
			name: "message",
			description: "The message I should send that users will react on",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],
	defaultPermission: true,
	usage: 'reactionrole (emoji) (role) (message)',
	example: "reactionrole ⏰ Ping React to get pinged!",
	notes: "Message will be sent in channel that the command is sent in.",
	async execute(client, message, args, Discord, prefix, serverDoc) {

		await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "Server Information",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }
		
		const reactionChannel = message.channel;
		const emoji = args.shift();
		const roleName = args.shift();
		const messageSend = args.join(" ");

		const checkObj = {
			emoji: emoji,
			role_name: roleName,
			message_to_send: messageSend,
		};

		for (let field in checkObj) {
			if (!checkObj[field]) {
				const embed = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`A required argument was not provided: \`${field}\``);
				return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then((sent) => {
					setTimeout(() => {
						sent.delete();
					}, 5000);
				});
			}
		}

		await message.guild.roles.fetch();

		let roleCheck = await message.guild.roles.cache.find(
			(role) => role.name === roleName
		);

		if (!roleCheck) {
			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("That role does not exist!");

			return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then((sent) => {
				setTimeout(() => {
					sent.delete();
				}, 5000);
			});
		}

		let sentMessage;

		await reactionChannel.send({ content: messageSend }).then((sent) => {
			sentMessage = sent;
			serverDoc.reactionRoles.push([roleName, emoji, sent.id]);
			serverDoc.markModified("reactionRoles");
		});

		await client.utils.updateServer(client, serverDoc.guildID, {
			reactionRoles: serverDoc.reactionRoles,
		});

		sentMessage.react(emoji);

		const successEmbed = new Discord.EmbedBuilder()
			.setAuthor(authorSuccess)
			.setColor(colors["MainColor"])
			.setDescription("Reaction role added! *This message will auto-delete in 3 seconds*");

		message.channel.send({ embeds: [successEmbed], allowedMentions: { repliedUser: true } }).then((sent) => {
			setTimeout(() => {
				sent.delete();
			}, 3000);
		});
	},
	async slashExecute(client, Discord, interaction, serverDoc) {
		
		await interaction.deferReply({ emphemeral: false });
    
        let authorSuccess = {
            name: "Success",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		const reactionChannel = interaction.channel;
		const emoji = interaction.options.get("emoji").value;
		const role = interaction.options.get("role").role;
		const messageSend = interaction.options.get("message").value;

		let sentMessage;

		await reactionChannel.send({ content: messageSend }).then((sent) => {
			sentMessage = sent;
			serverDoc.reactionRoles.push([role.name, emoji, sent.id]);
			serverDoc.markModified("reactionRoles");
		});

		await client.utils.updateServer(client, serverDoc.guildID, {
			reactionRoles: serverDoc.reactionRoles,
		});

		try {
			await sentMessage.react(emoji);
		} catch {
			sentMessage.delete();

			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("Invalid emoji");

			return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					interaction.deleteReply()
				}, 5000);
			});
		}

		try {
			const successEmbed = new Discord.EmbedBuilder()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.setDescription("Reaction role added! *This message will auto-delete in 3 seconds*");

			interaction.editReply({ embeds: [successEmbed], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					interaction.deleteReply()
				}, 3000);
			});
		} catch(err) {
			if(err = "Missing Permissions") {
				const embed = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`I do not have the permissions to reactionrole these users`);

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

				return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						console.error(err)
						interaction.deleteReply()
					}, 5000);
				});
			}
		}
	},
};
