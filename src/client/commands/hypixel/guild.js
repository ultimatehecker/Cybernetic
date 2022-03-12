const { hypixel, errors } = require('../../schemas/hypixel');
const commaNumber = require('comma-number');
const colors = require("../../tools/colors.json");
const currentDate = new Date(Date.now());

module.exports = {
	name: "guild",
	aliases: ["g"],
	description: "Shows the statistics of a average Hypixel Guild!",
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
			const guildArg404 = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`You need to type in a guild's name! (Not guild tag, but guild name.) (Example: \`${prefix}guild Dragons of War\`)`)
			return message.reply({embeds: [guildArg404] });
		}

		hypixel.getGuild("name", guildName).then(async (guild) => {
			const guildInfoEmbed = new Discord.MessageEmbed()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.setFooter(`Guild Statistics requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`, message.author.displayAvatarURL())

				.addField("Description", guild.description)
				.addField("Level", `\`${guild.level}\``, true)
				.addField("Members", `\`${Object.keys(guild.members).length}/125\``, true)
				.addField("Date Created", `<t:${Math.ceil(guild.createdAtTimestamp / 1000)}:R>`, true)

				let arr = [];
				for (let i = 0; i < guild.expHistory.length; i++) {
					let exp = `\`•\` ${guild.expHistory[i].day}: \`${commaNumber(JSON.stringify(guild.expHistory[i].exp))}\``;
					arr.push(exp);
				 }

				guildInfoEmbed.addField("GEXP History", `${arr[0]}\n${arr[1]}\n${arr[2]}\n${arr[3]}\n${arr[4]}\n${arr[5]}\n${arr[6]}\n`)

				if (guild.tag !== null) {
					guildInfoEmbed.setTitle(`${guild.name} [${guild.tag}]`);
				} else {
					guildInfoEmbed.setTitle(`${guild.name}`);
				}

			message.reply({embeds: [guildInfoEmbed] });
		}).catch((e) => {
			if (e.message === errors.GUILD_DOES_NOT_EXIST) {
				const guild404 = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("I could not find that guild in the API. Check spelling and name history.")
				return message.reply({ embeds: [guild404] });
			} else {
				const error = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription(`A problem has been detected and the command has been aborted, if this is the first time seeing this, check the error message for more details, if this error appears multiple times, DM \`ultiamte_hecker#1165\` with this error message \n \n \`Error:\` \n \`\`\`${e}\`\`\``)
				return message.reply({ embeds: [error] });
			}
		});
	}
};
