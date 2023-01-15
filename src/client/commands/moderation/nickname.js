const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const colors = require("../../tools/colors.json");

module.exports = {
	name: "nickname",
	aliases: [],
	description: "Sets the mentioned user's nickname to the specified nickname",
	options: [
		{
			name: "user",
			description: "The user you want to nickname",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: "nickname",
			description: "The new nickname for the user - leave blank to get rid of a nickname",
			type: ApplicationCommandOptionType.String,
			required: false,
		},
	],
	defaultPermission: true,
	usage: 'nickname (user) [nickname]',
	example: "nickname @ultimate_hecker Hecker-Kitty",
	async execute(client, message, args, Discord) {

		await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "Successfully Nicknamed",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }
		
		if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You do not have permission to set the nickname of others!");

			return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then((sent) => {
				setTimeout(() => {
					sent.delete();
				}, 5000);
			});
		}
		if (!args[1]) args[1] === null;

		let user = message.mentions.users.first();

		if (!user) {
			user = client.utils.resolveTag(message.guild, args[0]);
			if (!user) {
				user = client.user;
				args[1] = args[0];
			}
		}

		const member = message.guild.members.resolve(user);

		if (member.permissions.has(PermissionFlagsBits.Administrator) && user.id !== "923947315063062529") {
			const permsEmbed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You cannot nickname a moderator!")

			return message.reply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } }).then((sent) => {
				setTimeout(() => {
					sent.delete();
				}, 5000);
			});
		}

		const prevName = member.nickname;

		const nicknameFunc = (args) => {
			args.shift();
			return args;
		};

		const nicknameSet = nicknameFunc(args);

		member.setNickname(nicknameSet.join(" ")).then(() => {
			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.setDescription(`Name changed from \`${prevName === null || prevName === "" ? "None" : prevName}\` to \`${nicknameSet.join(" ") === null || nicknameSet.join(" ") === "" ? "None" : nicknameSet.join(" ")}\``);

			message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
		}).catch(async (err) => {
			if (err == "DiscordAPIError: Missing Permissions") {
				const errPermsEmbed = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("I don't have permission to nickname this user!")

				return message.reply({ embeds: [errPermsEmbed], allowedMentions: { repliedUser: true } }).then((sent) => {
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
				.setDescription("You do not have permission to set the nickname of others!");

			return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then((sent) => {
				setTimeout(() => {
					sent.delete();
				}, 5000);
			});
		}

		let user = interaction.options.get("user").user;

		const member = interaction.options.get("user").member;

		if (member.permissions.has(PermissionFlagsBits.Administrator) && user.id !== "923947315063062529") {
			const permsEmbed = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You cannot nickname a moderator!")

			return interaction.editReply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } }).then((sent) => {
				setTimeout(() => {
					sent.delete();
				}, 5000);
			});
		}

		const prevName = member.nickname;

		member.setNickname(interaction.options.get("nickname")?.value ?? null).then(() => {
			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.setDescription(`Name changed from \`${prevName === null || prevName === "" ? "None" : prevName}\` to \`${interaction.options.get("nickname")?.value ?? "None"}\``);

			interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
		}).catch(async (err) => {
			if (err == "DiscordAPIError: Missing Permissions") {
				const errPermsEmbed = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("Uh oh! I don't have permission to nickname this user!")

				return interaction.editReply({ embeds: [errPermsEmbed], allowedMentions: { repliedUser: true } }).then((sent) => {
					setTimeout(() => {
						sent.delete();
					}, 5000);
				});
			} else {
				const errEmbed = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${err}\`\`\``);

				return interaction.editReply({ embeds: [errEmbed], allowedMentions: { repliedUser: true } }).then((sent) => {
					setTimeout(() => {
						sent.delete();
					}, 5000);
				});
			}
		});
	},
};
