const colors = require("../../tools/colors.json");

module.exports = {
	name: "nickname",
	aliases: [],
	description: "Sets the mentioned user's nickname to the specified nickname",
	options: [
		{ name: "user", description: "The user you want to nickname", type: "USER", required: true },
		{ name: "nickname", description: "The new nickname for the user - leave blank to get rid of a nickname", type: "STRING", required: false },
	],
	defaultPermission: true,
	usage: "",
	example: "nickname @ultimate_hecker Mr. Hecker",
	notes: "You must mention the user you want to kick",
	async execute(client, message, args, Discord, prefix) {

		await message.channel.sendTyping();

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Successfully Renamed",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		if (!message.member.permissions.has("ADMINISTRATOR")) {
			const embed = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You do not have permission to set the nickname of others!")

			return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
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

		if (member.permissions.has("ADMINISTRATOR") && user.id !== "860552124064202812") {
			const permsEmbed = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You cannot nickname a moderator!")

			return message.reply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
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
			const embed = new Discord.MessageEmbed()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.setDescription(`Name changed from \`${prevName === null || prevName === "" ? "None" : prevName}\` to \`${nicknameSet.join(" ") === null || nicknameSet.join(" ") === "" ? "None" : nicknameSet.join(" ")}\``)

			message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
		}).catch(async (err) => {
			if (err == "DiscordAPIError: Missing Permissions") {
				const errPermsEmbed = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("Uh oh! I don't have permission to nickname this user!")

				return message.reply({ embeds: [errPermsEmbed] }).then(() => {
					setTimeout(function() {
						sent.delete();
					}, 5000);
				});
			} else {
				const errEmbed = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`I was unable to change the member's nickname because: \n \`${err}\``)

				return message.reply({ embeds: [errEmbed], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						sent.delete();
					}, 5000);
				});
			}
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
				.setDescription("You do not have permission to set the nickname of others!")

			return interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
                setTimeout(function() {
                    interaction.deleteReply()
                }, 5000);
            });
		}

		let user = interaction.options.get("user").user;
		const member = interaction.options.get("user").member;

		if (member.permissions.has("ADMINISTRATOR") && user.id !== "860552124064202812") {
			const permsEmbed = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("You cannot nickname a moderator!")

			return interaction.editReply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } }).then(() => {
                setTimeout(function() {
                    interaction.deleteReply()
                }, 5000);
            });
		}

		const prevName = member.nickname;

		member.setNickname(interaction.options.get("nickname")?.value ?? null).then(() => {
			const embed = new Discord.MessageEmbed()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.setDescription(`Name changed from \`${prevName === null || prevName === "" ? "None" : prevName}\` to \`${interaction.options.get("nickname")?.value ?? "None"}\``)

			interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
		})
		.catch(async (err) => {
			if (err == "DiscordAPIError: Missing Permissions") {
				const errPermsEmbed = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("Uh oh! I don't have permission to nickname this user!")

				return interaction.editReply({ embeds: [errPermsEmbed], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						interaction.deleteReply()
					}, 5000);
				});
			} else {
				const errEmbed = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`I was unable to change the member's nickname because: \n \`${err}\``)

				return interaction.editReply({ embeds: [errEmbed], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						interaction.deleteReply()
					}, 5000);
				});
			}
		});
	}
};
