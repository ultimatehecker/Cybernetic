const { errors } = require('../../database/models/hypixel');
const hypixel = require('../../database/models/hypixelApi')
const commaNumber = require('comma-number');
const User = require('../../database/schemas/user');
const colors = require("../../tools/colors.json");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'woolwars',
    aliases: [ "ww" ],
    description: 'Show you the Wool Wars Statistics of am average Hypixel Player!',
	options: [
		{
			name: "player",
			description: "Shows the statistics of an average Hypixel Bedwars player!",
			required: false,
			type: ApplicationCommandOptionType.String
		}
	],
    defaultPermission: true,
    usage: 'woolwars [IGN]',
    example: 'woolwars ultimate_hecker',
    async execute(client, message, args, Discord, prefix) {

        await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "WoolWars Statistics",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        const data = await User.findOne({
            id: message.author.id,
        });

        if (!data && !args[0]) { // if someone didn't type in ign
            const ign404 = new Discord.EmbedBuilder()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescription(`You need to type in a player's IGN! (Example: \`${prefix}buildbattle ultimate_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${prefix}link ultimate_hecker\`)`)
            return message.reply({ embeds: [ign404], allowedMentions: { repliedUser: true } }).then((sent) => {
                setTimeout(function() {
                    message.delete();
                    sent.delete();
                }, 5000);
            });
        }

        let player
        if (data && !args[0]) {
             player = data.uuid;
        } else if (args[0]) {
             player = args[0];
        }

        hypixel.getPlayer(player).then((player) => {

            if (!player.stats.WoolGames) {
                const neverPlayed = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription("That player has never played this game")
                return message.reply({ embeds: [neverPlayed], allowedMentions: { repliedUser: true } }).then((sent) => {
                    setTimeout(function() {
                        message.delete();
                        sent.delete();
                    }, 5000);
                });
            }

            let losses = player.stats.WoolGames.wool_wars.stats.games_played - player.stats.WoolGames.wool_wars.stats.wins

            const woolwars = new Discord.EmbedBuilder()
                .setAuthor(authorSuccess)
                .setTitle(`[${player.newPackageRank}] ${player.playername}`)
                .setColor(colors["MainColor"])
                .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                .addFields([
                    { name: "General Stats", value: `\`•\` **Coins**: \`${commaNumber(player.stats.WoolGames.coins)}\` \n \`•\` **Total Games**: \`${commaNumber(player.stats.WoolGames.wool_wars.stats.games_played)}\` \n \`•\` **Powerups**: \`${commaNumber(player.stats.WoolGames.wool_wars.stats.powerups_gotten)}\``, required: true, inline: true },
                    { name: "Games", value: `\`•\` **Wins**: \`${commaNumber(player.stats.WoolGames.wool_wars.stats.wins)}\` \n \`•\` **Losses**: \`${commaNumber(player.stats.WoolGames.wool_wars.stats.games_played - player.stats.WoolGames.wool_wars.stats.wins)}\` \n \`•\` **WLR**: \`${(player.stats.WoolGames.wool_wars.stats.wins / losses).toFixed(2)}\``, required: true, inline: true },
                    { name: "Wool", value: `\`•\` **Placed**: \`${commaNumber(player.stats.WoolGames.wool_wars.stats.wool_placed)}\` \n \`•\` **Broken**: \`${commaNumber(player.stats.WoolGames.wool_wars.stats.blocks_broken)}\``, required: true, inline: true },
                ]);

            message.reply({ embeds: [woolwars], allowedMentions: { repliedUser: true } });
        }).catch((e) => { // error messages
            if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
                const player404 = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription('I could not find that player in the API. Check spelling and name history.')
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
                    .setDescription('That player has never logged into Hypixel.')
                return message.reply({ embeds: [neverLogged], allowedMentions: { repliedUser: true } }).then((sent) => {
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
    },
    async slashExecute(client, Discord, interaction, serverDoc){

        await interaction.deferReply({ ephemeral: false });

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "WoolWars Statistics",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        const data = await User.findOne({
            id: interaction.user.id
        });

        if (!data && !interaction.options.get("player")) { // if someone didn't type in ign
            const ign404 = new Discord.EmbedBuilder()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescription(`You need to type in a player's IGN! (Example: \`${serverDoc.prefix}buildbattle ultimate_hecker\`) \nYou can also link your account to do commands without inputting an IGN. (Example: \`${serverDoc.prefix}link ultimate_hecker\`)`)
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

            if (!player.stats.WoolGames) {
                const neverLogged = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription('That player has never played this game')
                return interaction.editReply({ embeds: [neverLogged], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
            }

            let losses = player.stats.WoolGames.wool_wars.stats.games_played - player.stats.WoolGames.wool_wars.stats.wins

            const buildbattle = new Discord.EmbedBuilder()
                .setAuthor(authorSuccess)
                .setTitle(`[${player.newPackageRank}] ${player.playername}`)
                .setColor(colors["MainColor"])
                .setThumbnail(`https://crafatar.com/avatars/${player.uuid}?overlay&size=256`)
                .addFields([
                    { name: "General Stats", value: `\`•\` **Coins**: \`${commaNumber(player.stats.WoolGames.coins)}\` \n \`•\` **Total Games**: \`${commaNumber(player.stats.WoolGames.wool_wars.stats.games_played)}\` \n \`•\` **Powerups**: \`${commaNumber(player.stats.WoolGames.wool_wars.stats.powerups_gotten)}\``, required: true, inline: true },
                    { name: "Games", value: `\`•\` **Wins**: \`${commaNumber(player.stats.WoolGames.wool_wars.stats.wins)}\` \n \`•\` **Losses**: \`${commaNumber(player.stats.WoolGames.wool_wars.stats.games_played - player.stats.WoolGames.wool_wars.stats.wins)}\` \n \`•\` **WLR**: \`${(player.stats.WoolGames.wool_wars.stats.wins / losses).toFixed(2)}\``, required: true, inline: true },
                    { name: "Wool", value: `\`•\` **Placed**: \`${commaNumber(player.stats.WoolGames.wool_wars.stats.wool_placed)}\` \n \`•\` **Broken**: \`${commaNumber(player.stats.WoolGames.wool_wars.stats.blocks_broken)}\``, required: true, inline: true },
                ]);

            interaction.editReply({ embeds: [buildbattle], allowedMentions: { repliedUser: true } });
        }).catch(e => { // error messages
            if (e.message === errors.PLAYER_DOES_NOT_EXIST) {
                const player404 = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription('I could not find that player in the API. Check spelling and name history.')
                return interaction.editReply({ embeds: [player404], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
            } else if (e.message === errors.PLAYER_HAS_NEVER_LOGGED) {
                const neverLogged = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription('That player has never logged into Hypixel.')
                return interaction.editReply({ embeds: [neverLogged], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
            } else {
                const error = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${e}\`\`\``)
                return interaction.editReply({ embeds: [error], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                });
            }       
        });
    },
};