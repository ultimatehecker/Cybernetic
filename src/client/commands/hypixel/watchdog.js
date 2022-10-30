const { hypixel, errors } = require('../../schemas/hypixel');
const commaNumber = require('comma-number');
const colors = require("../../tools/colors.json");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "watchdog",
	aliases: ["wdr"],
	description:"Show you the statistics of Watchdog which updates every 15 seconds!",
	usage: "watchdog",
	example: "watchdog",
	notes: 'The statistics of the last day reset at 5 AM UTC',
	async execute(client, message, args, Discord) {

		await message.channel.sendTyping();

		let authorSuccess = {
            name: "Watchdog Statistics",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		hypixel.getWatchdogStats().then((stats) => {

			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.addFields([
					{ name: "Overall", value: `\`•\` **Lifetime**: \`${commaNumber((stats.byWatchdogTotal + stats.byStaffTotal))}\` \n \`•\` **Last Day**: \`${commaNumber((stats.byWatchdogRollingDay + stats.byStaffRollingDay))}\``, required: true, inline: false },
					{ name: "Watchdog", value: `\`•\` **Lifetime**: \`${commaNumber(stats.byWatchdogTotal)}\` \n \`•\` **Last Day**: \`${commaNumber(stats.byWatchdogRollingDay)}\` \n \`•\` **Last Minute**: \`${commaNumber(stats.byWatchdogLastMinute)}\``, required: true, inline: false },
					{ name: "Staff", value: `\`•\` **Lifetime**: \`${commaNumber(stats.byStaffTotal)}\` \n \`•\` **Last Day**: \`${commaNumber(stats.byStaffRollingDay)}\``, required: true, inline: false }
				])

			message.reply({embeds: [embed], allowedMentions: { repliedUser: true } });
		});
	},
	async slashExecute(client, Discord, interaction, serverDoc) {

        await interaction.deferReply({ ephemeral: false });

        let authorSuccess = {
            name: "Watchdog Statistics",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		hypixel.getWatchdogStats().then((stats) => {

			const embed = new Discord.EmbedBuilder()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.addFields([
					{ name: "Overall", value: `\`•\` **Lifetime**: \`${commaNumber((stats.byWatchdogTotal + stats.byStaffTotal))}\` \n \`•\` **Last Day**: \`${commaNumber((stats.byWatchdogRollingDay + stats.byStaffRollingDay))}\``, required: true, inline: false },
					{ name: "Watchdog", value: `\`•\` **Lifetime**: \`${commaNumber(stats.byWatchdogTotal)}\` \n \`•\` **Last Day**: \`${commaNumber(stats.byWatchdogRollingDay)}\` \n \`•\` **Last Minute**: \`${commaNumber(stats.byWatchdogLastMinute)}\``, required: true, inline: false },
					{ name: "Staff", value: `\`•\` **Lifetime**: \`${commaNumber(stats.byStaffTotal)}\` \n \`•\` **Last Day**: \`${commaNumber(stats.byStaffRollingDay)}\``, required: true, inline: false }
				])

			interaction.editReply({embeds: [embed], allowedMentions: { repliedUser: true } });
		});
    }
};