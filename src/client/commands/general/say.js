const colors = require("../../tools/colors.json");

module.exports = {
    name: "say",
    aliases: [],
    description: "Responds with something that you say that is coming from the client",
	options: [
		{
			name: "message",
			description: "The message I should repeat",
			type: "STRING",
			required: true,
		},
	],
    defaultPermission: true,
    usage: "say {content}",
    example: "say Cybernetic is the best Discord bot ever!",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        const content = args.join(" ");
        const user = message.mentions.users.first();

        const joined = `\`${message.author.tag}\` said: ${content}`

        if(!content) {
            const content404 = new Discord.MessageEmbed()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescription(`You need to enter something to say`)

            return message.reply({ embeds: [content404], allowedMentions: { repliedUser: true } }).then(() => {
                setTimeout(function() {
                    message.delete()
                }, 5000);
            })
        }

        if(message.member.permissions.has("ADMINISTRATOR")) {
            message.channel.send(content).then(() => {
                message.delete();
            })
        } else {
            message.channel.send(joined).then(() => {
                message.delete();
            })
        }
    },
    async slashExecute(client, Discord, interaction) {

		await interaction.deferReply({ ephemeral: false });

        let author = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

		if (interaction.user.id === "724798908278112309" && interaction.options.get("message").value.startsWith("~")) {
			interaction.channel.send(`${interaction.options.get("message").value.slice(1)}`);

			const embed = new Discord.MessageEmbed()
				.setAuthor(author)
				.setColor(colors["MainColor"])
				.setDescription("Done!")

			interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
		} else {
			interaction.reply({ content: `**${interaction.user.tag}:** ${interaction.options.get("message").value}`, allowedMentions: { parse: ["everyone", "roles", "users"], users: [], roles: [] } });
		}
	}
};