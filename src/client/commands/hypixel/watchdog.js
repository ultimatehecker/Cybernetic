const { hypixel, errors } = require('../../schemas/hypixel');
const commaNumber = require('comma-number');
const colors = require("../../tools/colors.json");

module.exports = {
	name: "watchdog",
	aliases: ["wdr"],
	description:"Show you the statistics of Watchdog which updates every 15 seconds!",
	usage: "watchdog",
	example: "watchdog",
	async execute(client, message, args, Discord) {

		await message.channel.sendTyping();

		let authorSuccess = {
            name: "Watchdog Statistics",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		hypixel.getWatchdogStats().then((stats) => {
			const embed = new Discord.MessageEmbed()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.addField("Total Watchdog bans", `\`${commaNumber(stats.byWatchdogTotal)}\``, true)
				.addField("Bans in the last minute", `\`${commaNumber(stats.byWatchdogLastMinute)}\``, true)
				.addField("Total staff bans", `\`${commaNumber(stats.byStaffTotal)}\``, true)
			message.reply({embeds: [embed] });
		});
	},
};