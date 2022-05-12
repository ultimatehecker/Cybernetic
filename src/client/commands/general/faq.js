const colors = require("../../tools/colors.json");

module.exports = {
    name: "faq",
    aliases: [],
    description: "Gives all the credits where credits is due in the making for this Discord client",
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

        const credits = new Discord.MessageEmbed()
            .setAuthor(author)
            .setColor(colors["MainColor"])
            .setDescription(`Not currently working, come back later...`)

        return message.reply({ embeds: [credits], allowedMentions: { repliedUser: true } });
    },
    async slashExecute(client, Discord, interaction){

		await interaction.deferReply({ ephemeral: false });

        let author = {
            name: "Cybernetic FAQ",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

		const embed = new Discord.MessageEmbed()
			.setAuthor(author)
			.setColor(colors["MainColor"])
			.setDescription(`Not currently working, come back later...`)

		interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
	}
}