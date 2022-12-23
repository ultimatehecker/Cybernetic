const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const colors = require("../../tools/colors.json");

module.exports = {
	name: "warn",
	aliases: [],
	description: "Warn the specified user for the specified reason",
	options: [
		{
			name: "user",
			type: ApplicationCommandOptionType.User,
			description: "The user you wish to warn",
			required: true,
		},
		{
			name: "warning",
			type: ApplicationCommandOptionType.String,
			description: 'The message to warn the user for - defaults to "warned by <your tag>"',
			required: false,
		},
	],
	defaultPermission: true,
	usage: "warn (user) [warning]",
	example: "warn @ultimate_hecker spamming",
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

		const embed = new Discord.EmbedBuilder()
			.setAuthor(authorError)
			.setColor(colors["ErrorColor"])
			.setDescription("At this moment, the message based command is not functional due to the complexity. This will be fixed in Cybernetic 0.5.1, but for the moment, please use the new slash commands.");

		return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });

		/*

		let user = message.mentions.users.first();

		if (!user) {
			user = client.utils.resolveTag(message.guild, args[0]);
		}

		const member = message.guild.members.resolve(user);

		if (member.permissions.has(PermissionFlagsBits.Administrator)) {
			const permsEmbed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You cannot mute a moderator!")

			return message.reply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } }).then((sent) => {
				setTimeout(() => {
					sent.delete();
				}, 5000);
			});
		}

		const warner = message.guild.members.resolve(message.author);

		if (member) {
			if (!warner.permissions.has(PermissionFlagsBits.MuteMembers)) {
				const permsEmbed = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("You do not have permissions to mute!")

				return message.reply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } }).then((sent) => {
					setTimeout(() => {
						sent.delete();
					}, 5000);
				});
			}
		}

		let userDoc = await client.utils.loadUserInfo(client, serverDoc, user.user.id);

		const embed = new Discord.EmbedBuilder()
			.setAuthor(authorSuccess)
			.setColor(colors["MainColor"])
			.setDescription(`Successfully warned \`${warner.tag}\` for \`${reason ?? `User warned by ${user.tag}`}\``);

		message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });

		*/
	},
	async slashExecute(client, Discord, interaction, serverDoc) {
		
		await interaction.deferReply({ emphemeral: false });

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Success",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		let user = interaction.options.get("user");

		if (user.member.permissions.has(PermissionFlagsBits.Administrator)) {
			const permsEmbed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You cannot warn a moderator!")

			return interaction.editReply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					interaction.deleteReply()
				}, 5000);
			});
		}

		if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
			const permsEmbed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You do not have permission to warn!")

			return interaction.editReply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					interaction.deleteReply()
				}, 5000);
			});
		}

		let userDoc = await client.utils.loadUserInfo(client, serverDoc, user.user.id);

		userDoc.infractions.push({
			modID: interaction.user.id,
			modTag: interaction.user.tag,
			type: "Warning",
			timestamp: interaction.createdTimestamp,
			message: interaction.options.get("warning")?.value ?? `User warned by ${interaction.user.tag}`,
		});

		client.utils.updateUser(client, serverDoc.guildID, userDoc.userID, {
			...userDoc.toObject(),
			infractions: userDoc.infractions,
		});

		const warnedEmbed = new Discord.EmbedBuilder()
			.setAuthor(authorSuccess)
			.setColor(colors["MainColor"])
			.setDescription(`You have been warned in **${interaction.guild.name}** for \`${interaction.options.get("reason")?.value ?? `User banned by ${interaction.user.tag}`}\``);

		user.user.send({ embeds: [warnedEmbed], allowedMentions: { repliedUser: true } });

		const embed = new Discord.EmbedBuilder()
			.setAuthor(authorSuccess)
			.setColor(colors["MainColor"])
			.setDescription(`Successfully warned \`${user.user.tag}\` for \`${interaction.options.get("warning")?.value ?? `User warned by ${interaction.user.tag}`}\``);

		interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
	},
};
