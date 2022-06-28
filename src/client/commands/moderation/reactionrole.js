const colors = require("../../tools/colors.json");

module.exports = {
	name: "reactionrole",
	aliases: ["rr"],
	description: "Instantiates a new reaction role",
	options: [
		{ name: "emoji", description: "The emoji users should react to receive the role", type: "STRING", required: true },
		{ name: "role", description: "The role users will receive when they react", type: "ROLE", required: true },
		{ name: "message", description: "The message I should send that users will react on", type: "STRING", required: true },
	],
	defaultPermission: true,
	usage: "poll (emoji) (role name) (message to send)",
	example: "reactionrole ⏰ Notify React to get notified!",
	notes: "Message will be sent in channel that the command is sent in",
	async execute(client, message, args, Discord, prefix, serverDoc) {

		await message.channel.sendTyping();

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Successfully Created",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
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
				const embed = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`A required argument was not provided: \`${field}\``)
					
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
			const embed = new Discord.MessageEmbed()
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

		const successEmbed = new Discord.MessageEmbed()
			.setAuthor(authorSuccess)
			.setColor(colors["MainColor"])
			.setDescription("Reaction role added!");

		message.reply({ embeds: [successEmbed], allowedMentions: { repliedUser: true } }).then((sent) => {
			setTimeout(() => {
				sent.delete();
			}, 5000);
		});
	},
	async slashExecute(client, Discord, interaction, serverDoc) {

		await interaction.deferReply({ ephemeral: true });

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Successfully Cleared",
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
			sentsent.delete();;

			const embed = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("Invalid emoji")

			return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
                setTimeout(function() {
                    interaction.deleteReply()
                }, 5000);
            });
		}

		const successEmbed = new Discord.MessageEmbed()
			.setAuthor(authorSuccess)
			.setColor(colors["MainColor"])
			.setDescription("Reaction role added!")

		interaction.editReply({ embeds: [successEmbed], allowedMentions: { repliedUser: true } }).then(() => {
			setTimeout(function() {
				interaction.deleteReply()
			}, 5000);
		});
	}
};
