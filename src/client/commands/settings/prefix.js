const colors = require("../../tools/colors.json");
console.log('Command File Successfully Scanned - prefix');

module.exports = {
    name: 'prefix',
    aliases: ["pre"],
    description: 'Changes the prefix of the client',
    options: [
		{ name: "prefix", description: "The new prefix", type: "STRING", required: true },
	],
    usage: 'prefix (prefix)',
    example: 'prefix $',
    async execute(client, message, args, Discord, prefix) {

        await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Prefix Changed!",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

        if(!args[0]) {
            const prefix404 = new Discord.MessageEmbed()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescription('You have to enter a prefix to chnage a prefix!')

            return message.reply({ embeds: [prefix404], allowedMentions: { repliedUser: true } });
        }

        if(message.member.permissions.has("MANAGE_GUILD")) {
            client.utils.updateServer(client, message.guild.id, { prefix: args[0] }).then(() => {

					const success = new Discord.MessageEmbed()
                        .setAuthor(authorSuccess)
						.setColor(colors["MainColor"])
						.setDescription(`Prefix set to: \`${args[0]}\``);

					message.reply({ embeds: [success], allowedMentions: { repliedUser: true } });
			});
        } else {
            const invalid = new Discord.MessageEmbed()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescription('You don\'t have permission to change my prefix!')

            return message.reply({ embeds: [invalid], allowedMentions: { repliedUser: true } })
        }
    },
    async slashExecute(client, Discord, interaction) {

        await interaction.deferReply({ ephemeral: false });

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Prefix Changed!",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }


		if (interaction.member.permissions.has("MANAGE_GUILD")) {
			client.utils.updateServer(client, interaction.guild.id, { prefix: interaction.options.get("prefix").value }).then(() => {

                const embed = new Discord.MessageEmbed()
                    .setAuthor(authorSuccess)
                    .setColor(colors["MainColor"])
                    .setDescription(`Prefix set to: \`${interaction.options.get("prefix").value}\``)

                interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
			});
		} else {
			const permsEmbed = new Discord.MessageEmbed()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
				.setDescription("You don\'t have permission to change my prefix!")

			interaction.editReply({ embeds: [permsEmbed], allowedMentions: { repliedUser: true } });

            setTimeout(function() {
                interaction.deleteReply()
            }, 5000);
		}
	},
};