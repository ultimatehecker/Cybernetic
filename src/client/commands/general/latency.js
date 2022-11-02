const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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

        const latency = new Discord.EmbedBuilder()
            .setAuthor(author)
            .setColor(colors["MainColor"])
            .setDescription(`🏓 Cybernetic's Latency is currently \`${Date.now() - message.createdTimestamp}\` ms. Discord API Latency is currently \`${Math.round(client.ws.ping)}\` ms.`)

        message.reply({ embeds: [latency], allowedMentions: { repliedUser: true } });
    },
    async slashExecute(client, Discord, interaction) {

        await interaction.deferReply({ ephemeral: false });

        const latencyTest = new ActionRowBuilder().addComponents(new ButtonBuilder()
			.setLabel('Retest')
            .setCustomId('Retest')
			.setStyle(ButtonStyle.Primary),
		);

        let authorSuccess = {
            name: "Cybernetic Latency & API Latency",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }	
		
		let latestEmbed = new Discord.EmbedBuilder()
			.setAuthor(authorSuccess)
			.setDescription(`🏓 Cybernetic's Latency is: \`${Date.now() - interaction.createdTimestamp}\` ms. Discord API Latency is: \`${Math.round(client.ws.ping)}\` ms.`)
			.setColor(colors["MainColor"]);

		interaction.editReply({embeds: [latestEmbed], allowedMentions: { repliedUser: true }, components: [latencyTest] }).then((reply) => {
            let collector = reply.createMessageComponentCollector({ time: 300000, dispose: true });

            collector.on("collect", async (press) => {
                if (press.user.id !== interaction.user.id) {
                    const embed = new Discord.EmbedBuilder()
                        .setAuthor(authorError)
                        .setColor(colors["MainColor"])
                        .setDescription("You cannot perform this action!");

                    press.reply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
                        setTimeout(function() {
                            interaction.deleteReply()
                        }, 5000);
                    });
                } else {
                    await press.deferUpdate();

                    const embed = new Discord.EmbedBuilder()
                        .setAuthor(authorSuccess)
                        .setColor(colors["MainColor"])
                        .setDescription(`🏓 Cybernetic's Latency is: \`${Date.now() - press.createdTimestamp}\` ms. Discord API Latency is: \`${Math.round(client.ws.ping)}\` ms.`)
                        
                    latestEmbed = embed;
                    press.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
                }
            });
            collector.on("end", () => {interaction.editReply({ embeds: [latestEmbed], allowedMentions: { repliedUser: true }, components: [latencyTest] }) });
        });
	},
};