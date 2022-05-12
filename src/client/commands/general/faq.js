const colors = require("../../tools/colors.json");

module.exports = {
    name: "faq",
    aliases: [],
    description: "Gives you common questions asked about Cybernetic",
	options: [],
    defaultPermission: true,
    usage: "faq",
    example: "faq",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping();

        let author = {
            name: "Cybernetic FAQ",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        const faq = new Discord.MessageEmbed()
            .setAuthor(author)
            .setColor(colors["MainColor"])
            .setDescription(`When will the full version of Cybernetic be released? \n *The full version of Cybernetic will probably be released when skyblock commands have been added, because then there will be a good reason to release it and there will be still more that could be added* \n \n What will your response be to the new message intent being removed for verified bots? \n *When I fully release the bot, it will still have the message based commands, but if it gains enough traction and interest, there will be a reason to verify it and then move it to solely interaction based commands*`)

        return message.reply({ embeds: [faq], allowedMentions: { repliedUser: true } });
    },
    async slashExecute(client, Discord, interaction){

		await interaction.deferReply({ ephemeral: false });

        let author = {
            name: "Cybernetic FAQ",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

		const faq = new Discord.MessageEmbed()
			.setAuthor(author)
			.setColor(colors["MainColor"])
			.setDescription(`When will the full version of Cybernetic be released? \n *The full version of Cybernetic will probably be released when skyblock commands have been added, because then there will be a good reason to release it and there will be still more that could be added* \n \n What will your response be to the new message intent being removed for verified bots? \n *When I fully release the bot, it will still have the message based commands, but if it gains enough traction and interest, there will be a reason to verify it and then move it to solely interaction based commands*`)

		interaction.editReply({ embeds: [faq], allowedMentions: { repliedUser: true } });
	}
}