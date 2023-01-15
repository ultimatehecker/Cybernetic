const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const colors = require("../../tools/colors.json");

module.exports = {
	name: "infractions",
	aliases: [],
	description: "Displays the infractions for the specified user",
	options: [
		{
			name: "user",
			description: "The user you wish to view",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
	],
	defaultPermission: true,
	usage: 'infractions (user)',
	example: "infractions @ultimate_hecker",
	async execute(client, message, args, Discord, prefix, serverDoc) {

		await message.channel.sendTyping()

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Infractions",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		let user = message.mentions.users.first();
		const member = message.guild.members.resolve(user);

		if (!user) {
			user = client.utils.resolveTag(message.guild, args[0]);
		}

		if (member.permissions.has(PermissionFlagsBits.Administrator)) {
			const permsEmbed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("Moderators cannot have infractions!")
			return message.reply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } }).then((sent) => {
				setTimeout(() => {
					sent.delete();
				}, 5000);
			});
		}

		if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
			const permsEmbed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You do not have permission to view infractions!")
			return message.reply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } }).then((sent) => {
				setTimeout(() => {
					sent.delete();
				}, 5000);
			});
		}

		const userDoc = await client.utils.loadUserInfo(client, serverDoc, user.id);

		const embed = new Discord.EmbedBuilder()
			.setAuthor(authorSuccess)
			.setTitle(`${user.tag}`)
			.setColor(colors["MainColor"])

		if (userDoc.infractions.length > 0) {
			for (let infraction of userDoc.infractions) {
				let timestamp = new Date(infraction.timestamp);
				embed.addFields([
					{ name: `\`${timestamp.getUTCMonth()}/${timestamp.getUTCDate()}/${timestamp.getUTCFullYear()}\` - ${infraction.type} from ${infraction.modTag}`, value: `${infraction.message}`, required: true, inline: true }
				]);
			}
		} else {
			embed.setDescription("The specified user has no infractions!");
		}

		message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });

	},
	async slashExecute(client, Discord, interaction, serverDoc) {
		
		await interaction.deferReply({ emphemeral: false });

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Infractions",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		let user = interaction.options.get("user");

		if (user.member.permissions.has(PermissionFlagsBits.Administrator)) {
			const permsEmbed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("Moderators cannot have infractions!")

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
				.setDescription("You do not have permission to view infractions!")

			return interaction.editReply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					interaction.deleteReply()
				}, 5000);
			});
		}

		const userDoc = await client.utils.loadUserInfo(client, serverDoc, user.user.id);

		const embed = new Discord.EmbedBuilder()
			.setAuthor(authorSuccess)
			.setTitle(`${user.user.tag}`)
			.setColor(colors["MainColor"])

		if (userDoc.infractions.length > 0) {
			for (let infraction of userDoc.infractions) {
				let timestamp = new Date(infraction.timestamp);
				embed.addFields([
					{ name: `\`${timestamp.getUTCMonth()}/${timestamp.getUTCDate()}/${timestamp.getUTCFullYear()}\` - ${infraction.type} from ${infraction.modTag}`, value: `\`${infraction.message}\``, required: true, inline: true }
				]);
			}
		} else {
			embed.setDescription("The specified user has no infractions!");
		}

		interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
	},
};
