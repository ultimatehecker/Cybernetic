const { hypixel, errors } = require('../../schemas/hypixel');
const User = require('../../schemas/user');
const colors = require("../../tools/colors.json");

module.exports = {
	name: "socials",
	aliases: [],
	description: "Show you the social medias of a average Hypixel Player!",
	options: [
		{
			name: "player",
			description: "Shows the statistics of an average Hypixel Bedwars player!",
			required: false,
			type: "STRING"
		}
	],
    defaultPermission: true,
	usage: "socials [IGN]",
	example: "socials ultimate_hecker",
	async execute(client, message, args, Discord, prefix) {

		await message.channel.sendTyping();

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Social Media",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		const data = await User.findOne({
			id: message.author.id,
		});

		if (!data && !args[0]) {
			// if someone didn't type in ign
			const ign404 = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`You need to type in a player's IGN! (Example: \`${prefix}socials ultimate_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${prefix}link ultimate_hecker\`)`)
			return message.reply({ embeds: [ign404], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					message.delete()
				}, 5000);
			});
		}

		let player;
		if (data && !args[0]) {
			player = data.uuid;
		} else if (args[0]) {
			player = args[0];
		}

		hypixel.getPlayer(player).then(async (player) => {

			if (!player.socialMedia) {
                const neverPlayed = new Discord.MessageEmbed()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription("That player doesn't have any socials")
                return message.reply({ embeds: [neverPlayed], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						message.delete()
					}, 5000);
				});
            }

			let socials = new Discord.MessageEmbed()
				.setAuthor(authorSuccess)
				.setTitle(`[${player.rank}] ${player.nickname}`)
				.setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
				.setColor(colors["MainColor"])

			if (player.socialMedia[0] != undefined || player.socialMedia[0] != null) {
				socials.addField(player.socialMedia[0].name, player.socialMedia[0].link);
			}

			if (player.socialMedia[1] != undefined || player.socialMedia[1] != null) {
				socials.addField(player.socialMedia[1].name, player.socialMedia[1].link);
			}

			if (player.socialMedia[2] != undefined || player.socialMedia[2] != null) {
				socials.addField(player.socialMedia[2].name, player.socialMedia[2].link);
			}

			if (player.socialMedia[3] != undefined || player.socialMedia[3] != null) {
				socials.addField(player.socialMedia[3].name, player.socialMedia[3].link);
			}

			if (player.socialMedia[4] != undefined || player.socialMedia[4] != null) {
				socials.addField(player.socialMedia[4].name, player.socialMedia[4].link);
			}

			if (player.socialMedia[5] != undefined || player.socialMedia[5] != null) {
				socials.addField(player.socialMedia[5].name, player.socialMedia[5].link);
			}

			if (player.socialMedia[6] != undefined || player.socialMedia[6] != null) {
				socials.addField(player.socialMedia[6].name, player.socialMedia[6].link);
			}

			message.reply({embeds: [socials], allowedMentions: { repliedUser: true } });
		}).catch((e) => {
			if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
				const player404 = new Discord.MessageEmbed()
					.setAuthor("Error", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
					.setColor(colors["ErrorColor"])
					.setDescription("I could not find that player in the API. Check spelling and name history.")
				return message.reply({embeds: [player404], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						message.delete()
					}, 5000);
				});
			} else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
				const neverLogged = new Discord.MessageEmbed()
					.setAuthor("Error", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
					.setColor(colors["ErrorColor"])
					.setDescription("That player has never logged into Hypixel.");
				return message.reply({ embeds: [neverLogged], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						message.delete()
					}, 5000);
				});
			} else {
				const error = new Discord.MessageEmbed()
					.setAuthor("Error", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
					.setColor(colors["ErrorColor"])
					.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${e}\`\`\``)
				console.error(e);
				return message.reply({ embeds: [error], allowedMentions: { repliedUser: true } }).then(() => {
					setTimeout(function() {
						message.delete()
					}, 5000);
				});
			}
		});
	},
	async slashExecute(client, Discord, interaction, serverDoc) {

        await interaction.deferReply({ ephemeral: false });

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Social Media",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

        const data = await User.findOne({
            id: interaction.user.id
        });

        if (!data && !interaction.options.get("player")) { // if someone didn't type in ign
            const ign404 = new Discord.MessageEmbed()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescription(`You need to type in a player's IGN! (Example: \`${serverDoc.prefix}megawalls ultimate_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${serverDoc.prefix}link ultimate_hecker\`)`)
            return interaction.editReply({ embeds: [ign404], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					interaction.deleteReply()
				}, 5000);
			});
        }

        let player
        if (data && !interaction.options.get("player")?.value) {
             player = data.uuid;
        } else if (interaction.options.get("player")?.value) {
             player = interaction.options.get("player")?.value;
        }

        hypixel.getPlayer(player).then((player) => {

            if (!player.socialMedia) {
                const neverPlayed = new Discord.MessageEmbed()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription("That player doesn't have any socials")
                return message.reply({ embeds: [neverPlayed], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
            }

			const socials = new Discord.MessageEmbed()
				.setAuthor(authorSuccess)
				.setTitle(`[${player.rank}] ${player.nickname}`)
				.setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
				.setColor(colors["MainColor"])

			if (player.socialMedia[0] != undefined || player.socialMedia[0] != null) {
				socials.addField(player.socialMedia[0].name, player.socialMedia[0].link);
			}

			if (player.socialMedia[1] != undefined || player.socialMedia[1] != null) {
				socials.addField(player.socialMedia[1].name, player.socialMedia[1].link);
			}

			if (player.socialMedia[2] != undefined || player.socialMedia[2] != null) {
				socials.addField(player.socialMedia[2].name, player.socialMedia[2].link);
			}

			if (player.socialMedia[3] != undefined || player.socialMedia[3] != null) {
				socials.addField(player.socialMedia[3].name, player.socialMedia[3].link);
			}

			if (player.socialMedia[4] != undefined || player.socialMedia[4] != null) {
				socials.addField(player.socialMedia[4].name, player.socialMedia[4].link);
			}

			if (player.socialMedia[5] != undefined || player.socialMedia[5] != null) {
				socials.addField(player.socialMedia[5].name, player.socialMedia[5].link);
			}

			if (player.socialMedia[6] != undefined || player.socialMedia[6] != null) {
				socials.addField(player.socialMedia[6].name, player.socialMedia[6].link);
			}

            interaction.editReply({ embeds: [socials], allowedMentions: { repliedUser: true } });

        }).catch(e => { // error messages
            if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
                const player404 = new Discord.MessageEmbed()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription('I could not find that player in the API. Check spelling and name history.')
                return interaction.editReply({ embeds: [player404], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
            } else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
                const neverLogged = new Discord.MessageEmbed()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription('That player has never logged into Hypixel.')
                return interaction.editReply({ embeds: [neverLogged], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
            } else {
                const error = new Discord.MessageEmbed()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${e}\`\`\``)
                return interaction.editReply({ embeds: [error], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
						console.error(e)
                    }, 5000);
                });
            }       
        });
    }
};
