const { hypixel, errors } = require('../../schemas/hypixel');
const commaNumber = require('comma-number');
const User = require('../../schemas/user');
const colors = require("../../tools/colors.json");
const { ApplicationCommandOptionType, GuildMember } = require("discord.js");

module.exports = {
	name: "guild",
	aliases: ["g"],
	description: "Shows the statistics of a average Hypixel Guild!",
	options: [
		{
			name: "guild",
			description: "Shows the statistics of an average Hypixel Guild!",
			required: true,
			type: ApplicationCommandOptionType.String
		}
	],
	defaultPermission: true,
	usage: "guild [Guild]",
	example: "guild Dragons of War",
	async execute(client, message, args, Discord, prefix) {

		await message.channel.sendTyping();

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "Guild Statistics",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

		let guildName = args.join(" "); // for guilds with spaces in name
		
		if (!args[0]) {
			// if someone didn't type in guild name
			const guildArg404 = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`You need to type in a guild's name! (Not guild tag, but guild name.) (Example: \`${prefix}guild Dragons of War\`)`)
			return message.reply({embeds: [guildArg404], allowedMentions: { repliedUser: true } }).then((sent) => {
				setTimeout(function() {
					sent.delete();
				}, 5000);
			});
		}

		hypixel.getGuild("name", guildName).then(async (guild) => {
			const guildInfoEmbed = new Discord.EmbedBuilder()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.addFields([
					{ name: `Guild Info`, value: `\`•\` **Name**: \`${commaNumber(guild.name)}\` \n \`•\` **Level**: \`${commaNumber(guild.level)}\` \n \`•\` **Members**: \`${commaNumber(guild.members.length)}\` \n \`•\` **Created**: \`${commaNumber(guild.createdAt)}\``, required: true, inline: true },
					{ name: `General Stats`, value: `\`•\` **Experince**: \`${commaNumber(guild.experience)}\` \n \`•\` **Joinable**: \`${commaNumber(guild.joinable)}\` \n \`•\` **Publicly Listed**: \`${commaNumber(guild.publiclyListed)}\``, required: true, inline: true },
					{ name: `Activity`, value: `\`•\` **Guild Master**: \`${commaNumber(guild.guildMaster)}\` \n \`•\` **Daily History**: \`${commaNumber(guild.expHistory.exp)}\` \n \`•\` **Weekly GXP**: \`${commaNumber(guild.totalWeeklyGexp)}\``, required: true, inline: true },
				]);

				if (guild.description !== null) {
					guildInfoEmbed.addField("Description", guild.description)
					guildInfoEmbed.addFields([
						{ name: `Description`, value: `\`${guild.description}\``, required: true, inline: true },
					]);
				}

				let arr = [];
				for (let i = 0; i < guild.expHistory.length; i++) {
					let exp = `\`•\` ${guild.expHistory[i].day}: \`${commaNumber(JSON.stringify(guild.expHistory[i].exp))}\``;
					arr.push(exp);
				 }

				guildInfoEmbed.addFields([
					{ name: `GEXP History`, value: `\`${arr[0]}\n${arr[1]}\n${arr[2]}\n${arr[3]}\n${arr[4]}\n${arr[5]}\n${arr[6]}\n\``, required: true, inline: true },
				]);

				if (guild.tag !== null) {
					guildInfoEmbed.setTitle(`${guild.name} [${guild.tag}]`)
				} else {
					guildInfoEmbed.setTitle(`${guild.name}`)
				}

			message.reply({embeds: [guildInfoEmbed], allowedMentions: { repliedUser: true } }).then((sent) => {
				setTimeout(function() {
					sent.delete();
				}, 5000);
			});
		}).catch((e) => {
			if (e.message === errors.GUILD_DOES_NOT_EXIST) {
				const guild404 = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("I could not find that guild in the API. Check spelling and name history.")
				return message.reply({ embeds: [guild404], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        sent.delete();
                    }, 5000);
                });
			} else {
				const error = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${e}\`\`\``)
				console.error(e);
				return message.reply({ embeds: [error], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        sent.delete();
                    }, 5000);
                });
			}
		});
	},
	async slashExecute(client, Discord, interaction, serverDoc) {

		await interaction.deferReply({ ephemeral: false });

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "Guild Statistics",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

		let guildName = interaction.options.get("guild")?.value // for guilds with spaces in name

        const data = await User.findOne({
            id: interaction.user.id
        });

        if (!data && !interaction.options.get("guild")) { // if someone didn't type in ign
            const ign404 = new Discord.EmbedBuilder()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescription(`You need to type in a guild's name! (Example: \`${serverDoc.prefix}guild Dragons of War\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${serverDoc.prefix}link ultimate_hecker\`)`)
            return interaction.editReply({ embeds: [ign404], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					interaction.deleteReply()
				}, 5000);
			});
        }

		hypixel.getGuild("name", guildName).then(async (guild) => {
			const guildInfoEmbed = new Discord.EmbedBuilder()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.addFields([
					{ name: `Guild Info`, value: `\`•\` **Name**: \`${commaNumber(guild.name)}\` \n \`•\` **Level**: \`${commaNumber(guild.level)}\` \n \`•\` **Members**: \`${commaNumber(guild.members)}\` \n \`•\` **Created**: \`${commaNumber(guild.createdAt)}\``, required: true, inline: true },
					{ name: `General Stats`, value: `\`•\` **Experince**: \`${commaNumber(guild.experience)}\` \n \`•\` **Preferred Games**: \`${commaNumber(guild.preferredGames)}\` \n \`•\` **Joinable**: \`${commaNumber(guild.joinable)}\` \n \`•\` **Publicly Listed**: \`${commaNumber(guild.publiclyListed)}\``, required: true, inline: true },
					{ name: `Activity`, value: `\`•\` **Guild Master**: \`${commaNumber(guild.guildMaster)}\` \n \`•\` **Daily History**: \`${commaNumber(guild.expHistory.exp)}\` \n \`•\` **Weekly GXP**: \`${commaNumber(guild.totalWeeklyGexp)}\``, required: true, inline: true },
				]);

				if (guild.description !== null) {
					guildInfoEmbed.addField("Description", guild.description)
					guildInfoEmbed.addFields([
						{ name: `Description`, value: `\`${guild.description}\``, required: true, inline: true },
					]);
				}

				let arr = [];
				for (let i = 0; i < guild.expHistory.length; i++) {
					let exp = `\`•\` ${guild.expHistory[i].day}: \`${commaNumber(JSON.stringify(guild.expHistory[i].exp))}\``;
					arr.push(exp);
				 }

				guildInfoEmbed.addFields([
					{ name: `GEXP History`, value: `\`${arr[0]}\n${arr[1]}\n${arr[2]}\n${arr[3]}\n${arr[4]}\n${arr[5]}\n${arr[6]}\n\``, required: true, inline: true },
				]);

				if (guild.tag !== null) {
					guildInfoEmbed.setTitle(`${guild.name} [${guild.tag}]`)
				} else {
					guildInfoEmbed.setTitle(`${guild.name}`)
				}

			interaction.editReply({ embeds: [guildInfoEmbed], allowedMentions: { repliedUser: true } });
		}).catch((e) => {
			if (e.message === errors.GUILD_DOES_NOT_EXIST) {
				const guild404 = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("I could not find that guild in the API. Check spelling and name history.")
				return interaction.reply({ embeds: [guild404], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
			} else {
				const error = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${e}\`\`\``)
				console.error(e);
				return interaction.reply({ embeds: [error], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
			}
		});
	}
};
