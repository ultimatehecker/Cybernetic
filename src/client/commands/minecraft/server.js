const axios = require("axios")
const colors = require("../../tools/colors.json");

module.exports = {
    name: "server",
    aliases: ["mcserver"],
    description: "Will show you information about a Minecraft Server",
    options: [
		{
			name: "server",
			description: "Shows the statistics of an average Minecraft Server!",
			required: true,
			type: "STRING"
		}
	],
    defaultPermission: true,
    usage: "server (ip) [port]",
    example: "server hypixel.net",
    async execute(client, message, args, Discord, prefix) {

        await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "Server Information",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        try {
            if(!args[0]) {
                const ip404 = new Discord.MessageEmbed()
                    .setAuthor(authorError)
                    .setColor(colors["MainColor"])
                    .setDescription(`You need to type in a server IP! (Example: \`${prefix}server mc.hypixel.net\`)`)
                return message.reply({ embeds: [ip404] }).then(() => {
					setTimeout(function() {
						message.delete()
					}, 5000);
				});
            }

            const MOTDData = (await axios.get(`https://api.mcsrvstat.us/2/${args[0]}`)).data;
            const serverData = (await axios.get(`https://mc-api.net/v3/server/ping/${args[0]}`)).data;

            const server = new Discord.MessageEmbed()
                .setAuthor(authorSuccess)
                .setTitle(`\`\`\`${args[0]}\`\`\``)
                .setColor(colors["MainColor"])
                .addField('IP Address', `\`${MOTDData.ip}\`:\`${MOTDData.port}\``)
                .addField('Version', `\`${serverData.version.name}\``)
                .addField('Online Players', `\`${serverData.players.online}\`/\`${serverData.players.max}\``)
                .setThumbnail(serverData.favicon)

            message.reply({ embeds: [server] });

        } catch {
            const error = new Discord.MessageEmbed()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescription(`An error has occurred. Check the IP address. If the error persists and you are certain that the IP is correct, create a new issue on the github repository by doing \`${prefix}github\``)
            message.reply({ embeds: [error] }).then(() => {
                setTimeout(function() {
                    message.delete()
                }, 5000);
            });
        }
    },
    async slashExecute(client, Discord, interaction, serverDoc) {

        await interaction.deferReply({ ephemeral: false });

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "Server Information",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        try {
            if(!interaction.options.get("server")) {
                const ip404 = new Discord.MessageEmbed()
                    .setAuthor(authorError)
                    .setColor(colors["MainColor"])
                    .setDescription(`You need to type in a server IP! (Example: \`${serverDoc.prefix}server mc.hypixel.net\`)`)
                return interaction.editReply({ embeds: [ip404] }).then(() => {
					setTimeout(function() {
						interaction.deleteReply()
					}, 5000);
				});
            }

            const MOTDData = (await axios.get(`https://api.mcsrvstat.us/2/${args[0]}`)).data;
            const serverData = (await axios.get(`https://mc-api.net/v3/server/ping/${args[0]}`)).data;

            const server = new Discord.MessageEmbed()
                .setAuthor(authorSuccess)
                .setTitle(`\`\`\`${args[0]}\`\`\``)
                .setColor(colors["MainColor"])
                .addField('IP Address', `\`${MOTDData.ip}\`:\`${MOTDData.port}\``)
                .addField('Version', `\`${serverData.version.name}\``)
                .addField('Online Players', `\`${serverData.players.online}\`/\`${serverData.players.max}\``)
                .setThumbnail(serverData.favicon)

            interaction.editReply({ embeds: [server] });
        } catch {
            const error = new Discord.MessageEmbed()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescription(`An error has occurred. Check the IP address. If the error persists and you are certain that the IP is correct, create a new issue on the github repository by doing \`${prefix}github\``)
            interaction.editReply({ embeds: [error] }).then(() => {
                setTimeout(function() {
                    interaction.deleteReply()
                }, 5000);
            });
        }
    }
};