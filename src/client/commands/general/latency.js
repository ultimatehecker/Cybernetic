const colors = require("../../tools/colors.json");

module.exports = {
    name: "latency",
    aliases: [],
    description: "Responds with the latency of Discord API & myself",
	options: [],
    defaultPermission: true,
    usage: "latency",
    example: "latency",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping();

        let author = {
            name: "Cybernetic Latency & API Latency",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        const latency = new Discord.MessageEmbed()
            .setAuthor(author)
            .setColor(colors["MainColor"])
            .setDescription(`🏓 Cybernetic's Latency is currently \`${Date.now() - message.createdTimestamp}\` ms. Discord API Latency is currently \`${Math.round(client.ws.ping)}\` ms.`)

        message.reply({ embeds: [latency], allowedMentions: { repliedUser: true } });
    },
    async slashExecute(client, Discord, interaction) {

        await interaction.deferReply({ ephemeral: false });

        let authorSuccess = {
            name: "Cybernetic Latency & API Latency",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }	
		
		let latestEmbed = new Discord.MessageEmbed()
			.setAuthor(authorSuccess)
			.setDescription(`🏓 Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`)
			.setColor(colors["MainColor"]);

		interaction.editReply({embeds: [latestEmbed], allowedMentions: { repliedUser: true }, components: [{type: "ACTION_ROW", components: [{type: "BUTTON", label: "Retest", style: "PRIMARY", customId: "retest" }] }] }).then((reply) => {
            let collector = reply.createMessageComponentCollector({ componentType: "BUTTON", time: 300000, dispose: true });

            collector.on("collect", async (press) => {
                if (press.user.id !== interaction.user.id) {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(authorError)
                        .setColor(colors["MainColor"])
                        .setDescription("You cannot perform this action!");

                    press.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });

                    setTimeout(function() {
                        interaction.deleteReply()
                    }, 5000);
                } else {
                    await press.deferUpdate();

                    const embed = new Discord.MessageEmbed()
                        .setAuthor(authorSuccess)
                        .setColor(colors["MainColor"])
                        .setDescription(`🏓 Latency is ${Date.now() - press.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`)
                        

                    latestEmbed = embed;
                    press.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
                }
            });
            collector.on("end", () => {interaction.editReply({ components: [{type: "ACTION_ROW", components: [{ type: "BUTTON", label: "Retest", style: "PRIMARY", customId: "retest", disabled: true }] }], embeds: [latestEmbed], allowedMentions: { repliedUser: true } }) });
        });
	},
};