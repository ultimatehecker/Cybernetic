const { hypixel, errors } = require('../../schemas/hypixel');
const commaNumber = require('comma-number');
const colors = require("../../tools/colors.json");
console.log('Command File Successfully Scanned - watchdog');

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
            iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
        }

		hypixel.getWatchdogStats().then((stats) => {
			const embed = new Discord.MessageEmbed()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.addField("Total Watchdog bans", `\`${commaNumber(stats.byWatchdogTotal)}\``, true)
				.addField("Bans in the last minute", `\`${commaNumber(stats.byWatchDogLastMinute)}\``, true)
				.addField("Total staff bans", `\`${commaNumber(stats.byStaffTotal)}\``, true)
			message.reply({embeds: [embed] });
		});
	},
};