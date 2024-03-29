const importPrettyMS = import("pretty-ms")
const os = require("os-utils")
const colors = require("../../tools/colors.json");

module.exports = {
    name: "info",
    aliases: [],
    description: "Grabs various statistics of Cybernetic and it's machine it is running on!",
    options: [],
    defaultPermission: true,
    usage: "info",
    example: "info",
    async execute(client, message, args, Discord, prefix) {

        await message.channel.sendTyping();

        let author = {
            name: "Cybernetic - Database Statistics, Uptime & Popularity",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        const prettyMS = (await importPrettyMS).default
        console.log(prettyMS)

        os.cpuUsage((percentage) => {
            client.myprofileSchema.distinct("userID").exec((err, count) => {
                if (err) throw err;

                const info = new Discord.EmbedBuilder()
                    .setAuthor(author)
                    .setColor(colors["MainColor"])
                    .setDescription(`Cybernetic is one of the best Minecraft Discord Bots to exist. Down below is some statistics about Cybernetic Database, Uptime and Popularity. To get started with Cybernetic, do \`${prefix}help\``)
                    .setThumbnail(client.user.displayAvatarURL())
                    .addFields([
                        { name: "Uptime", value: `\`${prettyMS(os.processUptime() * 1000, { verbose: true })}\``, inline: true },
                        { name: "Latency", value: `Client's Latency: \`${Date.now() - message.createdTimestamp}\` ms \n API Latency: \`${Math.round(client.ws.ping)}\` ms`, inline: true },
                        { name: "System", value: `CPU Usage: \`${Math.round((percentage * 100) / os.cpuCount())}%\` \n Memory Usage: \`${Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100}\`MB`, inline: true },
                        { name: "Popularity", value: `Number of Servers: \`${client.guilds.cache.size}\` \n Number of Members: \`${count.length}\``, inline: true },
                    ]);

                message.reply({ embeds: [info], allowedMentions: { repliedUser: true } });
            });
        });
    },
    async slashExecute(client, Discord, interaction, serverDoc) {
		
		await interaction.deferReply({ ephemeral: false });

        let author = {
            name: "Cybernetic - Database Statistics, Uptime & Popularity",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        const currentDate = new Date(Date.now());

        const prettyMS = (await importPrettyMS).default
        console.log(prettyMS)

		os.cpuUsage((percentage) => {
			client.myprofileSchema.distinct("userID").exec((err, count) => {
				if (err) throw err;

				const embed = new Discord.EmbedBuilder()
					.setAuthor(author)
					.setColor(colors["MainColor"])
					.setDescription(`Cybernetic is one of the best Minecraft Discord Bots to exist. Down below is some statistics about Cybernetic Database, Uptime and Popularity. To get started with Cybernetic, do \`${serverDoc.prefix}help\``)
					.setThumbnail(client.user.displayAvatarURL())
					.addFields([
						{ name: "Uptime", value: `\`${prettyMS(os.processUptime() * 1000, {verbose: true,})}\``, inline: true },
						{ name: "Latency", value: `Bot's Latency: \`${Date.now() - interaction.createdTimestamp}\` ms \n API Latency: \`${Math.round(client.ws.ping)}\` ms`, inline: true },
						{ name: "System", value: `CPU Usage: \`${Math.round((percentage * 100) / os.cpuCount())}%\` \n Memory Usage: \`${Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100}\`MB`, inline: true },
						{ name: "Popularity", value: `Number of Servers: \`${client.guilds.cache.size}\` \n Number of Users: \`${count.length}\``, inline: true },
					]);
                    
				interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
			});
		});
	},
};