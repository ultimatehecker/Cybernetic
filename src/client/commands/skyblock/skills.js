const skycrypt = require("../../database/models/skycrypt");
const User = require('../../database/schemas/user');
const fnum = require(`../../database/models/format-number`)
const colors = require("../../tools/colors.json");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'skills',
    aliases: ["sk"],
    description: 'Shows you the different gamemodes and overall statistics of a Hypixel Bedwars player!',
	options: [
		{
			name: "player",
			description: "Shows the statistics of an average Hypixel Bedwars player!",
			required: false,
			type: ApplicationCommandOptionType.String
		},
        {
			name: "profile",
			description: "Shows the statistics of an average Hypixel Bedwars player of a certain dream gamemode!",
			required: false,
			type: ApplicationCommandOptionType.String
		},
	],
    defaultPermission: true,
    usage: 'skills [player] [profile]',
    example: 'skills ultimate_hecker Coconut',
    notes: 'If you want a list of skills and the information about it, you will need to put "list" as the first argument.',
    async execute(client, message, args, Discord, prefix) {

        await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

        const data = await User.findOne({
            id: message.author.id,
        });

        if (!args[1] && !data) { // if someone didn't type in ign and wasn't verified
            const ign404 = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`You need to type in a player's IGN! (Example: \`${prefix}bedwars ultimate_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${prefix}link ultimate_hecker\`)`);
			return message.reply({ embeds: [ign404], allowedMentions: { repliedUser: true } }).then((sent) => {
                setTimeout(function() {
                    message.delete();
                    sent.delete();
                }, 5000);
            });
        }

        let player;

        if (data && !args[0]) {
            player = data.uuid;
        } else if (args[0]) {
            player = args[0];
        }

        skycrypt.getSkyblock(player).then((player) => {
            if(!player) {
                const neverPlayed = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription("That player has never played skyblock")
                return message.reply({ embeds: [neverPlayed], allowedMentions: { repliedUser: true } }).then((sent) => {
                    setTimeout(function() {
                        message.delete();
                        sent.delete();
                    }, 5000);
                });
            } else if(args[0] == "list") {
                const hypixelSkills = new Discord.EmbedBuilder()
                    .setAuthor(authorSuccess)
                    .setColor(colors["MainColor"])
                    .addFields([
                        { name: `Farming`, value: `Max Level: \`${player.profileSkills.skills.max.farming}\` \n \`Max Level ${player.profileSkills.skills.maxXp.farming}\``, require: true, inline: true },
                        { name: `Mining`, value: `Max Level: \`${player.profileSkills.skills.max.mining}\` \n \`Max Level ${player.profileSkills.skills.maxXp.mining}\``, require: true, inline: true },
                        { name: `Combat`, value: `Max Level: \`${player.profileSkills.skills.max.combat}\` \n \`Max Level ${player.profileSkills.skills.maxXp.combat}\``, require: true, inline: true },
                        { name: `Foraging`, value: `Max Level: \`${player.profileSkills.skills.max.foraging}\` \n \`Max Level ${player.profileSkills.skills.maxXp.foraging}\``, require: true, inline: true },
                        { name: `Fishing`, value: `Max Level: \`${player.profileSkills.skills.max.fishing}\` \n \`Max Level ${player.profileSkills.skills.maxXp.fishing}\``, require: true, inline: true },
                        { name: `Enchanting`, value: `Max Level: \`${player.profileSkills.skills.max.enchanting}\` \n \`Max Level ${player.profileSkills.skills.maxXp.enchanting}\``, require: true, inline: true },
                        { name: `Alchemy`, value: `Max Level: \`${player.profileSkills.skills.max.alchemy}\` \n \`Max Level ${player.profileSkills.skills.maxXp.alchemy}\``, require: true, inline: true },
                        { name: `Carpentry`, value: `Max Level: \`${player.profileSkills.skills.max.carpentry}\` \n \`Max Level ${player.profileSkills.skills.maxXp.carpentry}\``, require: true, inline: true },
                        { name: `Taming`, value: `Max Level: \`${player.profileSkills.skills.max.carpentry}\` \n \`Max Level ${player.profileSkills.skills.maxXp.taming}\``, require: true, inline: true },
                        { name: `Dungeoneering`, value: `Max Level: \`${player.profileSkills.skills.max.dungeoneering}\` \n \`Max Level ${player.profileSkills.skills.maxXp.dungeoneering}\``, require: true, inline: true },
                        { name: `Runecrafting`, value: `Max Level: \`${player.profileSkills.skills.max.runecrafting}\` \n \`Max Level ${player.profileSkills.skills.maxXp.runecrafting}\``, require: true, inline: true },
                        { name: `Social`, value: `Max Level: \`${player.profileSkills.skills.max.social}\` \n \`Max Level ${player.profileSkills.skills.maxXp.social}\``, require: true, inline: true },
                    ]);

                return message.reply({ embeds: [hypixelSkills], allowedMentions: { repliedUser: true } })
            } else {
                authorSuccess.name = `${player.profile.data.display_name}`

                const skills = new Discord.EmbedBuilder()
                    .setAuthor(authorSuccess)
                    .setColor(colors["MainColor"])
                    .setDescription(`Total Skill XP: \`${player.profile.data.total_skill_xp}\` \n Average Skill Level: \`${player.profile.data.average_level}\``)
                    .addFields([
                        { name: `:sbFarming: Farming \`${player.profile.data.levels.farming.level}\` (${fnum(player.profile.data.levels.rank)})`, value: ``, require: true, inline: true },
                    ]);

                return message.reply({ embeds: [skills], allowedMentions: { repliedUser: true } })
            }
        }).catch((e) => {
            if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
				const player404 = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("I could not find that player in the API. Check spelling and name history.")
				return message.reply({ embeds: [player404], allowedMentions: { repliedUser: true } }).then((sent) => {
                    setTimeout(function() {
                        message.delete();
                        sent.delete();
                    }, 5000);
                });
			} else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
				const neverLogged = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("That player has never logged into Hypixel.")
				return message.reply({embeds: [neverLogged], allowedMentions: { repliedUser: true } }).then((sent) => {
                    setTimeout(function() {
                        message.delete();
                        sent.delete();
                    }, 5000);
                });
			} else {
				const error = new Discord.EmbedBuilder()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${e}\`\`\``)
                    console.error(e);
				return message.reply({ embeds: [error], allowedMentions: { repliedUser: true } }).then((sent) => {
                    setTimeout(function() {
                        message.delete();
                        sent.delete();
                    }, 5000);
                });
            }   
        });
	}
};